<template>
  <div class="order-detail">
    <div class="order-detail-card">
      <div class="order-detail-head">
        <span>订单编号</span>
        <span>
          {{orderId}}
          <b v-clipboard:copy="orderId" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</b>
        </span>
      </div>

      <div class="order-detail-info">
        <div>
          车牌号
          <span>{{consumerOrder.licensePlate}}</span>
        </div>
        <div>
          品牌车系
          <span>{{consumerOrder.carColor}} · {{consumerOrder.carBrand}}</span>
        </div>
        <div>
          车主名字
          <span>{{consumerOrder.clientName}}</span>
        </div>
        <div>
          下单时间
          <span>{{consumerOrder.createTime}}</span>
        </div>
        <div class="order-detail-item">
          预约项目
          <span
            v-for="(item,index) in orderInfo.consumerProjectInfos"
            :key="index"
          >{{item.projectName}}</span>
        </div>
        <div>
          钥匙位置
          <span class="order-detail-key">
            {{tabBar===0?consumerOrder.userKeyLocation:consumerOrder.staffKeyLocation}}
            <img src="./../../assets/position-blue2.png" alt />
          </span>
        </div>
        <div>
          停放位置
          <span>{{consumerOrder.parkingLocation}}</span>
        </div>
      </div>

      <div class="order-detail-other">
        <span @click="callUser">
          <img src="./../../assets/call-service.png" alt />联系车主
        </span>
        <span @click="showCarImg">
          <img src="./../../assets/my-car-img.png" alt />车辆照片
        </span>
      </div>
    </div>

    <div class="order-detail-position" v-show="tabBar===1">
      <div class="order-detail-position-head">
        <span>
          <img src="./../../assets/position-blue.png" alt />车辆所在位置
        </span>
        <span class="order-detail-position-orange" @click="arkLocation">快速定位</span>
      </div>
      <cube-textarea v-model="parkingLocation" placeholder="请描述车辆停放的详细位置！"></cube-textarea>
    </div>

    <div class="order-detail-photo" v-show="tabBar===1">
      <div class="order-detail-position-head">
        <span>
          <img src="./../../assets/img.png" alt />上传车辆照片
        </span>
        <!--<img src="./../../assets/add1.png" alt="">-->
      </div>
      <cube-upload
        ref="upload"
        :action="action"
        :simultaneous-uploads="1"
        :max="1"
        @file-removed="fileRemoved"
        @file-success="fileSuccess"
        :process-file="processFile"
        @files-added="filesAdded"
        @file-submitted="fileSubmitted"
      ></cube-upload>
      <!--<img v-show="isImgShow" class="order-detail-photo-img" :src="staffOrderImg.url" alt="">-->
      <!--<img class="order-detail-photo-del" src="./../../assets/del-img.png" alt="">-->
    </div>

    <div class="order-detail-btn" v-show="!isOpenDoorShow">
      <button v-show="arkSn!==orderArkSn && tabBar===0" class="can-not-click">非当前智能柜，不可接单</button>
      <button v-show="arkSn===orderArkSn && tabBar===0" class="big-blue-btn" @click="takeOrder">接单</button>
      <button v-show="tabBar===1" class="big-blue-btn" @click="finishOrder">一键开柜</button>
      <button class="big-gray-btn" @click="cancelBtn">取消</button>
    </div>

    <!--查看图片模态框-->
    <div class="dialog-layer" v-show="isCarImgShow">
      <div class="dialog-box-black my-order-dialog-box">
        <img src="./../../assets/close.png" @click="showCarImg" class="dialog-box-black-close" alt />
        <img :src="carImageUrl" class="dialog-car-img" alt />
        <div v-show="!carImageUrl" class="dialog-box-black-text">车主未上传照片</div>
      </div>
    </div>

    <!--开门成功-->
    <open-door ref="openDoor" :ark-info-state="arkInfoState" v-show="isOpenDoorShow"></open-door>
    <success ref="success" :ark-info-state="arkInfoState" v-show="isSuccessShow"></success>
  </div>
</template>

<script>
import compress from "@/components/compress";
export default {
  name: "orderDetail",
  data() {
    return {
      msg: "",
      arkInfoState: "tecGetKey",
      orderArkSn: "",
      arkSn: "",
      orderId: "",
      tabBar: "",
      isImgShow: false,
      carImageUrl: "",
      staffOrderImg: {
        createTime: "2019-06-10 15:45:26",
        delStatus: false,
        id: 2,
        orderId: "",
        url: "",
      },
      orderInfo: {},
      consumerOrder: {},
      isCarImgShow: false,
      isOpenDoorShow: false,
      isSuccessShow: false,
      parkingLocation: "",
      //图片上传action
      action: {
        target:'https://www.freelycar.com/api/upload/staffOrderImg',
        // target: "http://192.168.0.168/api/upload/staffOrderImg",
        prop: "base64Value",
      },
    };
  },
  methods: {
    //图片压缩
    processFile(file, next) {
      compress(
        file,
        {
          compress: {
            width: 1600,
            height: 1600,
            quality: 0.8,
          },
        },
        next
      );
    },
    fileSubmitted(file) {
      file.base64Value = file.file.base64;
    },
    //图片过滤
    filesAdded(files) {
      let hasIgnore = false;
      const maxSize = 10 * 1024 * 1024; // 10M
      for (let k in files) {
        const file = files[k];
        if (file.size > maxSize) {
          file.ignore = true;
          hasIgnore = true;
        }
      }
      hasIgnore &&
        this.$createToast({
          type: "warn",
          time: 1000,
          txt: "上传的图片不能超过10M!",
        }).show();
    },
    // 获取订单详情
    getOrderDetail() {
      this.$get("/wechat/order/getOrderDetail", {
        id: this.orderId,
      }).then((res) => {
        console.log("----");
        console.log(res);
        this.orderInfo = res;
        this.consumerOrder = res.consumerOrder;
        this.carImageUrl = this.orderInfo.clientOrderImg.url;
      });
    },

    // 复制
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

    // 查看钥匙位置
    toLocationInfo() {
      //        this.$router.push({path:'/locationInfo'})
    },

    // 查看车辆照片
    showCarImg() {
      this.isCarImgShow = !this.isCarImgShow;
    },

    // 联系车主
    callUser() {
      this.$createDialog({
        type: "confirm",
        title: "提示",
        content:
          "您是否确认" + this.consumerOrder.licensePlate + "拨打车主电话？",
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
          window.location.href = "tel:" + this.consumerOrder.phone;
        },
        onCancel: () => {
          console.log("取消");
        },
      }).show();
    },

    // 取消按钮
    cancelBtn() {
      this.$router.go(-1);
    },

    // 接单
    takeOrder() {
      this.$createDialog({
        type: "confirm",
        title: "提示",
        content:
          "您是否确认在柜前开始" + this.consumerOrder.licensePlate + "的订单？",
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
          this.pickOpen();
        },
        onCancel: () => {
          console.log("取消");
        },
      }).show();
    },

    // 接车的一键开柜
    pickOpen() {
      window.scrollTo(0, 0);
      this.arkInfoState = "tecGetKey";
      let local = this.consumerOrder.userKeyLocation.split("-");
      this.$refs.openDoor.changeTxt("tecGetKey", local[1]);
      this.$refs.success.changeTxt("tecGetKey");
      this.isOpenDoorShow = true;
      this.$get("/wechat/ark/pickCar", {
        orderId: this.orderId,
        staffId: localStorage.getItem("staffId"),
      }).then((res) => {
        this.isSuccessShow = true;
        setTimeout(() => {
          this.$router.push({
            path: "/order",
            query: { tabBar: "已接到订单" },
          });
          this.isOpenDoorShow = false;
          this.isSuccessShow = false;
        }, 3000);
      });
    },

    // 快速定位
    arkLocation() {
      this.$get("/wechat/ark/getCurrentArkLocation", {
        arkSn: localStorage.getItem("arkSn"),
      }).then((res) => {
        this.parkingLocation = res;
      });
    },

    // 确认完工
    finishOrder() {
      if (this.parkingLocation) {
        this.$createDialog({
          type: "confirm",
          title: "提示",
          content:
            "您是否确认在柜前结束" +
            this.consumerOrder.licensePlate +
            "的订单？",
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
            this.finishOpen();
          },
          onCancel: () => {
            console.log("取消");
          },
        }).show();
      } else {
        this.toast = this.$createToast({
          txt: "请填写车辆所在位置",
          type: "txt",
        });
        this.toast.show();
      }
    },

    // 确认完工的一键开柜
    finishOpen() {
      this.$get("/wechat/ark/getEmptyDoor", {
        arkSn: this.arkSn,
      }).then((res) => {
        window.scrollTo(0, 0);
        this.arkInfoState = "tecFinish";
        this.$refs.openDoor.changeTxt("tecFinish", res.doorSn);
        this.isOpenDoorShow = true;
        this.finishOpenDoor(res.id);
      });
    },

    finishOpenDoor(id) {
      this.$post("/wechat/ark/finishCar", {
        consumerOrder: {
          id: this.orderId,
          parkingLocation: this.parkingLocation,
        },
        doorId: id,
        staffOrderImg: this.staffOrderImg,
      }).then((res) => {
        this.$refs.success.changeTxt("tecFinish");
        this.isSuccessShow = true;
        setTimeout(() => {
          this.$router.push({ path: "/order" });
        }, 3000);
      });
    },

    //上传按钮
    fileSuccess(e) {
      this.staffOrderImg.url = e.response.data.url;
      // this.isImgShow = true
      console.log(e);
    },

    // 删除图片
    fileRemoved() {
      this.staffOrderImg.url = "";
    },
     goBack() {
      // console.log("点击了浏览器的返回按钮");
      history.pushState(null, null, document.URL);
    },
  },
  mounted: function () {
    this.orderId = this.$route.query.orderId;
    this.tabBar = this.$route.query.tabBar;
    this.orderArkSn = this.$route.query.arkSn;
    this.arkSn = localStorage.getItem("arkSn");
    this.getOrderDetail();
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
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

.order-detail-key {
  font-size: w(22);
}

.my-order-dialog-box {
  height: h(900);
  width: w(600);
}

.order-detail {
  padding-bottom: h(333);
}

.can-not-click {
  height: h(84);
  width: w(579);
  border-radius: w(40);
  border: transparent;
  color: white;
  font-size: w(32);
  background: #A0A0A0;
  position: fixed;
  transform: translate(-50%, 0);
  left: 50%;
  bottom: h(190);
}

.order-detail-card {
  background: white;
  height: h(580);
  width: w(727);
  padding: 0 w(30);
  box-sizing: border-box;
  margin: w(12);
}

.order-detail-head {
  height: h(88);
  border-bottom: $border-gray;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: #858585;
  }

  b {
    color: #2049BF;
    border-left: $border-gray;
    padding-left: w(20);
    margin: w(10);
  }
}

.order-detail-info {
  height: h(340);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: h(40) 0;
  color: #666666;

  span {
    float: right;
    color: #333333;
  }

  img {
    height: h(26);
    width: w(21);
    margin-left: w(10);
  }
}

.order-detail-item span {
  border: 1px solid #2049BF;
  border-radius: w(30);
  padding: h(5) w(15);
  color: #2049BF;
  margin: 0 w(10);
  font-size: w(23);
}

.order-detail-other {
  color: #2049BF;

  span {
    float: right;
    margin: 0 w(10);
  }

  img {
    height: w(26);
    width: w(26);
    margin: 0 w(10);
    font-size: w(26);
  }
}

.order-detail-position {
  background: white;
  height: h(260);
  width: w(727);
  padding: h(25) w(30);
  box-sizing: border-box;
  margin: w(12);
}

.order-detail-position-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: h(30);

  span {
    img {
      height: h(33);
      width: w(29);
      margin-right: w(24);
      position: relative;
      top: h(5);
    }
  }

  img {
    height: h(33);
    width: w(29);
  }
}

.order-detail-position-orange {
  color: #FFBD03;
  text-decoration: underline;
}

.order-detail-photo {
  background: white;
  height: h(350);
  width: w(727);
  padding: h(25) w(30);
  box-sizing: border-box;
  margin: w(12);
}

.order-detail-btn {
  height: h(333);
  width: 100vw;
  /* background url("./../../assets/button-bg.png") */
  /* position fixed */
  bottom: h(50);
}

.order-detail-photo-img {
  height: w(124);
  width: w(124);
  position: relative;
  left: w(55);
  top: h(50);
}

.order-detail-photo-del {
  height: w(29);
  width: w(29);
  position: relative;
  left: w(30);
  top: h(-60);
}
</style>
