<template>
  <div class="success">
    <img src="./../../assets/success.png" alt="">
    <div class="text1">{{arkInfo.text1}}</div>
    <div class="text2">{{arkInfo.text2}}</div>
    <div class="text3">{{arkInfo.text3}}</div>
    <div class="text4"><span>{{msg}}</span>{{arkInfo.text4}}</div>
    <div class="text5">{{arkInfo.text5}}</div>
    <div class="btn" v-show="state=='tecGetKey'">
      <mt-button type="primary"  @click="scan">扫码开柜</mt-button>
      <mt-button type="primary"  @click="returnOrder">查看订单</mt-button>
    </div>
  <feed-back class="feedback">
    </feed-back>
  </div>
</template>

<script>
import feedBack from '@/view/components/feedBack.vue';

  import wx from 'weixin-js-sdk'
  export default {
     components: { feedBack },
    name: 'success',
    data() {
      return {
        arkInfo: {},
        msg: null,
        state:'',
      }
    },
    props: [
      'arkInfoState'
    ],
    methods: {
      changeTxt(state){
        console.log('被调用success')
        console.log(state)
        this.state=state
        switch (state) {
          case 'billingOrder': {
            console.log(this.arkInfoState)
            this.msg = null
            this.arkInfo = {
              text1: '预约成功',
              text2: '我们已通知服务人员,请耐心等待',
              text3: '若长时间没有技师接单，您可联系相应服务商',
              text4: '感谢您使用',
              text5: '小易智能柜预约服务！'
            }
          }
            break
          case 'cancelOrder': {
            console.log(this.arkInfoState)
            this.msg = 3
            this.closeWindow()
            this.arkInfo = {
              text1: '订单取消成功',
              text2: '谢谢您的支持，期待您下次使用！',
              text3: '',
              text4: '秒',
              text5: '返回微信公众页'
            }
          }
            break
          case 'payOrder': {
            console.log(this.arkInfoState)
            this.msg = 3
            this.closeWindow()
            this.arkInfo = {
              text1: '订单已完成',
              text2: '谢谢您的支持，期待您下次使用！',
              text3: '',
              text4: '秒',
              text5: '返回微信公众页'
            }
          }
            break
          case 'tecGetKey': {
            console.log(this.arkInfoState)
            this.msg = null
            this.arkInfo = {
              text1: '接单成功',
              text2: '我们已通知服务车主订单状态',
              text3: '请尽快将车辆送往网点',
              text4: '',
              text5: '',
            }
          }
            break
          case 'tecFinish': {
            console.log(this.arkInfoState)
            setTimeout(()=> {
              wx.closeWindow()
            },1000)
            this.msg = null
            this.arkInfo = {
              text1: '订单完成',
              text2: '小易爱车感谢您的服务！',
              text3: '',
              text4: '',
              text5: ''
            }
          }
            break
        }
        console.log(this.arkInfo)
      },
      // 倒数关闭
      closeWindow(){
        let info = setInterval(() => {
          if (this.msg !== 0) {
            this.msg -= 1
          } else {
            wx.closeWindow()
            clearInterval(info)
          }
        }, 1000)
      },
      returnOrder(){
        window.location.reload();
      },
      // 微信注入权限
      wxConfig() {
        this.$get('/wechat/config/getJSSDKConfig',{
            targetUrl:"https://www.freelycar.com/wechat/order"
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
      // this.wxConfig();
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .success
    z-index 100
    position absolute
    top 0
    left 50%
    background white
    height 100vh
    width 100vw
    color #2049BF

  .success img, div
    position absolute
    transform translateX(-50%)
    left 50%

  .success img
    height w(190)
    width w(190)
    top h(156)

  .text1
    font-size w(35)
    font-weight 800
    top h(443)

  .text2
    font-size w(25)
    top h(565)

  .text3
    font-size w(25)
    top h(610)

  .text4 span
    font-size w(60)

  .text4
    font-size w(25)
    top h(725)

  .text5
    font-size w(25)
    top h(800)
  .btn{
    font-size w(40)
    top h(800)
  }
  .mint-button--primary {
    color: #fff;
    background-color: #2049bf;
    width w(400);
    border-radius :w(100);
    margin-bottom w(50)

}


.feedback {
  position fixed;
  right -50%
  bottom h(600)
}
</style>
