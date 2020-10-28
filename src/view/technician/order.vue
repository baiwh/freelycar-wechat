<template>
  <div class="order">
    <div class="order-tab">
      <cube-tab-bar
        v-model="selectedLabelDefault"
        :data="tabs"
        show-slider
        @click="clickHandler"
      ></cube-tab-bar>
    </div>

    <!--待服务订单-->
    <div
      v-show="tabBar === '待接单'"
      v-for="(item, index) in orderList"
      :key="index"
    >
      <div class="order-card">
        <div class="order-card-head">
          <img src="./../../assets/car-head.png" alt />
          
          <b>订单号：{{ item.id }}</b>
          <span
            >{{ item.licensePlate }} {{ item.carColor }} ·
            {{ item.carBrand }}</span
          >
          <button
            @click="takeOrder(item.id, item.keyLocation)"
            :class="[!orderProcessing ? 'bg-blue' : 'bg-gray']"
          >
            接单
          </button>
        </div>
        <!-- <div class="order-card-info" @click="orderDetail(item.id,item.arkSn)"> -->
        <div class="order-card-info">
          <div>
            车主姓名<span> {{ item.clientName }}</span>
          </div>
          <div>
            下单时间<span> {{ item.createTime }}</span>
          </div>
          <div>
            预约项目<b>{{ item.projectNames }}</b>
          </div>
          <div>
            钥匙位置<span> {{ item.keyLocation }}</span>
          </div>
          <div>
            车辆停放位置<span> {{ item.parkingLocation }}</span>
          </div>
          <div class="order-detail-other">
            <span @click="showCarImg">
              <img src="./../../assets/my-car-img.png" alt />车辆照片
            </span>
            <span @click="callUser(item)">
              <img src="./../../assets/call-service.png" alt />联系车主
            </span>
          </div>
          <!-- </div> -->
          <!-- <img class="order-card-more" src="./../../assets/more.png" alt=""> -->
        </div>
      </div>
      <!-- 查看图片模态框 -->
      <div class="dialog-layer" v-show="isCarImgShow">
        <div class="dialog-box-black my-order-dialog-box">
          <img
            src="./../../assets/close.png"
            @click="showCarImg"
            class="dialog-box-black-close"
            alt
          />
          <img :src="item.carImageUrl" class="dialog-car-img" alt />
          <div v-show="!item.carImageUrl" class="dialog-box-black-text">
            车主未上传照片
          </div>
        </div>
      </div>
    </div>

    <!--服务中订单-->
    <div v-show="tabBar === '服务中'">
      <div
        class="order-card"
        v-for="(item, index) in myOrderList"
        v-show="item.state == '1'"
        @click="
          myOrderDetail(
            item.id,
            item.arkSn,
            item.userKeyLocationSn,
            item.userKeyLocation
          )
        "
        :key="index"
      >
        <div class="order-card-head">
          <img src="./../../assets/car-head.png" alt />
          <b>订单号：{{ item.id }}</b>
          <span
            >{{ item.licensePlate }} {{ item.carColor }} ·
            {{ item.carBrand }}</span
          >
        </div>
        <div class="order-card-myorder">
          <div>
            车主姓名
            <span>{{ item.clientName }}</span>
          </div>
          <div>
            接单时间
            <span>{{ item.pickTime }}</span>
          </div>
          <div>
            预约项目
            <b>{{ item.projectNames }}</b>
          </div>
          <div>
            钥匙位置
            <span>{{ item.userKeyLocation }}</span>
          </div>
          <div>
            车辆位置
            <span>{{ item.parkingLocation }}</span>
          </div>
          <div class="order-detail-other">
            <span @click="showCarImg">
              <img src="./../../assets/my-car-img.png" alt />车辆照片
            </span>
            <span @click="callUser(item)">
              <img src="./../../assets/call-service.png" alt />联系车主
            </span>
          </div>
          <button
            :class="[
              item.userKeyLocationSn.split('-')[0] === arkSn
                ? 'orange'
                : 'gray',
            ]"
          >
            确认完工
          </button>
        </div>
        <img
          class="order-card-myorder-more"
          src="./../../assets/more.png"
          alt
        />
      </div>
      <!-- 新增接单状态 -->
      <div
        class="order-card order-card-scan"
        v-for="item in myOrderList"
        v-show="item.state == '-1'"
        :key="item.id"
      >
        <div class="order-card-head">
          <img src="./../../assets/car-head.png" alt />
          <b>订单号：{{ item.id }}</b>
          <span
            >{{ item.licensePlate }} {{ item.carColor }} ·
            {{ item.carBrand }}</span
          >
        </div>
        <div class="order-card-myorder">
          <div>
            车主姓名
            <span>{{ item.clientName }}</span>
          </div>
          <div>
            接单时间
            <span>{{ item.orderTakingTime }}</span>
          </div>
          <div>
            预约项目
            <b>{{ item.projectNames }}</b>
          </div>
          <div>
            钥匙位置
            <span>{{ item.userKeyLocation }}</span>
          </div>
          <div>
            车辆位置
            <span>{{ item.parkingLocation }}</span>
          </div>
          <div class="order-detail-other">
            <span @click="showCarImg">
              <img src="./../../assets/my-car-img.png" alt />车辆照片
            </span>
            <span @click="callUser(item)">
              <img src="./../../assets/call-service.png" alt />联系车主
            </span>
          </div>
          <button class="order-close" @click="cancelOrder(item.id)">
            取消接单
          </button>
          <button class="order-scan" @click="scan">扫码开柜</button>
        </div>
        <div class="dialog-layer" v-show="isCarImgShow">
          <div class="dialog-box-black my-order-dialog-box">
            <img
              src="./../../assets/close.png"
              @click="showCarImg"
              class="dialog-box-black-close"
              alt
            />
            <img :src="item.carImageUrl" class="dialog-car-img" alt />
            <div v-show="!item.carImageUrl" class="dialog-box-black-text">
              车主未上传照片
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已完成 -->
    <div v-show="tabBar === '已完成'">
      <div v-show="!msg.length">暂无历史订单</div>
      <div class="order-card" v-for="(item, index) in msg" :key="index">
        <div class="order-card-head">
          <img :src="item.carImageUrl==''?'/wechat/static/img/car-head.35ecc33.png':item.carImageUrl" alt />
          <b>订单号：{{ item.id }}</b>
          <span
            >{{ item.licensePlate }} {{ item.carColor }} ·
            {{ item.carBrand }}</span
          >
        </div>
        <span
          v-clipboard:copy="item.id"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="history-order-copy"
          >复制</span
        >
        <div class="order-card-myorder">
          <div>车主姓名<span>{{item.clientName}}</span></div>
          <div>完工时间<span>{{item.finishTime}}</span></div>
          <div>预约项目 <b>{{item.projectNames}}</b></div>
          <div>钥匙位置<span>{{item.keyLocation}}</span></div>
          <div>停放位置<span>{{item.parkingLocation}}</span></div>
          <div>支付状态<span>{{item.payState}}</span></div>
        </div>
      </div>
    </div>

    <!--开门成功-->
    <open-door
      ref="openDoor"
      :ark-info-state="arkInfoState"
      v-show="isOpenDoorShow"
    ></open-door>
    <success
      ref="success"
      :ark-info-state="arkInfoState"
      v-show="isSuccessShow"
    ></success>

    <div class="history-order-search">
      <input
        v-model="search"
        type="text"
        placeholder="请输入订单号或车牌号来搜索订单"
      />
      <img @click="getOrders" src="./../../assets/search.png" alt />
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  name: "order",
  data() {
    return {
      msg: [],
      selectedLabelDefault: "待接单",
      tabs: [
        {
          label: "待接单",
        },
        {
          label: "服务中",
        },
        {
          label: "已完成",
        },
      ],
      search: "",
      orderList: [],
      myOrderList: [],
      tabBar: "待接单",
      arkSn: "",
      isOpenDoorShow: false,
      isSuccessShow: false,
      arkInfoState: "tecGetKey",
      orderProcessing: false,
      isCarImgShow: false,
      // 车辆图片
      carImageUrl: "",
      getkey: false,
    };
  },
  methods: {
    // 待服务
    getOrders() {
      this.$get("/wechat/order/listReservationOrders", {
        licensePlate: this.search,
        employeeId: localStorage.getItem("employeeId"),
      }).then((res) => {
        console.log(res);
        this.orderList = res;
        if (this.myOrderList.length > 0) {
          this.orderProcessing = true;
        }
      });
    },

    // 已接到
    getFinishOrders() {
      this.$get("/wechat/order/listServicingOrders", {
        licensePlate: this.search,
        employeeId: localStorage.getItem("employeeId"),
      }).then((res) => {
        console.log(res);
        this.myOrderList = res;
        this.getOrders();
      });
    },
    //已完成
    // 获取订单列表
    getOrderList() {
      this.$get("/wechat/employee/listHistoryOrders", {
        employeeId: localStorage.getItem("employeeId"),
        // keyword: this.keyword,
      }).then((res) => {
        this.msg = res;
        console.log(res);
      });
    },

    // 切换菜单
    clickHandler(label) {
      this.tabBar = label;
    },

    // 订单详情
    orderDetail(id, arkSn) {
      if (this.orderProcessing) {
        this.toast = this.$createToast({
          txt: "您有尚未完成的订单，不可接单",
          type: "txt",
        });
        this.toast.show();
      } else {
        this.$router.push({
          path: "/orderDetail",
          query: { orderId: id, tabBar: 0, arkSn: arkSn },
        });
      }
    },
    // 获取车辆照片
    showCarImg() {
      // console.log(item)
      this.isCarImgShow = !this.isCarImgShow;
    },

    //联系车主
    //传入遍历的一项
    callUser(item) {
      this.$createDialog({
        type: "confirm",
        title: "提示",
        content: "您是否确认" + item.licensePlate + "拨打车主电话？",
        confirmBtn: {
          text: "确认",
          active: true,
          disabled: false,
          href: "javascript:;",
        },
        cancelBtn: {
          text: "取消",
          active: false,
          disabled: false,
          href: "javascript:;",
        },
        onConfirm: () => {
          window.location.href = "tel:" + item.phone;
        },
        onCancel: () => {
          console.log("取消");
        },
      }).show();
    },
    // 接单
    takeOrder(id, keyLocation) {
      // 判断是否有正在进行的单子
      if (this.orderProcessing) {
        this.toast = this.$createToast({
          txt: "您有尚未完成的订单，不可接单",
          type: "txt",
        });
        this.toast.show();
      } else {
        //修改为先接单再扫码开柜的状态
        this.$get("/wechat/ark/orderTaking", {
          orderId: id,
          employeeId: localStorage.getItem("employeeId"),
        }).then((res) => {
          console.log("接单成功");
        });
        window.scrollTo(0, 0);
        this.arkInfoState = "tecGetKey";
        this.$refs.success.changeTxt("tecGetKey");
        this.isSuccessShow = true;
        // setTimeout(()=>{
        //   this.isSuccessShow=false
        //   this.tabBar = '已接到订单'
        //   this.selectedLabelDefault='服务中'
        //   this.getFinishOrders();
        // },3000)
      }
    },

    // 接车的一键开柜
    pickOpen(id, keyLocation) {
      this.$get("/wechat/ark/pickCar", {
        orderId: id,
        employeeId: localStorage.getItem("employeeId"),
      }).then((res) => {
        this.isSuccessShow = true;
        setTimeout(() => {
          // this.$router.push({path:'/order'})
          this.isOpenDoorShow = false;
          this.isSuccessShow = false;
          this.tabBar = "已接到订单";
          window.location.reload();
        }, 3000);
      });
    },

    // 已经到订单详情
    myOrderDetail(id, arkSn, userKeyLocationSn, userKeyLocation) {
      let sn = userKeyLocationSn.split("-")[0];
      console.log(sn);
      if (sn === localStorage.getItem("arkSn")) {
        this.$router.push({
          path: "/orderDetail",
          query: { orderId: id, tabBar: 1, arkSn: arkSn },
        });
      } else {
        alert("请将钥匙归还至接单的智能柜：" + userKeyLocation.split("-")[0]);
      }
    },

    //取消订单
    cancelOrder(id) {
      this.$createDialog({
        type: "confirm",
        title: "提示",
        content: "您是否确认取消该订单！",
        confirmBtn: {
          text: "确认",
          active: true,
          disabled: false,
          href: "javascript:;",
        },
        cancelBtn: {
          text: "取消",
          active: false,
          disabled: false,
          href: "javascript:;",
        },
        onConfirm: () => {
          this.$get("/wechat/ark/cancelOrderTaking", {
            orderId: id,
            employeeId: localStorage.getItem("employeeId"),
          }).then((res) => {
            this.toast = this.$createToast({
              txt: "取消成功",
              type: "txt",
            });
            this.toast.show();
            window.location.reload();
          });
        },
        onCancel: () => {
          console.log("取消");
        },
      }).show();
    },
    onCopy() {
      this.toast = this.$createToast({
        txt: "复制成功",
        type: "txt",
      });
      this.toast.show();
    },
    onError() {
      this.toast = this.$createToast({
        txt: "复制失败",
        type: "txt",
      });
      this.toast.show();
    },
    // 微信注入权限
      wxConfig() {
        this.$get('/wechat/config/getJSSDKConfig',{
            targetUrl:location.href
          }
        ).then(res => {
          this.configInfo = res
          console.log(res)
          wx.config({
            debug: false,
            appId: this.configInfo.appId,
            timestamp: this.configInfo.timestamp,
            nonceStr: this.configInfo.nonceStr,
            signature: this.configInfo.signature,
            jsApiList: [
              'checkJsApi',
              'scanQRCode'
            ]
          })
          // 需要检测的JS接口列表
          wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: function (res) {
              console.log(res)
            },
            fail: function (error) {
              console.log(error)
            }
          })
          wx.ready(()=> {
            console.log('微信接口成功')
          })
          wx.error(function (res) {
            console.log(res)
          })
        })
      },
      scan(){
        //微信扫一扫
        console.log('直接扫码')
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            console.log("res")
          }
        })
      },
  },
  mounted: function () {
    this.wxConfig();
    this.getOrders();
    this.getFinishOrders();
    this.getOrderList(); //已接到
    this.arkSn = localStorage.getItem("arkSn");
    if (this.$route.query.tabBar) {
      this.tabBar = this.$route.query.tabBar;
    }
  },
};
</script>

<style scoped lang="stylus">
/* 高度宽度 */
h(n) {
  n * 0.13vw;
}

w(n) {
  ((n / 7.5vw));
}

.order {
  padding: 0 0 h(140) 0;
}

.cube-tab-bar {
  padding: 10px 0;
}

.order-tab {
  background: white;
}

.bg-blue {
  background: #2049BF;
}

.bg-gray {
  background: darkgray;
}

.history-order-search {
  height: h(138);
  width: 100vw;
  background: url('./../../assets/search-bg.png');
  background-size: 100% 100%;
  z-index: 10;
  position: fixed;
  bottom: 0;
}

.history-order-search img {
  height: w(30);
  width: w(30);
  position: absolute;
  bottom: h(28);
  right: w(53);
}

.history-order-search input {
  height: h(60);
  width: w(710);
  border-radius: h(30);
  position: absolute;
  bottom: h(13);
  left: w(20);
  font-size: w(20);
  padding-left: w(33);
  box-sizing: border-box;
}

.order-card {
  background: white;
  height: h(440);
  width: w(727);
  margin: w(12);
  padding: 0 w(29);
  box-sizing: border-box;
  position: relative;
}

.order-card-scan {
  height: h(500);
}

.order-card-head {
  height: h(90);
  border-bottom: $border-gray;
  position: relative;

  img {
    height: w(67);
    width: w(67);
    border-radius: w(35);
    position: absolute;
    top: h(12);
  }

  button {
    height: h(46);
    width: w(110);
    color: white;
    border-radius: h(25);
    border: transparent;
    position: absolute;
    right: w(11);
    top: h(23);
  }

  b {
    font-size: w(20);
    position: absolute;
    top: h(16);
    left: w(95);
    color: #858585;
  }

  span {
    font-size: w(25);
    position: absolute;
    top: h(48);
    left: w(95);
  }
}

.order-card-info {
  height: h(210);
  margin: h(20) 0;
  font-size: w(25);
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  b {
    border: 1px solid #2049BF;
    color: #2049BF;
    padding: h(3) w(19);
    margin-right: w(10);
    border-radius: w(25);
    float: right;
  }

  span {
    float: right;
  }

  div {
    margin-bottom: h(25);
  }
}

.order-card-more {
  height: h(25);
  width: w(14);
  position: absolute;
  top: h(198);
  right: w(31);
}

.order-card-myorder {
  padding: h(35) 0;
  font-size: w(25);
  position: relative;

  .orange {
    background: #FFBD03;
  }

  .gray {
    background: gray;
  }

  div {
    margin-bottom: h(25);
  }

  span {
    float: right;
  }

  b {
    border: 1px solid #2049BF;
    color: #2049BF;
    padding: h(3) w(19);
    border-radius: w(25);
    float: right;
  }

  button {
    color: white;
    border: transparent;
    height: h(46);
    width: w(160);
    position: absolute;
    bottom: h(-15);
    right: w(-5);
    border-radius: h(25);
  }
}

.order-card-myorder-more {
  height: h(25);
  width: w(14);
  position: absolute;
  right: w(31);
  top: h(33);
}

.history-order-card {
  height: h(90);
  width: w(727);
  background: white;
  margin: 0 w(11) h(16) w(11);
  position: relative;
}

.history-order-card img {
  height: w(68);
  width: w(68);
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  left: w(30);
  border-radius: 50%;
}

.history-order-num {
  font-size: w(20);
  position: absolute;
  top: h(16);
  left: w(126);
}

.history-order-num b {
  color: #858585;
}

.history-order-info {
  font-size: w(25);
  position: absolute;
  top: h(48);
  left: w(126);
}

.history-order-copy {
  color: #2049BF;
  font-size: w(30);
  line-height: h(90);
  text-align: center;
  position: absolute;
  top: w(10);
  right: w(33);
}

.order-detail-other {
  color: #2049BF;

  span {
    float: left;
    margin: 0 w(10) 0 0;
  }

  img {
    height: w(26);
    width: w(26);
    margin: 0 w(10) 0 0;
    font-size: w(26);
  }
}

.my-order-dialog-box {
  height: h(900);
  width: w(600);
}

.order-card-myorder .order-scan {
  position: absolute;
  bottom: w(-60);
  right: 0;
  background-color: #2049bf;
}

.order-card-myorder .order-close {
  position: absolute;
  bottom: w(-60);
  right: w(170);
  background-color: #2049bf;
}
</style>
