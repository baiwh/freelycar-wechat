<template>
  <div class="change-car">
    <div v-for="(item,index) in carList"
         @click="chooseCar(item.licensePlate,item.id)"
         class="change-car-card" :key="index">
      <img class="change-car-card-img" :src="[item.carImageUrl?item.carImageUrl:'./static/car.png']" alt="">
      <!--<img class="change-car-card-img" src="./../../assets/car.png" alt="">-->
      <div>
        <span>{{item.licensePlate}}</span>
        <!--<span><img src="./../../assets/name1.png" alt="">{{name}}</span>-->
      </div>
      <span>{{item.color}} · {{item.carBrand}}</span>
    </div>

    <button @click="toAddCar"><img src="./../../assets/add1.png" alt="">添加爱车</button>

  </div>
</template>

<script>
  export default {
    name: 'changeCar',
    data() {
      return {
        carList:[],
        name:''
      }
    },
    methods: {
      getCar(){
        //修改接口
        this.$get('/wechat/client/listPersonalCars',{
          wxUserId:localStorage.getItem('id')
        }).then(res=>{
          console.log(res)
          this.carList = res
        })
      },

      // 选择车
      chooseCar(licensePlate,id){
        this.$router.push({path:'/billingOrder',query:{licensePlate:licensePlate,id:id}})
      },

      toAddCar(){
        this.$router.push({path:'/addCar',query:{backTo:'/changeCar'}})
      },
    },
    mounted: function () {
      this.getCar()
      this.name=localStorage.getItem('trueName')
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .change-car
    background white
    height 100vh
    width 100vw
    position relative
    padding h(30) 0
    button
      height h(68)
      width w(624)
      transform translateX(-50%)
      left 50%
      margin h(50) 0
      position absolute
      background white
      border-radius h(68)
      border 1px solid #2049BF
      display flex
      align-items center
      justify-content center
      img
        height w(30)
        width w(30)
        margin 0 w(30)

  .change-car-card
    height h(139)
    width w(624)
    background #F4F4F4
    border-radius w(20)
    margin h(30) 0
    position relative
    transform translateX(-50%)
    left 50%
    overflow hidden
    span
      margin w(30)
      color #888888
      font-size w(25)
    div
      width w(440)
      float left
      padding h(19) 0
      box-sizing border-box
      span
        line-height h(40)
        margin 0 w(30)
        color black
        font-size w(28)
        img
          height w(33)
          width w(33)
          margin 0 w(10)

  .change-car-card-img
    height h(139)
    width w(180)
    float left



</style>
