<template>
  <div class="user-info">
    <img class="centered user-info-head" src="./../../assets/head.png" alt="">
    <img class="centered user-info-first" src="./../../assets/user-info-first.png" alt="">

    <div class="form">
      <div class="form-box">
        <img class="user-info-name" src="./../../assets/name.png" alt="">
        <input v-model="name" type="text" placeholder="如何称呼您？" @blur="scrollTo0">
      </div>

      <div class="form-box">
        <img class="user-info-sex" src="./../../assets/sex.png" alt="">
        <div class="change-order-form-gender">
          <span @click="chooseGender('男')"><img :src="[gender==='男'?'./static/checked.png':'./static/no-checked.png']" alt="">男士</span>
          <span @click="chooseGender('女')"><img :src="[gender==='女'?'./static/checked.png':'./static/no-checked.png']" alt="">女士</span>
          <span @click="chooseGender('保密')"><img :src="[gender==='保密'?'./static/checked.png':'./static/no-checked.png']" alt="">保密</span>

        </div>
      </div>
    </div>

    <button class="big-blue-btn" @click="submit">下一步</button>
    <router-link to="/login">
      <button class="big-gray-btn">取消</button>
    </router-link>
    <feed-back class="feedback">
    </feed-back>
  </div>
</template>

<script>
import feedBack from '@/view/components/feedBack.vue';
  export default {
    components: { feedBack },
    name: 'userInfo',
    data() {
      return {
        name:'',
        gender:''
      }
    },
    methods: {
//        选择性别
      chooseGender(gender){
        this.gender = gender
      },

      // 滚动轴归位
      scrollTo0(){
        window.scrollTo(0,0)
      },

//        提交
      submit(){
        if(this.name!==''&&this.gender!==''){
          this.$post('/wechat/wxuser/saveUserInfo',{
            id:localStorage.getItem('id'),
            trueName:this.name,
            nickName:localStorage.getItem('nickName'),
            gender:this.gender
          }).then(res=>{
            localStorage.setItem('trueName',res.trueName)
            localStorage.setItem('storeId',res.defaultStoreId)
            localStorage.setItem('clientId',res.defaultClientId)
            // 检查是否有车
            this.$get('/wechat/client/listPersonalCars',{
              wxUserId:localStorage.getItem('id')
            }).then(res=>{
              if(res.length>0){
                this.$router.push({path:'/billingOrder'})
              }else {
                this.$router.push({path:'/carInfo'})
              }
            })
          })
        } else {
          this.toast = this.$createToast({
            txt: '您有信息未填写',
            type: 'txt'
          })
          this.toast.show()
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

  .big-blue-btn
    top h(450)

  .big-gray-btn
    top h(400)

  .user-info
    position relative
    height 100vh
    width 100vw
    background white

  .centered
    position absolute
    transform translate(-50%,0)

  .user-info-head
    height w(185)
    width w(185)
    left 50%
    top h(96)

  .user-info-first
    height w(69)
    width w(651)
    left 50%
    top h(327)

  .form
    top h(480)
    position relative
    padding 0 $w=w(67)
    width 100vw-$w-$w

  .form img
    margin-right w(14)

  .form input
    width w(549)
    font-size w(26)
    border-bottom $border-gray
    padding-bottom h(12)
    padding-left w(20)

  .form-box
    display flex
    align-items center
    margin-bottom h(54)

  .change-order-form-gender
    display flex
    align-items center
    span
      display flex
      align-items center
      margin 0 w(10)
    img
      height w(30)
      width w(30)
      margin 0 w(20)

  .user-info-name
    height h(47)
    width w(53)

  .user-info-sex
    height h(43)
    width w(52)

  .user-info-birth
    height h(45)
    width w(47)

  .down-arrow
    flex none
    position absolute
    right w(70)
    height h(9)
    width w(18)

  .feedback {
  position fixed;
  right 0
  bottom h(600)
}
</style>
