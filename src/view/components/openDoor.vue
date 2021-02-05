<template>
  <div class="open-door">
    <img class="open-door-img" src="./../../assets/open-door.png" alt="">
    <span class="doorInfo" >{{arkInfo.text1}}<strong class="highlight">&nbsp;{{doorSn}}&nbsp;</strong><span class="doorInfo" v-html="arkInfo.text2"></span></span>
    <span>{{arkInfo.text3}}</span>
    <div class="open-door-loading">
      <img class="open-door-car" src="./../../assets/loading-car.png" alt="">
      <div></div>
    </div>
    <feed-back class="feedback">
    </feed-back>
  </div>
</template>

<script>
import feedBack from '@/view/components/feedBack.vue';
  export default {
    components: { feedBack },
    name: 'openDoor',
    data() {
      return {
        doorSn:'',
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
        this.doorSn = doorSn;
        switch (state){
          case 'billingOrder':{
            this.arkInfo={text1:'正在打开',text2:'号柜门,请勿离开', text3:'柜门打开，请放入钥匙，并关闭柜门',}
          }
            break
          case 'cancelOrder':{
            this.arkInfo={text1:'正在打开', text2:`</br>请取走钥匙，并关闭柜门`,text3:'柜门打开，请取走钥匙，并关闭柜门'}
          }
            break
          case 'payOrder':{
             this.arkInfo={text1:'正在打开', text2:`</br>请取走钥匙，并关闭柜门`,text3:'谢谢您的支持！'}
          }
            break
          case 'tecGetKey':{
            this.arkInfo={text1:'正在打开',text2:',请勿离开', text3:'柜门打开，请取走钥匙，并关闭柜门',}
          }
            break
          case 'tecFinish':{
            this.arkInfo={text1:'正在打开',text2:'号柜门,请勿离开', text3:'柜门打开，请放入钥匙，并关闭柜门',}
          }
            break
        }
      }
    },
    mounted: function () {
            //  this.arkInfo={text1:'正在打开', text2:`号柜门</br>请取走钥匙，并关闭柜门`,text3:'谢谢您的支持！'}

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
  .open-door .doorInfo{
  color: #D9001B;
  font-size w(38);
  line-height w(60)

  .highlight{
    font-size w(80)
    font-weight:bold
  }
}

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

.feedback {
  position fixed;
  right 0
  bottom h(600)
}
</style>
