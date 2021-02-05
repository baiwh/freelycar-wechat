// 反馈页面
<template>
<div>
  <div class="feedback" v-show="!feedbackSuccess">
    <!-- 反馈类别 -->
    <div class="feedback-card feedback-item">
      <span class="item">
        <!-- <img class="feedback-img" src="./../../assets/setting-blue.png" alt /> -->
        反馈类型
      </span>
      <cube-checker v-model="checkerValue" :options="options" />
    </div>
    <div class="feedback-card feedback-desc">
      <span><span class="mark">*</span>问题描述</span>
      <div class="feedback-textarea">
        <textarea v-model="desc"  placeholder="请填写10字以上的问题描述以便我们提供更好的帮助。" :maxlength="100"></textarea>
      </div>
      <span class="textnum">{{desc.length}}/100</span>
    </div>
    <div class="feedback-card feedback-photo">
      <div class="align-center">
        <span class="imgspan">
          相关截图(选填)
        </span>
        <span>{{feedBackImgs.length}}/3</span>
      </div>
      <!--<cube-upload v-show="!isImgShow"-->
      <cube-upload
        ref="upload"
        :action="action"
        :simultaneous-uploads="1"
        :max="3"
        @file-removed="fileRemoved"
        @file-success="fileSuccess"
        :process-file="processFile"
        @files-added="filesAdded"
        @file-submitted="fileSubmitted"
      ></cube-upload>
    </div>
    <div class="feedback-card feedback-phone">
        <div class="align-center">
            <span class="imgspan">联系方式</span>
            <cube-input class="inputphone" v-model="phone" placeholder="微信号/手机号" :maxlength="11" ></cube-input>
        </div>
    </div>
    <button class="submit-btn" @click="submit">提交</button>
    <!-- 提交成功页面 -->
    </div>
    <div class="feedbackSuccess" v-show="feedbackSuccess">
      <img src="./../../assets/feedbackSuccess.png" alt="">
      <div  class="text1">反馈已提交</div>
      <div class="text2">感谢您的反馈！</div>
        <button class="btn" @click="close">关闭</button>
    </div>
  </div>
</template>

<script>
import compress from "@/components/compress";
export default {
  name: "feedBackPage",
  data() {
    return {
      checkerValue: [],
      options: [
        {
          value: "功能异常",
          text: "功能异常",
        },
        {
          value: "产品建议",
          text: "产品建议",
        },
        {
          value: "支付问题",
          text: "支付问题",
        },
        {
          value: "其他",
          text: "其他",
        },
      ],
      desc: "",
      indicator: {
        negative: true,
        remain: true,
      },
      action: {
        target: "https://www.freelycar.com/api/upload/clientOrderImg",
        // target: "http://192.168.0.168/api/upload/clientOrderImg",
        prop: "base64Value",
      },
      feedBackImgs:[],
      imgnum:"0",
      phone:"",
      name:"",
      feedbackSuccess:false
    };
  },
  mounted(){
    this.name = localStorage.getItem("trueName");
  },
  methods:{
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
      fileSuccess(e) {
      let client = {};
      client.imgUrl = e.response.data.url;
      this.feedBackImgs.push(client);
      console.log(this.feedBackImgs);
      // this.isImgShow = true
    },

    // 删除图片
    fileRemoved(e) {
      console.log(e);
      for (var i in this.feedBackImgs) {
        if (this.feedBackImgs[i].imgUrl == e.response.data.url) {
          this.feedBackImgs.splice(i, 1);
        }
      }
      console.log(this.feedBackImgs);
    },
    submit(){
      if(this.checkerValue.length == 0){
        this.checkerValue = "其他"
      }else{
        this.checkerValue = this.checkerValue.join(',');
      }
      console.log(this.checkerValue,this.name)
      console.log(this.feedBackImgs)
      this.$post("/feedback/add",{
        username:this.name,
        contactNumber:this.phone,
        description:this.desc,
        feedBackTypes:this.checkerValue,
        imgs:this.feedBackImgs
      }).then((res)=>{
        console.log(res)
        this.feedbackSuccess = true;
      });
    },
    close(){
      this.$router.go(-1)
    }
  }
};
</script>

<style scoped lang="stylus">
.feedback {
  min-height: 100vh;
  width: 100vw;
  background: white;
}

.align-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.align-center .imgspan {
    margin 10px 10px 10px 0;
}

.feedback-card {
  margin-left: l = w(25);
  margin-right: r = w(20)
  width: 100vw -l;
  padding-top:w(20)
  padding-right: w(20);
  box-sizing: border-box;
  position: relative;
}

.mark {
  padding-top: 4px;
  color: red;
}
.feedback-desc{
    height h(400)
    border-bottom: $border-gray;
}

.feedback-item {
  height: h(200);
  border-bottom: $border-gray;
}

.feedback-img {
  height: w(30);
  width: w(30);
  margin-right: w(25);
}


.cube-checker {
  width: 100%;
  margin-top w(30)
}
.cube-checker-item{
    margin-right w(10)
    border:$border-gray
}

.feedback-input {
  border: transparent;
  color: #AEAEAE;
}

.cube-checker{
    // margin:w(60)
}

.feedback-photo{
  height: h(300);
  position: relative;
  border-bottom: $border-gray;
}
.feedback-phone{
    margin w(42) w(20) w(42) w(42)
    height: h(160);
  position: relative;
  border-bottom: $border-gray;
}
.cube-input{
    width w(400)
}

.submit-btn {
  height: h(84);
  width: w(400);
  border-radius: w(40);
  border: transparent;
  color: white;
  font-size: w(32);
  background: $bt-blue;
  position: relative;
  transform: translate(-50%, 0);
  left: 50%;
  margin: h(100) 0;
}

textarea{
  margin-top w(20)
  border $border-gray
  width 98%
  height w(280)
  font-size 14px;
}

.textnum{
  position absolute
  right w(30)
  bottom w(35)
}
.feedbackSuccess{
  margin 0 auto
  text-align center
}

  .feedbackSuccess{
    img{
      margin-top h(100)
      height w(190)
      width w(190)
      top h(156)
    }
  }
    
  .text1
    font-size w(40)
    font-weight 800
    margin-top h(120)

  .text2
    font-size w(25)
    margin-top h(50)

  .btn{
    height: h(84);
  width: w(400);
  border-radius: w(40);
  border: transparent;
  color: white;
  font-size: w(32);
  background: $bt-blue;
  margin-top h(400)
  }
  .inputphone{
    width w(500)
  }

</style>
