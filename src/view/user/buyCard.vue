<template>
  <div class="buy-card">
    <span class="buy-card-store">以下会员卡仅限于{{store}}使用</span>

    <div class="buy-card-card" v-for="(item,index) in msg" @click="buyCard(item.id,item.price)" :key="index">
      <div class="buy-card-title">
        <span>{{item.name}}</span>
        <span>点击购买>></span>
      </div>
      <span class="buy-card-count">{{item.actualPrice}}<b>元</b></span>
      <span class="buy-card-text">付款金额：{{item.price}}元</span>
    </div>

  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'

  export default {
    name: 'buyCard',
    data() {
      return {
        msg: {},
        store:1,
        myCard:[]
      }
    },
    methods: {
      // 获取卡列表
      getStoreDetail(){
        this.$get('/wechat/store/getDetail',{
          id:localStorage.getItem('storeId')
        }).then(res=>{
          this.msg = res.cardServices
        })
      },

      // 检查有没有卡
      getMyCard(){
        this.$get('/wechat/wxuser/getMyCards',{
          id:localStorage.getItem('clientId'),
          storeId:localStorage.getItem('storeId')
        }).then(res=>{
          this.myCard=res
        })
      },

      // 买卡
      buyCard(id,price){
        if(this.myCard.length>0){
          this.$get('/wechat/card/generateRechargeOrder',{
            clientId:localStorage.getItem('clientId'),
            cardServiceId:id,
            cardId:this.myCard[0].id
          }).then(res=>{
            let cardId=res
            this.wxPayCard(cardId,price)
          })
        }else {
          this.$get('/wechat/card/generateCardOrder',{
            clientId:localStorage.getItem('clientId'),
            cardServiceId:id
          }).then(res=>{
            let cardId=res
            this.wxPayCard(cardId,price)
          })
        }
      },

      // 微信支付功能
      wxPayCard(cardId,price){
        this.$post('/wechat/pay/payOrderByWechat',{
          openId: localStorage.getItem('openId'),
          orderId: cardId,
          totalPrice: price
        }).then(res=>{
          console.log(res)
          let payInfo = res
          wx.chooseWXPay({
            timestamp: payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
            package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: payInfo.paySign, // 支付签名
            success: (res)=> {
              // 支付成功后的回调函数
              alert('购买成功')
            },
            fail:(error)=>{
              alert('支付失败')
            },
            cancel:(res)=>{
              alert('用户取消支付')
            }
          })
        })
      },

      // 微信注入权限
      wxConfig() {
        this.$get('/wechat/config/getJSSDKConfig',{
            targetUrl:location.href.split('?')[0]
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
              'chooseWXPay',
              'openLocation',
              'getLocation'
            ]
          })
          // 需要检测的JS接口列表
          wx.checkJsApi({
            jsApiList: ['chooseWXPay','getLocation'],
            success: function (res) {
              console.log(res)
            },
            fail: function (error) {
              console.log(error)
            }
          })
          wx.ready(function () {
            console.log('微信接口成功')
          })
          wx.error(function (res) {
            console.log(res)
          })
        })
      },
    },
    mounted: function () {
      this.getStoreDetail()
      this.wxConfig()
      this.getMyCard()
      this.store=localStorage.getItem('storeName')
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .buy-card
    background white
    min-height 100vh
    box-sizing border-box
    padding w(30)

  .buy-card-store
    font-size w(20)

  .buy-card-card
    height h(330)
    width w(690)
    background url("./../../assets/vip-card.png")
    background-size 100% 100%
    margin-top h(33)
    color white
    position relative

  .buy-card-title
    display flex
    justify-content space-between
    align-items center
    height h(48)
    font-size w(25)
    padding 0 w(42)

  .buy-card-count
    font-size w(150)
    position absolute
    top h(100)
    left w(26)

  .buy-card-count b
    font-size w(39)

  .buy-card-text
    font-size w(20)
    position absolute
    top h(270)
    left w(30)
</style>
