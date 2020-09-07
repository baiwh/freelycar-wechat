<template>
  <div class="user-home">
    <div class="my-info">
      <img class="my-info-setting" @click="toChangeInfo" src="./../../assets/setting.png" alt="">
      <img class="my-info-photo" :src="[wxUserInfo.headImgUrl]" alt="头像">
      <span class="name">{{wxUserInfo.trueName}}</span>
      <span class="my-info-other">{{wxUserInfo.gender}}  ·  江苏  ·  南京</span>
      <div class="my-info-position">
        <img src="../../assets/position.png" alt="位置">
        <span>定位网点：{{storeName}}</span>
        <router-link to="/chooseStore">
          <button>更换</button>
        </router-link>
      </div>
    </div>

    <div class="switch">
      <div class="menu">
        <img class="car-icon" src="../../assets/my-car.png" alt="车">
        <span>爱车管理</span>
        <img @click="editCar" class="edit" src="../../assets/edit.png" alt="编辑">
      </div>

      <div class="my-car">
        <div class="my-car-card" v-for="(item,index) in cars" :key="index">
          <img v-show="isEditCar" @click="delCar(index)" class="my-car-del" src="./../../assets/del.png" alt="">
          <img class="my-car-head" :src="[item.carImageUrl?item.carImageUrl:'./static/car-head.png']" alt="">
          <span class="my-car-num">{{item.licensePlate}}</span>
          <span class="my-car-brand">{{item.color}} · {{item.carBrand}}</span>
        </div>

        <img v-show="isEditCar || cars.length===0" @click="addNewCar" class="my-car-add" src="./../../assets/add.png" alt="">
      </div>

    </div>
<!-- 会员卡及抵用券 -->
    <!-- <div class="assets">
      <div class="assets-card">
        <img src="./../../assets/my-card.png" alt="">
        <span>我的会员卡</span>
        <span class="assets-count"><b>{{cardBalance?cardBalance:'0'}}</b>元</span>
        <router-link to="/buyCard">
          <span class="assets-recharge">立即充值</span>
        </router-link>
      </div>
      <div>
        <img src="./../../assets/my-voucher.png" alt="">
        <span>我的抵用券</span>
        <span class="assets-count"><b>0</b>个</span>
      </div>
    </div> -->

    <div>
      <router-link to="/store">
        <div class="menu">
          <img class="card-icon" src="../../assets/store.png" alt="会员卡">
          <span>服务商详情</span>
          <img class="more" src="../../assets/more.png" alt="详细">
        </div>
      </router-link>

      <a class="contact" :href="['tel:' + storePhone]">
        <div class="menu">
          <img class="call-me-icon" src="../../assets/call-me.png" alt="联系小易">
          <span>联系小易</span>
          <img class="more" src="../../assets/more.png" alt="详细">
        </div>
      </a>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'userHome',
    data() {
      return {
        switchValue: false,
        selected: '',
        options: ['服务状态'],
        wxUserInfo:{},
        cars:[],
        isEditCar:false,
        storePhone:'025-86697165',
        storeName:'',
        cardBalance:null
      }
    },
    methods: {
      // 获取个人信息
      getAllInfo(){
        this.$get('/wechat/wxuser/getPersonalInfo',{
          id:localStorage.getItem('id')
        }).then(res=>{
          this.wxUserInfo=res.wxUserInfo
          this.cars=res.cars
          this.cardBalance=res.cardBalance
        })
      },

      editCar(){
        this.isEditCar = !this.isEditCar
      },

      // 删除车
      delCar(index){
        this.$get('/wechat/client/deleteCar',{
          id:this.cars[index].id
        }).then(res=>{
          this.toast = this.$createToast({
            txt: '删除成功',
            type: 'txt'
          })
          this.toast.show()
          this.getAllInfo()
        })
      },

      addNewCar(){
        this.$router.push({path: '/addCar',query:{backTo:'/userHome'}})
      },
      toChangeInfo(){
        this.$router.push({path: '/changeUserInfo'})
      },

    },
    created: function(){
      if(localStorage.getItem('staffId')){
        this.$router.push({path:'/tecHome'})
      }else if(localStorage.getItem('clientId')){
        this.storeName=localStorage.getItem('storeName')
        this.getAllInfo()
      }else {
        this.$router.push({path:'/login'})
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

  .user-home
    background white
    height 100vh
    width 100vw

  .my-info
    height h(389)
    width 100vw
    display flex
    justify-content center
    flex-wrap wrap
    background url("../../assets/userHomeBg.png") no-repeat
    background-size 100% 100%
    color white

  .my-info-setting
    height w(40)
    width w(40)
    position absolute
    right w(40)
    top w(40)

  .my-info-photo
    height w(136)
    width w(136)
    border w(4) solid #ffffff
    border-radius 50%
    margin h(51) 100px h(10) 100px

  .name
    font-size h(29)
    margin 0 100px

  .my-info-other
    font-size h(20)
    margin 0 100px
    color #7A9BE2

  .my-info-position img
    width w(20)
    height h(24)

  .my-info-position span
    font-size h(26)

  .my-info-position button
    font-size h(24)
    color #FFBD03
    background transparent
    border transparent

  .switch
    width 100vw
    height h(256)
    border-top h(16) solid #EEEEEE
    border-bottom h(16) solid #EEEEEE
    font-size w(25)

  .my-car
    width 100vw
    height h(168)
    overflow-x scroll
    display flex
    align-items center

  .my-car div
    flex none

  .my-car-card
    height h(127)
    width w(293)
    border-radius w(20)
    background #F4F4F4
    margin 0 0 0 w(37)
    position relative

  .my-car-add
    height w(126)
    width w(126)
    margin-left w(30)

  .my-car-head
    height w(90)
    width w(90)
    position absolute
    top w(18)
    left w(18)

  .my-car-num
    font-size w(25)
    line-height w(50)
    font-weight 600
    left w(137)
    top h(21)
    position relative

  .my-car-brand
    font-size w(22)
    line-height w(50)
    left w(135)
    top h(10)
    position relative
    width w(150)
    display block
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

  .my-car-del
    height w(35)
    width w(35)
    position absolute
    right w(-15)
    top w(-15)

  .menu
    height h(88)
    margin-left w(41)
    width w(709)
    border-bottom $border-gray
    display flex
    align-items center
    color black

  .menu span
    font-size w(25)

  .card-icon
    height h(34)
    width w(45)
    margin-right w(24)

  .voucher-icon
    height h(41)
    width w(44)
    margin-right w(25)

  .car-icon
    height h(41)
    width w(44)
    margin-right w(25)

  .call-me-icon
    width w(46)
    height h(40)
    margin-right w(27)

  .edit
    height h(34)
    width w(30)
    right w(39)
    position absolute

  .more
    height h(25)
    width w(14)
    right w(37)
    position absolute

  .count
    position absolute
    right w(71)

  .assets
    border-bottom h(16) solid #EEEEEE
    height h(179)
    img
      height h(40)
      width w(45)
      position relative
      top h(5)
      margin-right w(20)
    div
      width w(370)
      float left
      padding h(15) w(35)
      margin h(10) 0
      box-sizing border-box
      position relative
    .assets-count
      color #2049BF
      font-size w(20)
      position absolute
      top h(80)
      left w(30)
      b
        font-size w(50)
        font-weight 800
        margin-right w(10)
    .assets-card
      border-right $border-gray
      height h(156)
    .assets-recharge
      height h(50)
      width w(165)
      position absolute
      right w(30)
      top h(80)
      color white
      font-size w(25)
      padding h(10) 0 0 w(45)
      box-sizing border-box
      background url("./../../assets/recharge.png") no-repeat
      background-size w(165) h(50)
</style>
