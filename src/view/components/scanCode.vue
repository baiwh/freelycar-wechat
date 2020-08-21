<template>
  <div class="scan-code">
    <img class="center" src="./../../assets/erweima.png" @click="scan" alt="">
    <h2 class="center">请点击并扫描</h2>
    <h1 class="center">智能柜屏幕右下角</h1>
    <h3 class="center">二维码下单</h3>
    <button class="center" @click="scan">扫码</button>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'

  export default {
    name: 'scanCode',
    data() {
      return {
        configInfo: {}
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
            this.scan();
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
            console.log(res)
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

  .scan-code
    background white
    height 100vh
    position relative
    width 100vw
    color #2049BF
    img
      height w(169)
      width w(169)
      top h(300)
    h2
      top h(590)
      font-size w(26)
      font-weight 600
    h1
      top h(650)
      font-size w(36)
      font-weight 800
    h3
      top h(730)
      font-size w(26)
      font-weight 600
    button
      height h(70)
      width w(300)
      background #2049BF
      color white
      top h(870)
      border 1px solid #2049BF
      border-radius w(50)
      font-size w(32)


  .center
    position absolute
    transform translateX(-50%)
    left 50%
</style>
