<template>
  <div class="pay-order">
    <!--非完工状态时显示-->
    <div class="pay-order-card">
      <!--一直显示-->
      <div class="pay-order-card-item">
        <span>订单编号</span>
        <span class="pay-order-info-gray">{{orderId}}<b class="pay-order-info-blue copy"
                                                        v-clipboard:copy="orderId"
                                                        v-clipboard:success="onCopy"
                                                        v-clipboard:error="onError">复制</b></span>
      </div>
      <!--一直显示-->
      <div class="pay-order-card-item" v-show="consumerOrder.state !== 2">
        <span>下单时间</span>
        <span class="pay-order-info-gray">{{consumerOrder.createTime}}</span>
      </div>
      <div class="pay-order-card-item" v-show="consumerOrder.state == 2">
        <span>完工时间</span>
        <span class="pay-order-info-gray">{{consumerOrder.finishTime}}</span>
      </div>
    </div>

    <!--一直显示-->
    <div class="pay-order-card">
      <div class="pay-order-card-item">
        <span>车辆信息</span>
        <span class="pay-order-info-gray">{{consumerOrder.licensePlate}} {{consumerOrder.carColor}} · {{consumerOrder.carBrand}}</span>
      </div>
      <div class="pay-order-card-item">
        <span>车主信息</span>
        <span class="pay-order-info-gray">{{consumerOrder.clientName}}</span>
      </div>
      <div class="pay-order-card-item" v-show="consumerOrder.state == 2">
        <span>钥匙位置</span>
        <span class="pay-order-info-gray">{{consumerOrder.staffKeyLocation}}</span>
      </div>
      <div class="pay-order-card-item">
        <span>车辆位置</span>
        <span class="pay-order-info-gray">{{consumerOrder.parkingLocation}}</span>
      </div>
      <div class="pay-order-card-item" v-show="consumerOrder.state == 2">
        <span>备注信息</span>
        <span class="pay-order-info-gray">{{consumerOrder.commit}}</span>
      </div>
    </div>

    <!--完工且未支付才显示-->
    <!-- 显示测试 -->
    <!-- <div class="pay-order-card"> -->

    <div class="pay-order-card" v-show="consumerOrder.state===2&&consumerOrder.payState===1">
      <div class="pay-order-card-item">
        <span>支付方式</span>
        <!-- 修改为只有微信支付 -->
        <span class="pay-order-info-blue">{{payWayInfo}}</span>
      </div>
    </div>

    <!--网点及项目-->
    <div class="pay-order-card">
      <div class="pay-order-card-item">
        <span>{{storeInfo.name}}</span>
        <span class="pay-order-info-gray">{{storeInfo.Detail}}</span>
      </div>
      <div class="pay-order-card-item-second">
        <div v-for="(item,index) in consumerProjectInfos" :key="index">
          <span class="pay-order-info-gray">{{item.projectName}}</span>
          <!--<span class="pay-order-info-yellow">￥{{item.price}}</span>-->
        </div>
      </div>
      <div class="pay-order-card-item" v-show="consumerOrder.state===2||consumerOrder.state===3">
        <span class="pay-order-info-gray">总计￥{{consumerOrder.totalPrice}}
          <a :href="['tel:' + storeInfo.phone]">
            <img class="call-service" src="./../../assets/call-service.png" alt=""><b class="pay-order-info-blue">联系服务商</b>
          </a>
        </span>
        <span>实付<b class="pay-order-info-yellow">￥{{payWayInfo==='微信支付'?consumerOrder.totalPrice:consumerOrder.memberPrice}}</b></span>
      </div>
    </div>
    <div class="pay-order-button" v-show="consumerOrder.state===2&&consumerOrder.payState===1">
      <span class="pay-order-info-yellow">￥{{payWayInfo==='微信支付'||consumerOrder.firstPayMethod===2?consumerOrder.totalPrice:consumerOrder.memberPrice}}</span>
      <!--<span class="pay-order-info-yellow">￥{{consumerOrder.actualPrice}} <b class="pay-order-info-gray">??已优惠￥10</b></span>-->
      <button @click="toPayOrder">立即结算</button>
    </div>

    <!--未完工时显示-->
    <button class="blue-btn" v-show="consumerOrder.state===0 || consumerOrder.state===1" @click="orderTracking">订单跟踪</button>
    <!--只有预约状态显示-->
    <button class="gray-btn" v-show="consumerOrder.state===0" @click="cancelOrder">取消订单</button>

    <open-door ref="openDoor" :ark-info-state="arkInfoState" v-show="isOpenDoorShow"></open-door>
    <success ref="successArk" :ark-info-state="arkInfoState" v-show="isSuccessShow"></success>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'payOrder',
    data() {
      return {
        msg: '',
        orderId:'',
        consumerOrder:{},
        consumerProjectInfos:{},
        storeName:'',
        arkInfoState:'',
        isOpenDoorShow:false,
        isSuccessShow:false,
        payWayInfo:'微信支付',
        myCard:[{balance:0}],
        storeInfo:{}
      }
    },
    // state状态：0预约 1 未完工 2 完工 3 未开柜
    methods: {
//        获取订单详情
      getOrderDetail(){
        this.$get('/wechat/order/getOrderDetail',{
          id:this.orderId
        }).then(res=>{
          console.log(res)
          this.consumerOrder=res.consumerOrder
          this.consumerProjectInfos=res.consumerProjectInfos
          this.storeInfo=res.store
          this.storeInfo.Detail = res.ark.location
          // this.getMyCard()
        })
      },

      // // 获取我的会员卡
      // getMyCard(){
      //   this.$get('/wechat/wxuser/getMyCards',{
      //     id:localStorage.getItem('clientId'),
      //     storeId:localStorage.getItem('storeId')
      //   }).then(res=>{
      //       if (res) {
      //           this.myCard=res;
      //           if(this.myCard.length > 0 && this.myCard[0].balance>=this.consumerOrder.actualPrice){
      //               this.payWayInfo = '会员卡支付'
      //           }else{
      //               this.payWayInfo = '微信支付'
      //           }
      //       }else{
      //           this.payWayInfo = '微信支付'
      //       }
      //   })
      // },

//      选择支付方式
//只有微信支付
      // choosePayWay(){
      //   this.$createActionSheet({
      //     title: '请选择支付方式',
      //     data: [
      //       {
      //         content: '微信支付',
      //         align: 'left'
      //       },

      //     ],
      //     onSelect: (item, index) => {
      //       this.payWayInfo=item.content
      //     }
      //   }).show()
      // },
// 
      onCopy(){
        this.toast = this.$createToast({
          txt: '复制成功',
          type: 'txt'
        })
        this.toast.show()
      },
      onError(){
        this.toast = this.$createToast({
          txt: '复制失败',
          type: 'txt'
        })
        this.toast.show()
      },

      // 取消订单按钮
      cancelOrder(){
        this.$createDialog({
          type: 'confirm',
          title: '您将取消订单？',
          confirmBtn: {
            text: '再想想',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '确认取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            //
          },
          onCancel: () => {
            this.cancelAndGetKey()
          }
        }).show()
      },

      // 确认取消取走钥匙
      cancelAndGetKey(){
        this.$createDialog({
          type: 'confirm',
          title: '是否现在开柜？',
          content: '取消订单需要先取走钥匙',
          confirmBtn: {
            text: '是，在柜前',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '否，不在柜前',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
             this.cancelOrderService()
          },
          onCancel: () => {
            console.log('取消')
          }
        }).show()
      },

//      跳转到订单跟踪
      orderTracking(){
        this.$router.push({path: '/orderTracking',query:{id:this.orderId}})
      },

//      取消订单
      cancelOrderService(){
        this.arkInfoState='cancelOrder'
        let local=this.consumerOrder.userKeyLocation.split('-')
        this.$refs.openDoor.changeTxt('cancelOrder',local[1])
        this.isOpenDoorShow=true
        this.$get('/wechat/ark/cancelOrderService',{
          id:this.orderId
        }).then(res=>{
          this.$refs.successArk.changeTxt('cancelOrder')
          this.isSuccessShow=true
          setTimeout(()=>{
            this.$router.push({path:'/myOrder'})
          },3000)
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
              'chooseWXPay'
            ]
          })
          // 需要检测的JS接口列表
          wx.checkJsApi({
            jsApiList: ['chooseWXPay'],
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

      // 支付
      toPayOrder(){
        console.log('支付')
        if(this.consumerOrder.actualPrice){
        //先判断支付方式
        //只保留微信支付
          if(this.payWayInfo==='微信支付'){
            this.wxPay()
          } 
        //   else {
        //     if(this.myCard[0].balance>=this.consumerOrder.actualPrice){
        //       this.vipCardPay()
        //     }else {
        //       this.toast = this.$createToast({
        //         txt: '会员卡余额不足',
        //         type: 'txt'
        //       })
        //       this.toast.show()
        //     }
        //   }
        }else{
          this.freePay()
        }
      },

//      微信支付
      wxPay(){
        this.$post('/wechat/pay/payOrderByWechat',{
          openId: localStorage.getItem('openId'),
          orderId: this.orderId,
          totalPrice:this.consumerOrder.totalPrice
        }).then(res=>{
          let payInfo = res
          wx.chooseWXPay({
            timestamp: payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
            package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: payInfo.paySign, // 支付签名
            success: (res)=> {
              // 完成后提示是否开柜
              this.isOpenDoor()
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

//会员卡支付
//删除会员卡支付
      // vipCardPay(){
      //   this.$post('/wechat/pay/payOrderByCard',{
      //     consumerOrder: {
      //       id:this.orderId,
      //       actualPrice: this.consumerOrder.memberPrice,
      //       firstPayMethod: 0,
      //       firstActualPrice: this.consumerOrder.memberPrice,
      //       firstCardId: this.myCard[0].id,
      //       secondPayMethod: "",
      //       secondActualPrice: 0,
      //       secondCardId: ""
      //     },
      //     useCoupons:[]
      //   }).then(res=>{
      //     this.isOpenDoor()
      //   })
      // },

      // 零元单
      freePay(){
        this.$post('/wechat/pay/payOrderByCard',{
          consumerOrder: {
            id:this.orderId,
            actualPrice: this.consumerOrder.memberPrice,
            firstPayMethod: 1,
            firstActualPrice: this.consumerOrder.memberPrice,
            firstCardId: null,
            secondPayMethod: "",
            secondActualPrice: 0,
            secondCardId: ""
          },
          useCoupons:[]
        }).then(res=>{
          this.isOpenDoor()
        })
      },

//      开柜门
      isOpenDoor(){
        this.$createDialog({
          type: 'confirm',
          title: '是否现在打开柜门？',
          confirmBtn: {
            text: '是,在柜前',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '否,不在柜前',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this.getCar()
          },
          onCancel: () => {
            this.$router.push({path:'/myOrder'})
          }
        }).show()
      },

      // 取车
      getCar(){
        this.arkInfoState='payOrder'
        let local=this.consumerOrder.staffKeyLocation.split('-')
        this.$refs.openDoor.changeTxt('payOrder',local[1])
        this.isOpenDoorShow=true
        this.$get('/wechat/ark/orderFinish',{
          id:this.orderId
        }).then(res=>{
          this.$refs.successArk.changeTxt('payOrder')
          this.isSuccessShow=true
          setTimeout(()=>{
            this.$router.push({path:'/myOrder'})
          },3000)
        })
      },
    },
    mounted: function () {
      this.orderId = this.$route.query.orderId
      this.storeName = localStorage.getItem('storeName')
      this.getOrderDetail()
      this.wxConfig()
    },
    filters:{
      payWay:function (value) {
        switch (value) {
          case 0:return '储值卡支付'
          case 1:return '现金支付'
          case 2:return '微信支付'
          case 3:return '支付宝支付'
          case 4:return '易付宝支付'
          case 5:return '刷卡支付'
        }
      }
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .pay-order
    margin-bottom h(90)
    position relative
    background #EEEEEE

  .blue-btn
    height h(84)
    width w(579)
    border-radius w(40)
    border transparent
    color white
    font-size w(32)
    background $bt-blue
    position relative
    transform translate(-50%,0)
    left 50%
    margin h(50) 0 0 0

  .gray-btn
    height h(84)
    width w(579)
    border-radius w(40)
    border transparent
    color white
    font-size w(32)
    background $bt-gray
    position relative
    transform translate(-50%,0)
    left 50%
    margin h(50) 0

  .pay-order-more
    height w(25)
    width w(14)
    margin-left w(23)
    top h(4)
    position relative

  .pay-order div
    box-sizing border-box

  .pay-order-card
    background white
    width 100vw
    margin-bottom h(17)

  .pay-order-card-item
    height h(86)
    margin 0 w(42)
    border-bottom $border-gray
    display flex
    justify-content space-between
    align-items center

  .pay-order-card-item-second
    border-bottom $border-gray
    margin 0 w(42)

  .pay-order-card-item-second div
    height h(67)
    font-size w(25)
    display flex
    justify-content space-between
    align-items center

  .pay-order-info-gray
    color #858585

  .pay-order-info-blue
    color #2049BF

  .pay-order-info-yellow
    color #FFBD03

  .call-service
    height w(25)
    width w(25)
    margin 0 w(7) 0 w(29)

  .pay-order-button
    height h(84)
    width 100vw
    position fixed
    bottom 0
    background white
    display flex
    justify-content space-between
    align-items center

  .pay-order-button span
    margin 0 w(38)
    font-size w(35)

  .pay-order-button b
    font-size w(25)
    margin 0 w(10)

  .pay-order-button button
    background $bt-blue
    color white
    height h(83)
    width w(263)
    border transparent

  .copy
    padding-left w(15)
    margin-left w(15)
    border-left $border-gray
    font-size w(25)
</style>
