<template>
<div>
  <div class="scan-code">
    链接已失效，请重新扫码!
  </div>
  <div class="btn">
      <mt-button type="primary"  @click="scan">扫码下单</mt-button>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
  export default {
    name: 'linkFailure',
    data() {
      return {
        configInfo: {},
        info:''
      }
    },
    methods: {
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
            this.info="请刷新页面"
            console.log(res)
          })
        })
      },

      scan(){
        //微信扫一扫
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            console.log("res")
          }
        })
      },
    },
    created: function () {
      this.wxConfig()
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

 .btn{
    margin 50% auto 0 auto;
    font-size w(40)
    width w(400)
  }
  .scan-code
    font-size w(30);
    width w(340);
    margin 50%  auto 0 auto;
 .mint-button--primary {
    color: #fff;
    background-color: #2049bf;
    width w(400);
    border-radius :w(100);
}
</style>
