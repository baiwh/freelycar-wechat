import wx from 'weixin-js-sdk'


//调用扫码接口

function wxConfig() {
    this.configInfo = {}
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
        this.info="正在打开扫一扫"
        console.log('微信接口成功')
        this.scan();
      })
      wx.error(function (res) {
        this.info="请刷新页面"
        console.log(res)
      })
    })
  }
export function scan(){
    //微信扫一扫
    wx.scanQRCode({
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        console.log(res)
      }
    })
  }
