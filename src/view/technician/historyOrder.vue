<template>
  <div class="history-order">
    <div class="history-order-card" v-for="(item,index) in msg" :key="index">
      <img src="./../../assets/car-head.png" alt="">
      <span class="history-order-num">订单号：<b>{{item.id}}</b></span>
      <span class="history-order-info">{{item.licensePlate}} {{item.color}} · {{item.carBrand}}</span>
      <span class="history-order-state">已交付</span>
    </div>

    <div class="history-order-search">
      <input v-model="keyword" type="text" placeholder="请输入订单号或车牌号来搜索订单">
      <img src="./../../assets/search.png" alt="" @click="getOrderList">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'historyOrder',
    data() {
      return {
        msg: [],
        keyword:''
      }
    },
    methods: {
      // 获取订单列表
      getOrderList(){
        this.$get('/wechat/employee/listHistoryOrders',{
          staffId:localStorage.getItem('staffId'),
          keyword:this.keyword
        }).then(res=>{
          this.msg = res
        })
      }
    },
    mounted: function () {
      this.getOrderList()
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw
  .history-order
    padding h(16) 0 h(140) 0
    box-sizing border-box

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

  .history-order-search
    height h(138)
    width 100vw
    background url("./../../assets/search-bg.png")
    background-size 100% 100%
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


</style>
