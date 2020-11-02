<template>
  <div class="order-tracking">
    <div class="order-tracking-head">
      <span>{{title}}</span>
      <div class="subtitle">{{subtitle}}</div>
    </div>

    <div class="order-tracking-card">
      <div class="order-tracking-card-head">
        <div>
          <img src="./../../assets/head.png" alt="">
          <span>{{consumerOrder.pickCarStaffName}}</span>
          <a :href="['tel:' + staffPhone]" v-show="consumerOrder.pickCarStaffName">
            <span class="order-tracking-card-call"><img src="./../../assets/call-service.png" alt=""><b>联系技师</b></span>
          </a>
        </div>
        <div class="order-tracking-card-state">
          <img src="./../../assets/car-state.png" alt="">
          <span>{{state}}</span>
          <p>您的爱车钥匙已放入{{consumerOrder.userKeyLocation}}</p>
        </div>
      </div>
      <div class="order-tracking-card-button">
        <a :href="['tel:' + storePhone]">
          <span>联系服务商</span>
        </a>
        <a href="tel:025-86697165">
          <span>联系客服</span>
        </a>
      </div>
    </div>

    <div class="order-tracking-time-line">
      <div>状态跟踪</div>

      <div class="order-tracking-box" v-for="(item,index) in msg" :key="index">
        <span class="order-tracking-date">{{item.date}}</span>
        <span class="order-tracking-time">{{item.time}}</span>
        <span class="order-tracking-title">{{item.title}}</span>
        <span class="order-tracking-info">{{item.info}}</span>
        <img src="./../../assets/time-line-gray.png" alt="">
        <div v-show="index !== (msg.length-1)"></div>
      </div>
    </div>

    <!--<button class="big-blue-btn" @click="toPayOrder">确认完成</button>-->
  </div>
</template>

<script>
  export default {
    name: 'orderTracking',
    data() {
      return {
        time: [
          '2019-06-10 16:25:36',
          '2019-06-10 16:25:36',
        ],
        orderId:'',
        msg:[],
        consumerOrder:{},
        title:'',
        subtitle:'',
        state:'',
        staffInfo:{},
        store:{},
        staffPhone:'025-86697165',
        storePhone:'025-86697165'
      }
    },
    methods: {
      // 获取订单详情
      getOrderDetail(){
        this.$get('/wechat/order/getOrderDetail',{
          id:this.orderId
        }).then(res=>{
          console.log(res)
          this.consumerOrder = res.consumerOrder
          this.staffInfo = res.staffInfo
          this.store = res.store

            if (this.staffInfo) {
                this.staffPhone = this.staffInfo.phone
            }

            if(this.store){
                this.storePhone = this.store.phone
            }

          this.time=[
            this.consumerOrder.createTime,
            this.consumerOrder.orderTakingTime,
            this.consumerOrder.pickTime,
           this.consumerOrder.deliverTime,
           this.consumerOrder.finishTime,
          ];
          console.log(this.time)
          for(let i=0;i<this.time.length;i++){
            if(this.time[i]){
              let title='';
              let info='';
              switch (i) {
                case 0:{
                  title='订单提交成功'
                  info='正在为您的爱车安排服务'
                  this.title='爱车正在安排服务'
                  this.subtitle="若长时间没有技师接单，您可联系相应服务商"
                  this.state='已下单'
                  break
                }
                case 1:{
                  title='已接单'
                  info='正在为您的爱车安排服务'
                  this.title='爱车正在安排服务'
                  this.subtitle="若技师长时间未取车，您可联系相应技师"
                  this.state='已接单'
                  break
                }
                case 2:{
                  title='已接车'
                  info='您的爱车由'+this.consumerOrder.pickCarStaffName+'接单'
                  this.title='爱车正送往网点'
                  this.subtitle=null
                  this.state='已接车'
                  break
                }
               case 3:{
                 title='订单完成'
                 info='正在为您的爱车安排服务'
                 break
               }
               case 4:{
                 title='已取车'
                 info='正在为您的爱车安排服务'
                 break
               }
              }
              this.msg.push({
                date:this.time[i].split(' ')[0],
                time:this.time[i].split(' ')[1],
                title:title,
                info:info
              })
            }
          }
          console.log(this.msg)
        })
      },

//      去支付
      toPayOrder(){
        this.$router.push({path:'/payOrder',query:{id:this.orderId}})
      }
    },
    created(){
      //是否关注公众号
      if(localStorage.getItem('subscribe') == "false"){
          window.location.href = "http://mp.weixin.qq.com/s?__biz=MzAxNDMwNDc3Mw==&mid=502678227&idx=1&sn=22cc3edc520a3058aa5b2aed5f376904&chksm=0397b1b934e038af1b3802e6b993461d18e5780b2349fe339c3fa82a3bee6586a3650d531ee4#rd"
        }
    },
    mounted: function () {
      this.orderId = this.$route.query.id
      this.getOrderDetail()
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .order-tracking
    background white
    min-height 100vh
    width 100vw
    position relative

  .order-tracking-head
    height h(180)
    width 100vw
    background url("./../../assets/head-bg.png") no-repeat;
    padding h(40) w(63)
    box-sizing border-box
    span
      color white
      font-size w(50)
      font-weight 800
  .subtitle{
    font-size:w(30);
    color:white;
    font-weight  800
    margin w(10) 0 
  }

  .order-tracking-card
    width w(600)
    height h(250)
    border-radius 5px
    box-shadow 0 0 10px #dcdcdc
    position absolute
    transform translate(-50%,0)
    left 50%
    top h(160)
    background white
    padding w(20)
    box-sizing border-box
    img
      height w(77)
      width w(77)
      border-radius w(40)
      margin-right w(30)

  .order-tracking-card-head
    border-bottom $border-gray
    height h(160)
    box-sizing border-box
    padding h(38) w(32)
    span
      position absolute
      img
        width w(25)
        height w(25)
        margin-right w(7)
    p
      width w(150)
      font-size w(18)

  .order-tracking-card-call
    top h(100)
    left w(160)
    font-size w(22)
    color #2049BF
    display flex
    align-items center

  .order-tracking-card-state
    position absolute
    left w(320)
    top h(55)
    width w(250)
    p
      position absolute
      top h(45)
      left w(110) 

  .order-tracking-card-button
    padding h(13) 6vw;
    display flex
    justify-content space-between
    align-items center
    span
      color #2049BF
    div
      background #ebebeb
      width 1px
      height h(51)

  .order-tracking-time-line
    position relative
    top h(280)
    padding w(20) w(63)

  .order-tracking-box
    position relative
    height h(120)
    padding w(11)
    box-sizing border-box
    img
      height w(27)
      width w(27)
      position absolute
      left w(150)
    div
      height h(68)
      width 1px
      background #9D9D9D
      position absolute
      top h(50)
      left w(165)
    span
      position absolute

  .order-tracking-gray
    color #858585

  .order-tracking-blue
    color #2049BF

  .order-tracking-date
    font-size w(18)

  .order-tracking-time
    left w(15)
    font-size w(22)
    top h(40)

  .order-tracking-title
    left w(230)
    font-size w(22)

  .order-tracking-info
    left w(230)
    top h(50)
    font-size w(20)

</style>
