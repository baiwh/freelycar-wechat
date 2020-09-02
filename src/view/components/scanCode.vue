<template>
<div>
  <div class="scan-code">
    <mt-spinner type="triple-bounce" color="#26a2ff" :size="60"></mt-spinner>
  </div>
  <div class="info">{{info}}</div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'

  export default {
    name: 'scanCode',
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
            this.info="正在打开扫一扫"
            console.log('微信接口成功')
            this.scan();
          })
          wx.error(function (res) {
            this.info="请刷新页面"
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
    created: function () {
      this.info="授权中..."
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

  .scan-code
    font-size w(26);
    width w(150);
    margin 50%  auto 0 auto;
  .info
    margin-top:w(50) 
    text-align center
</style>
