<template>
  <div>
    <open-door
      ref="openDoor"
      :ark-info-state="arkInfoState"
      v-show="isOpenDoorShow"
    ></open-door>
    <success
      ref="successArk"
      :ark-info-state="arkInfoState"
      v-show="isSuccessShow"
    ></success>
    <link-failure
      v-show="isFailure"
    ></link-failure>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import LinkFailure from './linkFailure.vue';
export default {
  data() {
    return {
      trueName: "",
      arkSn: "",
      userInfo: {},
      code: "",
      isOpenDoorShow: false,
      isSuccessShow: false,
      arkInfoState: "tecGetKey",
      doorId: "",
      usertimer: null,
      emtimer: null,
      isFailure:false,
      createTime:"",
      timestamp:"",
    };
  },
  components:{
    LinkFailure
  },
  mounted() {
    this.createTime = this.$route.query.createTime
    this.timestamp = Date.parse( new Date() ).toString().substr(0,10);
    this.arkSn = this.$route.params.arkSn;
    localStorage.setItem("arkSn", this.arkSn);
    if(this.createTime && (this.timestamp-this.createTime)>300){
      this.isFailure = true;
    }else{
      this.isLogin();
    }
  },
  beforeDestroy() {
    clearInterval(this.usertimer);
    clearInterval(this.emtimer);
    this.usertimer = null;
    this.emtimer = null;
  },
  methods: {
    // 是否登录过
    isLogin() {
      if (localStorage.getItem("jwt")) {
        //如果技师已经登录，直接去接单页
        if (
          localStorage.getItem("employeeId") !== null &&
          localStorage.getItem("jwt") !== null
        ) {
          //判断扫的柜子是哪个网点，帮ta切换过去/提醒他，没有这个柜子的操作权
          this.getArkInfo();
        }

        //如果用户已经登录，
        if (
          localStorage.getItem("jwt") !== null &&
          localStorage.getItem("clientId") !== null
        ) {
          this.trueName = localStorage.getItem("trueName");
          //若用户没有填写真实姓名，则先让其填写真实姓名
          if (this.trueName === "" || this.trueName === null) {
            alert("请完善您的真实姓名");
            this.$router.push({ path: "/userInfo" });
          } else {
            //通过扫码进来的要判断网点id与用户默认id是否相同
            this.getUserArkInfo();
          }
        }
      } else {
        this.$router.push({ path: "/login", query: { arkSn: this.arkSn } });
      }
    },

    // 判断技师的网点或直接开柜
    getArkInfo() {
      // 重写技师逻辑
      //1.先判断是否开通智能柜
      this.$get("/wechat/staff/isCurrentArk", {
        employeeId: localStorage.getItem("employeeId"),
      }).then((res) => {
        if (res) {
          //2.判断技师是否含有已接单订单
          this.$get("/wechat/order/listServicingOrders", {
            licensePlate: "",
            employeeId: localStorage.getItem("employeeId"),
          }).then((res) => {
            // 如果有订单
            if (res.length > 0) {
              console.log(res);
              var orderArksn = res[0].userKeyLocationSn.substr(0, 15);
              if (res[0].isBuffer) {
                //判断柜子是否未关闭
                this.getDoorState(res[0].id);
                //3秒请求一次定时器
                this.emtimer = setInterval(() => {
                  this.$get("/wechat/order/getDoorState", {
                    orderId: res[0].id,
                  }).then((stateres) => {
                    console.log(stateres);
                    if (!stateres.isBuffer && !stateres.isUser) {
                      clearInterval(this.emtimer);
                      this.$refs.successArk.changeTxt("tecFinish");
                      this.isSuccessShow = true;
                      setTimeout(() => {
                        this.$router.push({ path: "/order" });
                      }, 1000);
                    } else if (stateres.isUser) {
                      clearInterval(this.emtimer);
                      setTimeout(() => {
                        this.$router.push({ path: "/order" });
                      }, 1000);
                    }
                  });
                }, 3000);
              } else if (orderArksn == this.arkSn && res[0].state == -1) {
                //开柜
                this.pickOpen(res[0].id, res[0].userKeyLocation);
              } else {
                this.$router.push({ path: "/order" });
              }
            } else {
              this.$router.push({ path: "/order" });
            }
          });
        } else {
          alert("您没有智能柜服务权限，详情请咨询网点");
          localStorage.clear();
          this.$router.push({
            path: "/login",
            query: { arkSn: this.arkSn },
          });
        }
      });
    },
    getDoorState(id) {
      this.$get("/wechat/order/getDoorState", {
        orderId: id,
      }).then((stateres) => {
        // console.log(stateres;
        if (stateres.isBuffer && !stateres.isUser) {
          this.arkInfoState = "tecFinish";
          this.$refs.openDoor.changeTxt("tecFinish", stateres.doorSn);
          this.isOpenDoorShow = true;
        }
      }).catch((res)=>{
        console.log(res);
      });
    },

    pickOpen(id, keyLocation) {
      this.arkInfoState = "tecGetKey";
      let local = keyLocation.split("-");
      this.$refs.openDoor.changeTxt("tecGetKey", local[1]);
      this.isOpenDoorShow = true;
      this.$get("/wechat/ark/pickCar", {
        orderId: id,
        employeeId: localStorage.getItem("employeeId"),
      }).then((res) => {
        console.log(res);
        setTimeout(() => {
          this.isOpenDoorShow = false;
          this.$router.push({ path: "/order" });
        }, 1000);
      });
    },

    // 判断用户的网点
    getUserArkInfo() {
      this.$get("/wechat/ark/getArkInfo", {
        arkSn: this.arkSn,
      }).then((res) => {
        // console.log(res)
        localStorage.setItem("arkName", res.name);
        if (res.storeId === localStorage.getItem("storeId")) {
          this.getOrderState();
        } else {
          //扫码就要更新网点信息
          this.$post("/wechat/wxuser/chooseDefaultStore", {
            id: localStorage.getItem("id"),
            defaultStoreId: res.storeId,
          }).then((res) => {
            if (res) {
              localStorage.setItem("storeName", res.defaultStoreName);
              localStorage.setItem("storeId", res.defaultStoreId);
              localStorage.setItem("clientId", res.defaultClientId);
            }
            this.getOrderState();
          });
        }
      });
    },

    //      判断当前最新订单状态
    getOrderState() {
      this.$get("/wechat/order/listOrders", {
        clientId: localStorage.getItem("clientId"),
        type: "ark",
        arkSn: this.arkSn,
      })
        .then((res) => {
          console.log(res);
          if (res && res.length > 0) {
            if (res[0].state < 3 && res[0].payState != 2 && !res[0].isBuffer) {
              this.$router.push({ path: "/myOrder" });
            } else if (res[0].isBuffer) {
              this.getUserDoorState(res[0].id);
              this.usertimer = setInterval(() => {
                this.$get("/wechat/order/getDoorState", {
                  orderId: res[0].id,
                }).then((doorres) => {
                  // console.log(doorres);
                  if (doorres.isUser && !doorres.isBuffer) {
                    clearInterval(this.usertimer);
                    this.$refs.successArk.changeTxt("billingOrder");
                    this.isSuccessShow = true;
                    setTimeout(() => {
                      this.$router.push({ path: "/myOrder" });
                    }, 1000);
                    //如果是技师开柜
                  } else if (!doorres.isUser) {
                    clearInterval(this.usertimer);
                    setTimeout(() => {
                      this.$router.push({ path: "/myOrder" });
                    }, 1000);
                  }
                });
              }, 3000);
            }
            //已支付订单扫码
            else if (res[0].state == 2 && res[0].payState == 2) {
              //获取柜子ID
              this.$get("/wechat/ark/getStaffKeyLocation", {
                orderId: res[0].id,
              }).then((newres) => {
                // console.log(newres);
                this.arkInfoState = "payOrder";
                let local = newres.staffKeyLocation.split("-");
                this.$refs.openDoor.changeTxt("payOrder", local[1]);
                var orderArksn = newres.staffKeyLocationSn.substr(0, 15);
                console.log(orderArksn);
                //是当前柜子
                if (this.arkSn == orderArksn) {
                  this.userOpendoor(res[0].id);
                } else {
                  alert("非下单智能柜！");
                  this.$router.push({ path: "/myOrder" });
                }
              });
            } else {
              this.$router.push({
                path: "/billingOrder",
                query: { arkSn: this.arkSn },
              });
            }
          } else {
            this.$router.push({
              path: "/billingOrder",
              query: { arkSn: this.arkSn },
            });
          }
        })
        .catch((err) => {
          if (err === "智能柜已满") {
            wx.closeWindow();
          }
          console.log("捕捉测试err", err);
        });
    },
    getUserDoorState(id) {
      this.$get("/wechat/order/getDoorState", {
        orderId: id,
      }).then((stateres) => {
        console.log(stateres);
        if (stateres.isBuffer && stateres.isUser) {
          this.arkInfoState = "billingOrder";
          this.$refs.openDoor.changeTxt("billingOrder", stateres.doorSn);
          this.isOpenDoorShow = true;
        }
      });
    },
    //用户开柜
    userOpendoor(id) {
      this.isOpenDoorShow = true;
      this.$get("/wechat/ark/orderFinish", {
        id: id,
      }).then((res) => {
        this.$refs.successArk.changeTxt("payOrder");
        this.isSuccessShow = true;
        setTimeout(() => {
          this.$router.push({ path: "/myOrder" });
        }, 1000);
      });
    },
    //判断是否存在code参数
    checkSubscribe() {
      if (this.getQueryString("code") != null) {
        this.code = this.getQueryString("code");
        localStorage.setItem("code", this.code);
        console.log("code:" + this.code);
        //获取个人信息
        this.$get("/wechat/config/getWeChatUserInfo", {
          code: this.code,
        }).then((res) => {
          // console.log(res);
          // console.log(res.subscribe);
          localStorage.setItem("subscribe", res.subscribe);
          // console.log("是否关注微信公众号" + localStorage.getItem("subscribe"));
          // 是否关注公众号
          if (localStorage.getItem("subscribe") == "false") {
            window.location.href =
              "http://mp.weixin.qq.com/s?__biz=MzAxNDMwNDc3Mw==&mid=502678227&idx=1&sn=22cc3edc520a3058aa5b2aed5f376904&chksm=0397b1b934e038af1b3802e6b993461d18e5780b2349fe339c3fa82a3bee6586a3650d531ee4#rd";
          } else {
            this.isLogin();
          }
        });
      } else {
        //console.log('未授权')
        // 开发
        // window.location.href =
        //   "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd188f8284ee297b&redirect_uri=http%3a%2f%2fwww.freelycar.cn%2fwechat%2frole-select%2f" +
        //   this.arkSn +
        //   "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        window.location.href ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd188f8284ee297b&redirect_uri=https%3a%2f%2fwww.freelycar.com%2fwechat%2frole-select%2f" +this.arkSn +"&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
        // 线上
      }
    },

    //判断参数是否存在
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      console.log(reg);
      var r = window.location.search.substr(1).match(reg);
      console.log(r);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
  },
};
</script>

