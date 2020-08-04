<template>
  <div></div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      trueName: "",
      arkSn: "",
      userInfo: {},
      code: ""
    };
  },
  created(){
     // console.log(localStorage.getItem('frompage'))
      this.redirect = this.$route.query.redirect
      this.arkSn=localStorage.getItem('arkSn')
      //获取redirect的值并缓存，当值存在并改变时，改变redirect的值
      if(typeof(this.$route.query.redirect) !== "undefined"){
        localStorage.setItem('redirect',this.redirect)
      }
  },
  mounted: function() {
    this.arkSn = this.$route.params.arkSn;
    console.log(this.arkSn)
    localStorage.setItem("arkSn", this.arkSn);
    this.checkSubscribe();
  },
  methods: {
    // 是否登录过
    isLogin() {
      if (localStorage.getItem("jwt")) {
        //如果技师已经登录，直接去接单页
        if (
          localStorage.getItem("staffId") !== null &&
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
        this.$router.push({ path: "/login" });
      }
    },

    // 判断技师的网点
    getArkInfo() {
      this.$get("/wechat/ark/getArkInfo", {
        arkSn: this.arkSn
      }).then(res => {
        localStorage.setItem("arkName", res.name);
        if (res.storeId === localStorage.getItem("storeId")) {
          // 判断技师是否开通智能柜
          this.$get("/wechat/staff/isCurrentArk", {
            staffId: localStorage.getItem("staffId")
          }).then(res => {
            if (res) {
              console.log("网点没有切换，直接跳转到order路径");
              this.$router.push({ path: "/order" });
            } else {
              alert("您没有智能柜服务权限，详情请咨询网点");
              localStorage.clear();
              this.$router.push({ path: "/login" });
            }
          });
        } else {
          // 更新网点信息
          this.$post("/wechat/employee/selectStore", {
            id: localStorage.getItem("employeeId"),
            defaultStoreId: res.storeId
          }).then(res => {
            if (res) {
              localStorage.setItem("storeId", res.defaultStoreId);
              localStorage.setItem("storeName", res.defaultStoreName);
              localStorage.setItem("staffId", res.defaultStaffId);
            }
            this.$router.push({ path: "/order" });
          });
        }
      });
    },

    // 判断用户的网点
    getUserArkInfo() {
      this.$get("/wechat/ark/getArkInfo", {
        arkSn: this.arkSn
      }).then(res => {
        localStorage.setItem("arkName", res.name);
        if (res.storeId === localStorage.getItem("storeId")) {
          this.getOrderState();
        } else {
          // 更新网点信息
          this.$post("/wechat/wxuser/chooseDefaultStore", {
            id: localStorage.getItem("id"),
            defaultStoreId: res.storeId
          }).then(res => {
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
        arkSn: this.arkSn
      })
        .then(res => {
          if (res && res.length > 0) {
            if (res[0].state < 3) {
              this.$router.push({ path: "/myOrder" });
            } else {
              this.$router.push({ path: "/billingOrder" });
            }
          } else {
            this.$router.push({ path: "/billingOrder" });
          }
        })
        .catch(err => {
          if (err === "智能柜已满") {
            wx.closeWindow();
          }
          console.log("捕捉测试err", err);
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
          code: this.code
        }).then(res => {
          console.log(res);
          console.log(res.subscribe)
          localStorage.setItem("subscribe", res.subscribe);
          console.log("是否关注微信公众号" + localStorage.getItem("subscribe"));
          // 是否关注公众号
          if (localStorage.getItem("subscribe") == "false") {
            window.location.href =
              "http://mp.weixin.qq.com/s?__biz=MzAxNDMwNDc3Mw==&mid=502678227&idx=1&sn=22cc3edc520a3058aa5b2aed5f376904&chksm=0397b1b934e038af1b3802e6b993461d18e5780b2349fe339c3fa82a3bee6586a3650d531ee4#rd";
          }else{
            this.isLogin();
          }
        });
      } else {
        //console.log('未授权')
        // 开发
        // window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd188f8284ee297b&redirect_uri=http%3a%2f%2fwww.freelycar.cn%2fwechat%2frole-select%2f'+this.arkSn+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        window.location.href ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd188f8284ee297b&redirect_uri=https%3a%2f%2fwww.freelycar.com%2fwechat%2frole-select%2f" +this.arkSn +"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        // 线上
      }
    },

    //判断参数是否存在
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      console.log(reg)
      var r = window.location.search.substr(1).match(reg);
      console.log(r)
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    }
  }
};
</script>

