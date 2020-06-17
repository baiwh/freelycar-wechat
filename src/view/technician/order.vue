<template>
  <div class="order">
    <div class="order-tab">
      <cube-tab-bar
        v-model="selectedLabelDefault"
        :data="tabs"
        show-slider
        @click="clickHandler">
      </cube-tab-bar>
    </div>

    <!--待服务订单-->
    <div v-show="tabBar==='待服务'" v-for="(item,index) in orderList" :key="index" >
      <div class="order-card">
        <div class="order-card-head">
          <img src="./../../assets/car-head.png" alt="">
          <b>订单号：{{item.id}}</b>
          <span>{{item.licensePlate}} {{item.carColor}} · {{item.carBrand}}</span>
          <button @click="takeOrder(item.licensePlate,item.id,item.arkSn,item.keyLocation)"
                  :class="[item.arkSn===arkSn && !orderProcessing?'bg-blue':'bg-gray']">接单</button>
        </div>
        <!-- <div class="order-card-info" @click="orderDetail(item.id,item.arkSn)"> -->
        <div class="order-card-info">
          <span>车主姓名 {{item.clientName}}</span>
          <span>下单时间 {{item.createTime}}</span>
          <span>预约项目 <b>{{item.projectNames}}</b></span>
          <span>钥匙位置 {{item.keyLocation}}</span>
          <span>车辆停放位置 {{item.parkingLocation}}</span>
          <div class="order-detail-other">
            <span @click="showCarImg"><img src="./../../assets/my-car-img.png" alt="">车辆照片</span>
            <span @click="callUser(item)"><img src="./../../assets/call-service.png" alt="">联系车主</span> 
          </div>
        </div>
        <!-- <img class="order-card-more" src="./../../assets/more.png" alt=""> -->
      </div>
      <!-- 查看图片模态框 -->
      <div class="dialog-layer" v-show="isCarImgShow">
        <div class="dialog-box-black my-order-dialog-box">
          <img src="./../../assets/close.png" @click="showCarImg" class="dialog-box-black-close" alt="">
          <img :src="item.carImageUrl" class="dialog-car-img" alt="">
          <div v-show="!item.carImageUrl" class="dialog-box-black-text">车主未上传照片</div>
        </div>
      </div>
    </div>

    <!--已接到订单-->
    <div v-show="tabBar==='服务中'">
      <div class="order-card" v-for="(item,index) in myOrderList"
           @click="myOrderDetail(item.id,item.arkSn,item.userKeyLocationSn,item.userKeyLocation)" :key="index">
        <div class="order-card-head">
          <img src="./../../assets/car-head.png" alt="">
          <b>订单号：{{item.id}}</b>
          <span>{{item.licensePlate}} {{item.carColor}} · {{item.carBrand}}</span>
        </div>
        <div class="order-card-myorder">
          <div>预约项目<span>{{item.projectNames}}</span></div>
          <div>接单时间<span>{{item.pickTime}}</span></div>
          <div>订单状态<span>已接车</span></div>
          <button :class="[item.userKeyLocationSn.split('-')[0]===arkSn?'orange':'gray']">确认完工</button>
        </div>
        <img class="order-card-myorder-more" src="./../../assets/more.png" alt="">
      </div>
    </div>
    <!-- 已完成 -->
    <div v-show="tabBar==='已完成'">
      <div v-show="!msg.length">暂无历史订单</div>
      <div class="history-order-card" v-for="(item,index) in msg" :key="index">
      <img src="./../../assets/car-head.png" alt="">
      <span class="history-order-num">订单号：<b>{{item.id}}</b></span>
      <span class="history-order-info">{{item.licensePlate}} {{item.color}} · {{item.carBrand}}</span>
      <span class="history-order-state">已交付</span>
    </div>
    </div>

    <!--开门成功-->
    <open-door ref="openDoor" :ark-info-state="arkInfoState" v-show="isOpenDoorShow"></open-door>
    <success ref="success" :ark-info-state="arkInfoState" v-show="isSuccessShow"></success>

    <div class="history-order-search">
      <input v-model="search" type="text" placeholder="请输入订单号或车牌号来搜索订单">
      <img @click="getOrders" src="./../../assets/search.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'order',
    data() {
      return {
        msg: [],
        selectedLabelDefault: '待服务',
        tabs: [{
          label: '待服务',
        }, {
          label: '服务中',
        },{
          label: '已完成'
        }
        ],
        search:'',
        orderList:[],
        myOrderList:[],
        tabBar:'待服务',
        arkSn:'',
        isOpenDoorShow:false,
        isSuccessShow:false,
        arkInfoState:'tecGetKey',
        orderProcessing:false,
        isCarImgShow:false,
        // 车辆图片
        carImageUrl:''
      }
    },
    methods: {
      // 待服务
      getOrders(){
        this.$get('/wechat/order/listReservationOrders',{
          licensePlate:this.search,
          storeId:localStorage.getItem('storeId'),
          staffId:localStorage.getItem('staffId')
        }).then(res=>{
          console.log(res)
          this.orderList=res
          console.log(res)
          if(this.myOrderList.length>0){
            this.orderProcessing=true
          }
        })
      },
      //

      // 已接到
      getFinishOrders(){
        this.$get('/wechat/order/listServicingOrders',{
          licensePlate:this.search,
          storeId:localStorage.getItem('storeId'),
          staffId:localStorage.getItem('staffId')
        }).then(res=>{
          this.myOrderList =res
          this.getOrders()
        })
      },
      //已完成
      // 获取订单列表
      getOrderList(){
        this.$get('/wechat/employee/listHistoryOrders',{
          staffId:localStorage.getItem('staffId'),
          keyword:this.keyword
        }).then(res=>{
          this.msg = res
          console.log(res)
        })
      },

      // 切换菜单
      clickHandler (label) {
        this.tabBar = label
      },

      // 订单详情
      orderDetail(id,arkSn){
        if(this.orderProcessing){
          this.toast = this.$createToast({
            txt: '您有尚未完成的订单，不可接单',
            type: 'txt'
          })
          this.toast.show()
        }else {
          this.$router.push({path:'/orderDetail',query:{orderId:id,tabBar:0,arkSn:arkSn}})
        }

      },
      // 获取车辆照片
      showCarImg(){
        // console.log(item)
        this.isCarImgShow = !this.isCarImgShow
      },

      //联系车主
      //传入遍历的一项
      callUser(item){
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content:'您是否确认'+item.licensePlate+'拨打车主电话？',
          confirmBtn: {
            text: '确认',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            window.location.href = "tel:"+item.phone
          },
          onCancel: () => {
            console.log('取消')
          }
        }).show()
      },
      // 接单
      takeOrder(licensePlate,id,arkSn,keyLocation){
        // 判断是否有正在进行的单子
        if(this.orderProcessing){
          this.toast = this.$createToast({
            txt: '您有尚未完成的订单，不可接单',
            type: 'txt'
          })
          this.toast.show()
        }else {
          // 判断是否当前智能柜
          if(arkSn===this.arkSn){
            this.$createDialog({
              type: 'confirm',
              title: '提示',
              content:'您是否确认在柜前开始'+licensePlate+'的订单？',
              confirmBtn: {
                text: '确认',
                active: true,
                disabled: false,
                href: 'javascript:;'
              },
              cancelBtn: {
                text: '取消',
                active: false,
                disabled: false,
                href: 'javascript:;'
              },
              onConfirm: () => {
                this.pickOpen(id,keyLocation)
              },
              onCancel: () => {
                console.log('取消')
              }
            }).show()
          }else {
            this.toast = this.$createToast({
              txt: '非当前智能柜，不可接单',
              type: 'txt'
            })
            this.toast.show()
          }
        }
      },

      // 接车的一键开柜
      pickOpen(id,keyLocation){
        window.scrollTo(0, 0)
        this.arkInfoState = 'tecGetKey'
        let local = keyLocation.split('-')
        this.$refs.openDoor.changeTxt('tecGetKey',local[1])
        this.$refs.success.changeTxt('tecGetKey')
        this.isOpenDoorShow=true
        this.$get('/wechat/ark/pickCar',{
          orderId:id,
          staffId:localStorage.getItem('staffId')
        }).then(res=>{
          this.isSuccessShow=true
          setTimeout(()=>{
            // this.$router.push({path:'/order'})
            this.isOpenDoorShow=false
            this.isSuccessShow=false
            this.tabBar = '已接到订单'
            window.location.reload()
          },3000)
        })
      },

      // 已经到订单详情
      myOrderDetail(id,arkSn,userKeyLocationSn,userKeyLocation){
        let sn = userKeyLocationSn.split('-')[0]
        console.log(sn)
        if(sn === localStorage.getItem('arkSn')){
          this.$router.push({path:'/orderDetail',query:{orderId:id,tabBar:1,arkSn:arkSn}})
        } else{
          alert('请将钥匙归还至接单的智能柜：'+userKeyLocation.split('-')[0])
        }
      },


      // changeHandler (label) {
      //   // if you clicked different tab, this methods can be emitted
      //   console.log(label)
      // }
    },
    mounted: function () {
      this.getFinishOrders()
      this.getOrderList() //已接到
      this.arkSn=localStorage.getItem('arkSn')
      if(this.$route.query.tabBar){
        this.tabBar = this.$route.query.tabBar
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

  .order
    padding 0 0 h(140) 0

  .cube-tab-bar
    padding 10px 0

  .order-tab
    background white

  .bg-blue
    background #2049BF

  .bg-gray
    background darkgray

  .history-order-search
    height h(138)
    width 100vw
    background url("./../../assets/search-bg.png")
    background-size 100% 100%
    z-index 10
    position fixed
    bottom 0

  .history-order-search img
    height w(30)
    width w(30)
    position absolute
    bottom h(28)
    right w(53)

  .history-order-search input
    height h(60)
    width w(710)
    border-radius h(30)
    position absolute
    bottom h(13)
    left w(20)
    font-size w(20)
    padding-left w(33)
    box-sizing border-box

  .order-card
    background white
    height h(341)
    width w(727)
    margin w(12)
    padding 0 w(29)
    box-sizing border-box
    position relative

  .order-card-head
    height h(90)
    border-bottom $border-gray
    position relative
    img
      height w(67)
      width w(67)
      border-radius w(35)
      position absolute
      top h(12)
    button
      height h(46)
      width w(110)
      color white
      border-radius h(25)
      border transparent
      position absolute
      right w(11)
      top h(23)
    b
      font-size w(20)
      position absolute
      top h(16)
      left w(95)
      color #858585
    span
      font-size w(25)
      position absolute
      top h(48)
      left w(95)

  .order-card-info
    height h(210)
    margin h(20) 0
    font-size w(25)
    display flex
    justify-content space-between
    flex-direction column
    b
      border 1px solid #2049BF
      color #2049BF
      padding h(3) w(19)
      margin-right w(10)
      border-radius w(25)

  .order-card-more
    height h(25)
    width w(14)
    position absolute
    top h(198)
    right w(31)

  .order-card-myorder
    padding h(28) 0
    font-size w(25)
    position relative
    .orange
      background #FFBD03
    .gray
      background gray
    div
      margin-bottom h(25)
    span
      float right
    button
      color white
      border transparent
      height h(46)
      width w(160)
      position absolute
      bottom h(-15)
      right w(-5)
      border-radius h(25)
  .order-card-myorder-more
    height h(25)
    width w(14)
    position absolute
    right w(31)
    top h(33)

  .history-order-card
    height h(90)
    width w(727)
    background white
    margin 0 w(11) h(16) w(11)
    position relative

  .history-order-card img
    height w(68)
    width w(68)
    position absolute
    transform translateY(-50%)
    top 50%
    left w(30)
    border-radius 50%

  .history-order-num
    font-size w(20)
    position absolute
    top h(16)
    left w(126)

  .history-order-num b
    color #858585

  .history-order-info
    font-size w(25)
    position absolute
    top h(48)
    left w(126)

  .history-order-state
    color #2049BF
    font-size w(25)
    line-height h(90)
    text-align center
    position absolute
    right w(33)

  .order-detail-other
    color #2049BF
    span
      float left
      margin 0 w(10) 0 0 
    img
      height w(26)
      width w(26)
      margin 0 w(10) 0 0
      font-size w(26)

  .my-order-dialog-box
    height h(900)
    width w(600)
</style>
