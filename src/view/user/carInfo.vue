<template>
  <div class="user-info">
    <img class="centered user-info-head" src="./../../assets/car-info-head.png" alt />
    <img class="centered user-info-first" src="./../../assets/user-info-second.png" alt />

    <div class="form">
      <div class="form-box">
        <img class="user-info-name" src="./../../assets/car-num.png" alt />
        <input
          type="text"
          placeholder="请输入车牌号"
          v-model="licensePlate"
          readonly="readonly"
          @click="ispopup"
        />
        <img class="car-band" src="./../../assets/more.png" alt />
      </div>
      <!-- 车牌号城市缩写键盘 -->
      <mt-popup v-model="showpopup" position="bottom" popup-transition="popup-fade">
        <div class="car-plate">
          <div class="car-plate-container">
            <mt-button
              class="plate-number"
              type="default"
              v-for="(item,index) in ChineseList"
              :key="index"
              @click="saveplate"
            >{{item.name}}</mt-button>
          </div>
        </div>
      </mt-popup>

      <!-- 数字和字母键盘 -->
      <mt-popup v-model="shownumber" position="bottom" popup-transition="popup-fade">
        <div class="car-plate">
          <div class="car-plate-container car-number">
            <mt-button
              class="plate-number-new"
              type="default"
              v-for="(item,index) in English_Number"
              :key="index"
              @click="savenumber"
            >{{item.name}}</mt-button>
            <mt-button class="plate-number-new" type="default" @click="deletenumber">←</mt-button>
            <mt-button class="plate-number-confirm" type="default" @click="confirm">确认</mt-button>
          </div>
        </div>
      </mt-popup>

      <!-- 车辆颜色 -->
      <div class="form-box" @click="chooseColor">
      <img class="user-info-sex" src="./../../assets/car-band.png" alt />
        <input type="text" placeholder="请选择车辆颜色" v-model="color" />
        <img class="car-band" src="./../../assets/more.png" alt />
    </div>

      <div @click="showDrawer(licensePlate,clientId,storeId)" class="form-box">
        <img class="user-info-sex" src="./../../assets/car-band.png" alt />
        <input type="text" placeholder="请选择品牌车系" v-model="chooseBrand.carline" />
        <img class="car-band" src="./../../assets/more.png" alt />
      </div>

      <div class="form-box">
        <img class="user-info-birth" src="./../../assets/car-img.png" alt />
        <div class="upload-text">请上传爱车照片</div>
        <!--<img class="upload-img" src="./../../assets/upload.png" alt="">-->
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
      <!--<img v-show="!isImgShow" class="car-info-upload" src="./static/check-no.png" alt="">-->
      <!--<img v-show="isImgShow" class="car-info-upload" :src="carImageUrl" alt="">-->
    </div>

    <button class="big-blue-btn" @click="addCar">下一步</button>
    <router-link to="/login">
      <button class="big-gray-btn">取消</button>
    </router-link>
     <feed-back class="feedback">
    </feed-back>
  </div>
</template>

<script>
import compress from "@/components/compress";
import feedBack from '@/view/components/feedBack.vue';
import { Indicator } from "mint-ui";

export default {
  components: { feedBack },
  name: "userInfo",
  data() {
    return {
      carImageUrl: "",
      isImgShow: false,
      licensePlate: "",
      clientId: "",
      storeId: "",
      color:"",
      chooseBrand: {},
      showpopup: false, //控制车牌号城市键盘
      shownumber: false, //数字字母键盘
      //图片上传action
      action: {
        target:'https://www.freelycar.com/api/upload/carImg',
        // target: "http://192.168.0.168/api/upload/carImg",
        prop: "base64Value",
      },
      //车牌号键盘数据
      ChineseList: [
        { name: "京", id: 1 },
        { name: "津", id: 2 },
        { name: "冀", id: 3 },
        { name: "晋", id: 4 },
        { name: "蒙", id: 5 },
        { name: "辽", id: 6 },
        { name: "吉", id: 7 },
        { name: "黑", id: 8 },
        { name: "沪", id: 9 },
        { name: "苏", id: 10 },
        { name: "浙", id: 11 },
        { name: "皖", id: 12 },
        { name: "闽", id: 13 },
        { name: "赣", id: 14 },
        { name: "鲁", id: 15 },
        { name: "豫", id: 16 },
        { name: "鄂", id: 17 },
        { name: "湘", id: 18 },
        { name: "粤", id: 19 },
        { name: "桂", id: 20 },
        { name: "琼", id: 21 },
        { name: "渝", id: 22 },
        { name: "川", id: 23 },
        { name: "贵", id: 24 },
        { name: "云", id: 25 },
        { name: "藏", id: 26 },
        { name: "陕", id: 27 },
        { name: "甘", id: 28 },
        { name: "青", id: 29 },
        { name: "宁", id: 30 },
        { name: "新", id: 31 },
      ],
      English_Number: [
        { name: "1", id: 28 },
        { name: "2", id: 29 },
        { name: "3", id: 30 },
        { name: "4", id: 31 },
        { name: "5", id: 32 },
        { name: "6", id: 33 },
        { name: "7", id: 34 },
        { name: "8", id: 35 },
        { name: "9", id: 36 },
        { name: "0", id: 37 },
        { name: "Q", id: 38 },
        { name: "W", id: 39 },
        { name: "E", id: 40 },
        { name: "R", id: 41 },
        { name: "T", id: 42 },
        { name: "Y", id: 43 },
        { name: "U", id: 44 },
        { name: "I", id: 45 },
        { name: "O", id: 46 },
        { name: "P", id: 47 },
        { name: "A", id: 48 },
        { name: "S", id: 49 },
        { name: "D", id: 50 },
        { name: "F", id: 51 },
        { name: "G", id: 52 },
        { name: "H", id: 53 },
        { name: "J", id: 54 },
        { name: "K", id: 55 },
        { name: "L", id: 56 },
        { name: "Z", id: 57 },
        { name: "X", id: 58 },
        { name: "C", id: 59 },
        { name: "V", id: 60 },
        { name: "B", id: 61 },
        { name: "N", id: 62 },
        { name: "M", id: 63 },
      ],
      colorList: [
        { text: "黑色", value: "黑色" },
        { text: "白色", value: "白色" },
        { text: "红色", value: "红色" },
        { text: "蓝色", value: "蓝色" },
        { text: "银灰色", value: "银灰色" },
        { text: "其他", value: "其他" },
      ],
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
    // 选择车型车系
    showDrawer(licensePlate, clientId, storeId) {
      this.$router.push({
        path: "/choosebrand",
        query: {
          licensePlate,
          clientId,
          storeId,
          from: "/carInfo",
          color: this.color,
          img: this.carImageUrl,
        },
      });
    },
    // 选择车辆颜色
    chooseColor(){
      this.picker = this.$createPicker({
        title: "请选择车辆颜色",
        data: [this.colorList],
        onSelect: this.selectHandle,
        onCancel: this.cancelHandle,
      });
      this.picker.show();
    },
     // 选颜色确认按钮
    selectHandle(selectedVal, selectedIndex, selectedText) {
      this.color = selectedVal[0];
    },

    // 提交
    addCar() {
      if (this.licensePlate && this.chooseBrand.carline) {
        Indicator.open({
          text: "正在添加",
          spinnerType: "fading-circle",
        });
        this.$post("/wechat/client/addCar", {
          storeId: localStorage.getItem("storeId"),
          wxUserId:localStorage.getItem('id'),
          licensePlate: this.licensePlate,
          carBrand: this.chooseBrand.carline,
          carType: "",
          miles: "0",
          lastMiles: "0",
          color: this.color,
          carImageUrl: this.carImageUrl,
        }).then((res) => {
           Indicator.close();
          this.$router.push({ path: "/billingOrder" });
        }).catch((res)=>{
           Indicator.close();
          alert(res)
        });
      } else {
        this.toast = this.$createToast({
          txt: "请将车牌号和品牌车系填写完整",
          type: "txt",
        });
        this.toast.show();
      }
    },
    //车牌号键盘
    ispopup() {
      this.showpopup = !this.showpopup;
    },

    //车牌号城市缩写保存
    saveplate(event) {
      let city = event.target.innerText;
      this.licensePlate = city;
      this.showpopup = false;
      this.shownumber = true;
    },
    //数字字母缩写
    savenumber(event) {
      let number = event.target.innerText;
      if (this.licensePlate.length <= 7) {
        this.licensePlate += number;
      }
    },
    // 退格
    deletenumber() {
      let arr = [...this.licensePlate];
      // console.log(arr)
      arr.pop();
      this.licensePlate = arr.join("");
    },
    //确认
    confirm() {
      this.shownumber = false;
    },

    //上传按钮
    fileSuccess(e) {
      this.carImageUrl = e.response.data;
      // this.isImgShow = true
    },

    // 删除图片
    fileRemoved() {
      this.carImageUrl = "";
    },
  },
  mounted: function () {
    this.clientId = localStorage.getItem("clientId");
    this.storeId = localStorage.getItem("storeId");
    this.chooseBrand.carbrandid = this.$route.query.carbrandid;
    this.chooseBrand.carline = this.$route.query.carline;
    this.chooseBrand.bgname = this.$route.query.bgname;
    this.licensePlate = this.$route.query.licensePlate;
    this.carImageUrl = this.$route.query.img;
    this.color = this.$route.query.color;
    if (this.carImageUrl) {
      this.isImgShow = true;
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

.big-blue-btn {
  top: h(420);
}

.big-gray-btn {
  top: h(350);
}

.car-info-upload {
  height: w(150);
  width: w(150);
}

.user-info {
  position: relative;
  height: 100vh;
  width: 100vw;
  background: white;
}

.centered {
  position: absolute;
  transform: translate(-50%, 0);
}

.user-info-head {
  height: w(185);
  width: w(185);
  left: 50%;
  top: h(96);
}

.user-info-first {
  height: w(69);
  width: w(651);
  left: 50%;
  top: h(327);
}

.form {
  top: h(480);
  position: relative;
  padding: 0 $w = w(67);
  width: 100vw -$w-$w;
}

.form img {
  margin-right: w(14);
}

.form input {
  width: w(549);
  font-size: w(26);
  border-bottom: $border-gray;
  padding-bottom: h(12);
  padding-left: w(20);
}

.form-box {
  display: flex;
  align-items: center;
  margin-bottom: h(54);
}

.user-info-name {
  height: h(41);
  width: w(59);
}

.user-info-sex {
  height: h(35);
  width: w(59);
}

.user-info-birth {
  height: h(34);
  width: w(41);
}

.car-band {
  flex: none;
  position: absolute;
  right: w(70);
  height: h(23);
  width: w(13);
}

.upload-text {
  font-size: w(26);
  color: #2049BF;
  margin: 0 w(30);
}

.upload-img {
  height: w(24);
  width: w(24);
}

.car-plate {
  width: 100% vw;
  height: h(450);
  position: relative;
}

.car-plate-container {
  padding: 2vw;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 1vw auto -2vw auto;
}
.car-number{
  margin: 5vw auto -5vw auto;
}

.plate-number {
  width: 8%;
  height: 15%;
  padding: 0;
  margin: 2vw;
  font-size: 14px;
  line-height: 14px;
  border-radius:0px;
  background-color: #ffffff;
}

.plate-number-new {
  width: 6.5%;
  height: 15%;
  padding: 0;
  margin: 1.5vw;
  font-size: 14px;
  line-height: 14px;
  border-radius:0px;
  background-color: #ffffff;
}

.plate-number-confirm {
  width:23%;
  height: 15%;
  padding: 0;
  margin: 1.5vw;
  font-size: 14px;
  line-height: 14px;
  border-radius:0px;
  background-color: #ffffff;
}

.feedback {
  position fixed;
  right 0
  bottom h(600)
}
</style>
