<template>
  <div class="bkground">
    <div v-show="!getSuccess">
      <div class="title">
        <img src="../../assets/pic_upperbg.png" alt="" />
      </div>
      <div class="activity">
        <img class="title-img" src="../../assets/pic_title.png" alt="" />
      </div>
      <div class="centerimg">
        <img
          src="../../assets/pic_carwash_drawing.png"
          alt=""
        />
      </div>
      <div class="imgs">
        <img src="../../assets/pic_carwash_left@2x.png" alt="" />
        <img src="../../assets/pic_carwash_middle@2x.png" alt="" />
        <img src="../../assets/pic_carwash_right@2x.png" alt="" />
      </div>
      <div class="phone">
        <input
          class="inp"
          type="text"
          placeholder="请输入手机号领取"
          v-model="phone"
        />
      </div>
      <div class="center">
        <img src="../../assets/button_clickandget.png" alt="" />
        <div class="submit" @click="submit">点击领取</div>
        <div class="moreinfo" @click="showinfo">活动细则</div>
      </div>
      <div class="dialog-layer" v-show="isDialogShow">
        <div class="dialog-box infodialog">
          <div class="dialog-title">小易爱车9.9元洗车活动细则</div>
          <div class="dialog-content">
            1、小易新用户输入手机号、关注公众号即可领取9.9元洗车服务，每个手机号可领取一次。<br />
            2、领取后限新用户首次使用小易爱车，适用各型号车辆（大巴除外）适用于，春江紫宸
            、深业滨江半岛、中山骏景，小易爱车体验柜，不与其它优惠劵、特价活动同用。<br />
            3、详情规则请进入小易爱车公众号点击使用说明查看<br />
            4、如有任何问题，请咨询小易爱车官方客服电话025-8669-7165
          </div>
          <div class="confirm" @click="closeinfo">确定</div>
        </div>
      </div>
      <div class="dialog-layer" v-show="isFail">
        <div class="dialog-box faildialog">
          <div class="dialog-fail">该手机号已领取过优惠券</div>
          <div class="dialogfail-content">
            请前去小易爱车公众号扫描智能柜二维码使用
          </div>
          <div class="failconfirm" @click="closefail">确定</div>
        </div>
      </div>
    </div>
    <div v-show="getSuccess">
      <div class="title">
        <img src="../../assets/pic_upperbg.png" alt="" />
      </div>
      <div class="getSuccess">
        <img class="infoimg" src="../../assets/icon_finished.png" alt="" />
        <div class="info">领取成功</div>
        <div class="use">长按关注公众号使用</div>
        <img class="code" src="../../assets/WechatIMG983.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDialogShow: false,
      getSuccess: false,
      phone: "",
      isFail: false,
    };
  },
  methods: {
    showinfo() {
      this.isDialogShow = true;
    },
    closeinfo() {
      this.isDialogShow = false;
    },
    closefail() {
      this.isFail = false;
    },
    submit() {
      if (this.phone.length === 11) {
        this.$post("/wechat/login/register?phone=" + this.phone)
          .then((res) => {
            this.getSuccess = true;
          })
          .catch((res) => {
            this.isFail = true;
          });
      } else {
        alert("请输入正确的手机号码！");
      }
    },
  },
};
</script>
<style scoped lang="stylus">
.bkground {
  width: 100%;
  height: 800px;
  background: #FFE746;
}

.title img {
  width: 100%;
  height: 180px;
  position absolute
  z-index 2;
}

.title div {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #1A6FFF;
  line-height: 33px;
  text-align: center;
  width: 100%;
  position: absolute;
  top: 8px;
  z-index 100
}

.title-img {
  width: 100%;
  height:120px;
  position: absolute;
  top: 10px;
  z-index 3;
}
.activity{
  width: 100%;
  height:120px;
}
.centerimg{
  width 100%;
  height 240px
  margin-top 90px;
}
.centerimg  img{
  width: 100%;
  position: absolute;
  top: 180px;
  z-index 1
}

.imgs {
  // position: absolute;
  // top: 436px;
  width: 90%;
  padding-left: 10%;
}

.imgs img {
  width: 100px;
  height: 66px;
}

.inp {
  width: 240px;
  height: 48px;
  background: #FFFFFF;
  box-shadow: 1px 2px 7px 0px rgba(20, 181, 181, 0.41);
  border-radius: 24px;
  border: 0;
  outline: none;
  text-align: center;
}

input::-webkit-input-placeholder {
  color: #FFAA60;
}

input::-moz-input-placeholder {
  color: #FFAA60;
}

input::-ms-input-placeholder {
  color: #FFAA60;
}

.phone {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 539px;
}

.moreinfo {
  font-size: 14px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 400;
  color: #1A6FFF;
  text-align: center;
  width: 100%;
  margin-top 25px;
}

.infodialog {
  width: 280px;
  height: 448px;
  position: relative;
}

.faildialog {
  width: 240px;
  height: 200px;
}

.dialog-title {
  width: 100%;
  font-size: 15px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  height: 64px;
  line-height: 64px;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
}

.dialog-content {
  padding: 20px 20px 0 20px;
  height: 300px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
  border-bottom: 1px solid #eeeeee;
}

.center {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 600px;
  marign: 0 auto;
}

.center img {
  width: 240px;
  height: 50px;
}

.submit {
  width: 100%;
  height: 26px;
  font-size: 19px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #000000;
  line-height: 26px;
  position absolute
  top:10px
}

.confirm {
  width: 80px;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  background: #1a6fff;
  color: white;
  border: 0 solid;
  border-radius: 18px;
  position: absolute;
  bottom: 20px;
  right: 10px;
}

.getSuccess {
  text-align: center;
  margin-top: 200px;
  position absolute;
  width:100%;
  z-index 200
}

.getSuccess .infoimg {
  width: 72px;
  height: 72px;
}

.getSuccess .info {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #1A6FFF;
  line-height: 33px;
  margin-top: 20px;
}

.getSuccess .use {
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 25px;
  margin: 100px 0 20px 0;
}

.dialog-fail {
  width: 100%;
  height: 50px;
  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 50px;
  text-align: center;
  margin-top:10px;
}

.code {
  width: 150px;
  height: 150px;
  border-radius: 15px;
}

.dialogfail-content {
  height: 80px;
  font-size: 17px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #B2B2B2FF;
  line-height: 24px;
  text-align: center;
  margin: 10px 20px;
  border-bottom: 1px solid #eeeeee;
}

.failconfirm {
  width: 100%;
  height: 30px;
  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #2274FF;
  line-height: 30px;
  text-align: center;
}
</style>