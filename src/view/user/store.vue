<template>
  <div class="store">
    <div class="store-head">
      <div class="store-head-card">
        <span class="store-head-title">{{store.name}}</span>
        <span class="store-head-time">营业时间：{{time[0]}}-{{time[1]}}</span>
        <div class="store-head-img">
          <img src="./../../assets/distance.png" alt="">
          <span>{{distance}}km</span>
        </div>

        <hr>

        <div class="store-head-location">
          <img src="./../../assets/position-gray.png" alt="">
          <span>{{store.address}}</span>
        </div>
      </div>
    </div>

    <div class="store-service">
      <div class="store-service-title flex-center">网点服务</div>

      <div v-for="(item,index) in projects" :key="index">
        <div class="store-service-item-title flex-center" @click="openOrCloseProject(index)">
          <span>{{item.projectTypeName}} <b>共{{item.projectInfos.length}}项</b></span>
          <img :src="projectListIndex===index?'./static/up.png':'./static/down.png'" alt="">
        </div>
        <div v-show="projectListIndex===index" v-for="(projectItem,projuctIndex) in item.projectInfos"
             class="flex-center store-service-item" :key="projuctIndex">
          <div>
            <span class="store-service-items">{{projectItem.name}}</span>
            <span class="store-service-info">{{projectItem.comment}}</span>
          </div>
          <div>
            <span class="store-service-price">￥{{projectItem.price}}</span>
            <span class="store-service-price-info">网点价</span>
          </div>
        </div>
      </div>

    </div>

  <!-- 会员卡信息 -->
    <!-- <div class="store-card">
      <span>会员卡</span>
      <div class="store-card-box">

        <div class="store-card-box-scroll" >
          <div class="store-card-item-box"
               @click="buyCard(item.id,item.price)"
               v-for="(item,index) in cardServices" :key="index">
            <div class="store-card-item">
              <span class="store-card-item-price"><b>￥</b>{{item.actualPrice}}</span>
              <div><span>点击购买</span></div>
            </div>
            <div class="store-card-item-info">购买价 ￥{{item.price}}</div>
          </div>
        </div>

      </div>
    </div> -->
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'

  export default {
    name: 'store',
    data() {
      return {
        storeImgs: [{
          url: ''
        }],
        store: {},
        projects: [],
        cardServices: [],
        time: [],
        projectListIndex: null,
        configInfo: {},
        distance:null,
        myCard:[]
      }
    },
    methods: {
//        获取网点信息
      getStoreDetail() {
        this.$get('/wechat/store/getDetail', {
          id: localStorage.getItem('storeId')
        }).then(res => {
          this.storeImgs = res.storeImgs
          this.store = res.store
          this.projects = res.projects
          this.cardServices = res.cardServices
          this.time = [this.store.openingTime.split(' ')[1], this.store.closingTime.split(' ')[1]]
          localStorage.setItem('storePhone',this.store.phone)
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

//      获取网点图片
      getImg() {
        this.$get('/wechat/store/getImgs', {
          storeId: localStorage.getItem('storeId')
        }).then(res => {
          console.log(res)
        })
      },

//      点击打开收起菜单
      openOrCloseProject(index) {
        if (this.projectListIndex === index) {
          this.projectListIndex = null
        } else {
          this.projectListIndex = index
        }
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
            this.getUserLocation()
          })
          wx.error(function (res) {
            console.log(res)
          })
        })
      },

//      购买会员卡
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

      // 地理位置
      getUserLocation(){
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success:()=> {
            console.log(res)
            let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            // var speed = res.speed; // 速度，以米/每秒计
            // var accuracy = res.accuracy; // 位置精度
            this.locationInfo = {latitude:latitude,longitude:longitude}
            this.distance = this.getShortDistance(longitude,latitude,this.store.longitude,this.store.latitude)
          },
          cancel: function (res) {
            alert('用户拒绝授权获取地理位置');
          }
        })
      },

      //根据经纬度计算距离，单位米
      getShortDistance(lon1, lat1, lon2, lat2) {
        var DEF_PI = 3.14159265359; // PI
        var DEF_2PI = 6.28318530712; // 2*PI
        var DEF_PI180 = 0.01745329252; // PI/180.0
        var DEF_R = 6370693.5; // radius of earth
        var ew1, ns1, ew2, ns2;
        var dx, dy, dew;
        var distance;
        // 角度转换为弧度
        ew1 = lon1 * DEF_PI180;
        ns1 = lat1 * DEF_PI180;
        ew2 = lon2 * DEF_PI180;
        ns2 = lat2 * DEF_PI180;
        // 经度差
        dew = ew1 - ew2;
        // 若跨东经和西经180 度，进行调整
        if (dew > DEF_PI)
          dew = DEF_2PI - dew;
        else if (dew < -DEF_PI)
          dew = DEF_2PI + dew;
        dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
        dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
        // 勾股定理求斜边长
        distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
        //console.log(distance)
        return distance;
      },
    },
    mounted: function () {
      this.getStoreDetail()
      this.getImg()
      this.wxConfig()
      this.getMyCard()
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .store-head
    height h(360)
    width 100vw
    background url("./../../assets/store-head.png") no-repeat
    background-size 100% h(229)

  .store-head-card
    width w(650)
    height h(170)
    background white
    border-radius 5px
    box-shadow 0 0 10px #ababab
    position absolute
    top h(150)
    left w(50)
    padding w(30)
    box-sizing border-box
    font-size w(24)
    color #858585

  .store-head-title
    font-size w(27)
    color black
    position absolute

  .store-head-call img
    height w(25)
    width w(25)
    margin 0 w(5)

  .store-head-call
    color #2049BF
    text-align center
    position absolute
    top h(75)
    left w(360)
    display flex
    align-items center

  .store-head-img img
    height w(36)
    width w(36)
    margin-bottom h(5)

  .store-head-img
    position absolute
    right w(30)
    top h(30)
    font-size w(16)
    width w(80)
    display flex
    align-items center
    flex-direction column

  .store-head-time
    position absolute
    top h(75)

  .store-head hr
    position absolute
    top h(105)
    width w(590)

  .store-head-location
    display flex
    align-items center
    position absolute
    top h(130)
    img
      height h(25)
      width w(17)
      margin 0 w(10)

  .store-service
    background white
    margin-bottom h(16)

  .store-service-title
    height h(77)
    padding 0 w(40)

  .flex-center
    display flex
    justify-content space-between
    align-items center
    border-bottom $border-gray
    position relative

  .store-service-item-title
    height h(74)
    padding 0 w(40)
    font-size w(26)
    b
      color #858585
      font-size w(20)
      margin-left w(10)
    img
      width w(25)
      height h(14)

  .store-service-item
    height h(115)
    padding 0 w(44) 0 w(61)

  .store-service-items
    position absolute
    top h(35)
    font-size w(24)

  .store-service-info
    position absolute
    top h(75)
    font-size w(18)
    color #9F9E9E

  .store-service-price
    color #FFBD03
    font-size w(24)
    position absolute
    right w(44)
    top h(35)

  .store-service-price-info
    color #9F9E9E
    font-size w(18)
    position absolute
    right w(44)
    top h(75)
    text-decoration line-through

  .store-card
    background white
    height h(288)
    position relative
    padding h(30) w(40)

  .store-card-box
    overflow-x scroll
    height h(200)

  .store-card-box-scroll
    width w(10000)

  .store-card-item-box
    display inline-block
    width w(189)
    height h(170)
    float left
    position relative
    margin h(26) w(17) 0 0

  .store-card-item
    height h(118)
    width w(189)
    color white
    background url("./../../assets/card-blue.png") no-repeat
    background-size 100% 100%
    position relative
    div
      height h(40)
      width w(189)
      display flex
      align-items center
      justify-content center
      font-size w(22)
      position absolute
      bottom 0

  .store-card-item-price
    font-size w(42)
    position absolute
    transform translate(-50%, -50%)
    top 30%
    left 45%
    b
      font-size w(24)

  .store-card-item-info
    color #FFBD03
    font-size w(22)
    position absolute
    margin-top h(18)
    width w(189)
    display flex
    align-items center
    justify-content center

</style>
