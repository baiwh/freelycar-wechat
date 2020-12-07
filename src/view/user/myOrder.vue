<template>
  <div :class="orderClass">
    <img
      v-show="noOrderShow"
      class="my-order-kong"
      src="./../../assets/kong.png"
      alt=""
    />
    <div v-show="noOrderShow" class="my-order-kong-text">
      您还没有预约订单哦
    </div>
    <div class="order-card" v-for="(item, index) in msg" :key="index">
      <div class="order-state">
        <span
          :class="[
            item.state === 0 || item.state === 1 || item.state === 2 || item.state==-1
              ? 'order-state-title order-state-blue'
              : 'order-state-title order-state-gray',
          ]"
        >
          {{ orderStateTitle(item.state, item.payState) }}</span
        >
        <span class="order-state-time">{{ item.createTime }}</span>
      </div>

      <div class="order-info" @click="orderDetail(item.id)">
        <span class="order-info-brand"
          >{{ item.licensePlate }} {{ item.carBrand }}</span
        >
        <div>
          <span
            class="order-info-type"
            v-for="(itemP, indexP) in item.projectNames.split(',')"
            :key="indexP"
            >{{ itemP }}</span
          >
        </div>
        <span class="order-info-num">订单编号 {{ item.id }}</span>
        <img class="order-info-more" src="./../../assets/more.png" alt="" />
      </div>

      <div class="order-img" v-show="item.state === 2" @click="getImg(index)">
        <span>查看技师拍摄爱车状态照片</span>
        <img src="./../../assets/my-car-img.png" alt="" />
      </div>

      <div
        class="open-the-door"
        v-show="item.payState === 2 && item.state === 2"
      >
        <img src="./../../assets/call-service.png" alt="" />
        <a :href="['tel:' + storePhone]">
          <span>联系服务商</span>
        </a>
        <button @click="scan">扫码开柜</button>
      </div>

      <div class="payment" v-show="item.payState === 1 && item.state === 2">
        <span>待付款</span>
        <!--<span>￥{{item.actualPrice}}</span>-->
        <img src="./../../assets/call-service.png" alt="" />
        <a :href="['tel:' + storePhone]">
          <span class="payment-call-service">联系服务商</span>
        </a>
        <button @click="orderDetail(item.id)">立即支付</button>
      </div>
    </div>
    <div class="no-more-orders">暂无更多订单</div>

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

    <div class="dialog-layer" v-show="isCarImgShow">
      <div class="dialog-box-black my-order-dialog-box">
        <img
          src="./../../assets/close.png"
          @click="getImg('close')"
          class="dialog-box-black-close"
          alt=""
        />
        <img :src="staffOrderImgUrl" class="dialog-car-img" alt="" />
        <i class="cubeic-back imgfont imgfont-left" @click="changeImgIndex('-1')"></i>
        <i class="cubeic-arrow imgfont imgfont-right" @click="changeImgIndex('1')"></i>
        <div v-show="!staffOrderImgUrl" class="dialog-box-black-text">
          技师未上传照片
        </div>
      </div>
    </div>

    <div v-show="msg.length > 0 ? msg[0].state >= 3 : true">
      <button class="big-blue-btn" @click="scan">扫码预约</button>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  name: "myOrder",
  data() {
    return {
      orderClass: "my-order",
      msg: [],
      clientId: "",
      arkInfoState: "billingOrder",
      isOpenDoorShow: false,
      isSuccessShow: false,
      storePhone: "025-86697165",
      isCarImgShow: false,
      staffOrderImgUrls:[],
      staffOrderImgUrl: "",
      noOrderShow: false,
      arkSn: null,
      configInfo: {},
      imglength:'',
      imgindex:'',
    };
  },
  methods: {
    // 获取订单列表
    getOrderList() {
      this.$get("/wechat/order/listOrdersByClient", {
        clientId: localStorage.getItem("clientId"),
      }).then((res) => {
        console.log(res);
        if (res != null) {
          this.msg = res;
          console.log(res);
        }
        if (this.msg.length === 0) {
          console.log(this.msg);
          this.noOrderShow = true;
        }
      });
    },

    // 订单详情
    orderDetail(id) {
      this.$router.push({ path: "/payOrder", query: { orderId: id } });
    },

    //      显示车照片
    getImg(index) {
      console.log(index)
      if(index!='close'){
        this.staffOrderImgUrls = this.msg[index].staffOrderImgUrl.split(',');
        console.log(this.staffOrderImgUrls)
      this.imglength = this.staffOrderImgUrls.length;
      this.staffOrderImgUrl = this.staffOrderImgUrls[0];
      this.imgindex= 0;
      }
      this.isCarImgShow = !this.isCarImgShow;
    },
    changeImgIndex(index){
      if(index=='-1'){
        this.staffOrderImgUrl = this.staffOrderImgUrls[(this.imgindex-1+this.imglength)%this.imglength]
        this.imgindex = (this.imgindex-1+this.imglength)%this.imglength
      }else if(index=="1"){
        this.staffOrderImgUrl = this.staffOrderImgUrls[(this.imgindex+1+this.imglength)%this.imglength]
        this.imgindex = (this.imgindex+1+this.imglength)%this.imglength
      }
    },

    openDoor(id) {
      this.$createDialog({
        type: "confirm",
        title: "是否现在打开柜门？",
        confirmBtn: {
          text: "是,在柜前",
          active: true,
          disabled: false,
          href: "javascript:;",
        },
        cancelBtn: {
          text: "否,不在柜前",
          active: false,
          disabled: false,
          href: "javascript:;",
        },
        onConfirm: () => {
          this.$get("/wechat/ark/getStaffKeyLocation", {
            orderId: id,
          }).then((res) => {
            this.orderClass = "my-order stop-scroll";
            this.arkInfoState = "payOrder";
            let local = res.staffKeyLocation.split("-");
            this.$refs.openDoor.changeTxt("payOrder", local[1]);
            this.isOpenDoorShow = true;
            this.$get("/wechat/ark/orderFinish", {
              id: id,
            }).then((res) => {
              this.$refs.successArk.changeTxt("payOrder");
              this.isSuccessShow = true;
              setTimeout(() => {
                this.$router.push({ path: "/myOrder" });
              }, 3000);
            });
          });
        },
        onCancel: () => {
          console.log("取消开柜");
        },
      }).show();
    },

    // 标题
    orderStateTitle(state, payState) {
      switch (state) {
        case -1:
          return "进行中的订单";
        case 0:
          return "进行中的订单";
        case 1:
          return "进行中的订单";
        case 2: {
          if (payState === 2) {
            return "已支付订单";
          } else {
            return "未支付订单";
          }
        }
        case 3:
          return "已完成订单";
        case 4:
          return "已取消订单";
      }
    },
    wxConfig() {
      this.$get("/wechat/config/getJSSDKConfig", {
        targetUrl: location.href,
      }).then((res) => {
        this.configInfo = res;
        console.log(res);
        wx.config({
          debug: false,
          appId: this.configInfo.appId,
          timestamp: this.configInfo.timestamp,
          nonceStr: this.configInfo.nonceStr,
          signature: this.configInfo.signature,
          jsApiList: ["checkJsApi", "scanQRCode"],
        });
        // 需要检测的JS接口列表
        wx.checkJsApi({
          jsApiList: ["scanQRCode"],
          success: function (res) {
            console.log(res);
          },
          fail: function (error) {
            console.log(error);
          },
        });
        wx.ready(() => {
          console.log("微信接口成功");
        });
        wx.error(function (res) {
          console.log(res);
        });
      });
    },

    scan() {
      //微信扫一扫
      console.log("直接扫码");
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          console.log(res);
        },
      });
    },
  },
  mounted: function () {
    this.wxConfig();
    if (localStorage.getItem("staffId")) {
      this.$router.push({ path: "/order" });
    } else {
      this.arkSn = localStorage.getItem("arkSn");
      if (localStorage.getItem("clientId")) {
        this.clientId = this.$route.query.id;
        // this.storePhone = localStorage.getItem('storePhone')
        this.getOrderList();
      } else {
        this.$router.push({ path: "/login" });
      }
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
  (n / 7.5vw);
}

.no-more-orders {
  text-align: center;
  margin: h(50);
  color: #888888;
}

.my-order-kong {
  width: w(219);
  height: w(219);
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 35%;
}

.my-order-kong-text {
  font-size: w(28);
  color: #858585;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}

.stop-scroll {
  overflow: hidden;
  height: 100vh;
  position: fixed;
}

.my-order {
  background: #EEEEEE;
  padding-top: h(20);
  padding-bottom: h(300);
}

.order-card {
  background: white;
  width: 100 vw-w(24);
  margin: 0 h(20) h(20) h(20);
  padding: 0 w(32);
}

.order-card div {
  display: flex;
  width: w(666);
  border-bottom: $border-gray;
  overflow: scroll;
}

.order-state {
  justify-content: space-between;
  align-items: center;
  height: h(96);
}

.order-state-title {
  font-size: w(27);
}

.order-state-blue {
  color: #2049BF;
}

.order-state-gray {
  color: #858585;
}

.order-state-time {
  color: #858585;
  font-size: w(25);
}

.order-info {
  height: h(250);
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: h(10) 0 0 0;
}

.order-info-brand {
  font-size: w(26);
}

.order-info-num {
  font-size: w(26);
  color: #C0C0C0;
  margin: h(20) 0;
}

.order-info-more {
  height: h(25);
  width: w(14);
  position: absolute;
  right: w(41);
}

.order-info-type {
  flex: none;
  border: 1px solid #2049BF;
  background: white;
  color: #2049BF;
  font-size: w(24);
  border-radius: 28px;
  padding: h(10) w(20);
  margin: h(30) w(20);
}

.order-img {
  height: h(89);
  font-size: w(24);
  color: #2049BF;
  justify-content: space-between;
  align-items: center;
}

.order-img img {
  height: w(32);
  width: w(32);
}

.open-the-door {
  height: h(89);
  align-items: center;
  font-size: w(23);
  color: #2049BF;
}

.open-the-door img {
  height: w(25);
  width: w(25);
  margin: 0 w(5);
}

.open-the-door button {
  height: h(55);
  width: w(190);
  background: $bt-blue;
  color: white;
  border: transparent;
  border-radius: w(30);
  right: w(41);
  position: absolute;
}

.payment {
  height: h(89);
  align-items: center;
  font-size: w(30);
  color: #FFBD03;
}

.payment img {
  height: w(25);
  width: w(25);
  margin: 0 w(5) 0 w(36);
}

.payment button {
  height: h(55);
  width: w(190);
  background: $bt-blue;
  color: white;
  border: transparent;
  border-radius: w(30);
  right: w(41);
  position: absolute;
}

.payment-call-service {
  color: #2049BF;
  font-size: w(23);
}

.my-order-dialog-box {
  height: h(900);
  width: w(600);
}
.imgfont{
  color white;
  font-size w(90)
}
.imgfont-left{
  position absolute
  left h(-60)
  top h(400)
}
.imgfont-right{
  position absolute
  right h(-60)
  top h(400)
}
</style>
