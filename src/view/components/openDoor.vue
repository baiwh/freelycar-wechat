<template>
  <div class="open-door">
    <img class="open-door-img" src="./../../assets/open-door.png" alt="">
    <span>{{arkInfo.text1}}</span>
    <span>{{arkInfo.text2}}<br>{{arkInfo.text3}}</span>
    <div class="open-door-loading">
      <img class="open-door-car" src="./../../assets/loading-car.png" alt="">
      <div></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'openDoor',
    data() {
      return {
        arkInfo:{
          text1:'',
          text2:''
        },
      }
    },
    props: [
      'arkInfoState'
    ],
    methods: {
      changeTxt(state,doorSn){
        switch (state){
          case 'billingOrder':{
            this.arkInfo={text1:doorSn+'号柜门正在打开，请勿离开', text2:'柜门打开，请放入钥匙，并关闭柜门',text3:''}
          }
            break
          case 'cancelOrder':{
            this.arkInfo={text1:doorSn+'打开，请取走钥匙，并关闭柜门', text2:'',text3:''}
          }
            break
          case 'payOrder':{
            this.arkInfo={text1:doorSn+'打开，请取走钥匙，并关闭柜门', text2:'谢谢您的支持！',text3:''}
          }
            break
          case 'tecGetKey':{
            this.arkInfo={text1:doorSn+'正在打开，请勿离开', text2:'柜门打开，请取走钥匙，并关闭柜门',text3:''}
          }
            break
          case 'tecFinish':{
            this.arkInfo={text1:doorSn+'号柜门已打开', text2:'请将钥匙放入柜内，并关闭柜门',text3:'柜门关闭后选择“确认完工”完成订单'}
          }
            break
        }
      }
    },
    mounted: function () {

    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .open-door
    z-index 100
    position absolute
    top 0
    left 0
    background white
    height 100vh
    width 100vw
    display flex
    justify-content space-between
    flex-direction column
    align-items center
    box-sizing border-box
    padding h(179) 0 h(378) 0

  .open-door span
    color #2049BF
    font-size w(24)
    text-align center

  .open-door-img
    height h(184)
    width w(193)

  .open-door-car
    height h(28)
    width w(93)
    position relative
    top h(-30)
    left w(80)

  .open-door-loading
    height h(23)
    width w(398)
    border 1px solid #B3B3B3
    border-radius w(12)
    div
      height h(25)
      width w(150)
      background $bt-blue
      border-radius w(12)
      top h(-32)
      position relative


</style>
