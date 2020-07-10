<template>
  <div class="change-order">
    <img class="change-order-head" :src="msg.headImgUrl" alt="">
    <div class="change-order-form">
      <span>昵称</span>
      <!--<input type="text" v-model="msg.name">-->
      <span>{{msg.name}}</span>
    </div>
    <div class="change-order-form">
      <span>称呼</span>
      <input @blur="scrollTo0" type="text" v-model="msg.trueName">
    </div>
    <div class="change-order-form">
      <span>性别</span>
      <div class="change-order-form-gender">
        <span @click="chooseGender('男')"><img :src="[msg.gender==='男'?'./static/checked.png':'./static/no-checked.png']" alt="">男</span>
        <span @click="chooseGender('女')"><img :src="[msg.gender==='女'?'./static/checked.png':'./static/no-checked.png']" alt="">女</span>
        <span @click="chooseGender('保密')"><img :src="[msg.gender==='保密'?'./static/checked.png':'./static/no-checked.png']" alt="">保密</span>
      </div>
    </div>
    <div class="change-order-form">
      <span>手机号码</span>
      <span><span>{{msg.phone}}</span><b @click="changePhoneBtn">修改</b></span>
    </div>

    <button class="big-blue-btn" @click="submit">保存</button>
    <button class="big-gray-btn" @click="signOut">退出登录</button>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui'
  export default {
    name: 'changeOrder',
    data() {
      return {
        msg: {
          name:'',
          trueName:'',
          gender:'男',
          phone:null,
          headImgUrl:''
        },
        newPhone:{
          phone:null,
          code:null
        }
      }
    },
    methods:{
      // 获取个人信息
      getInfo(){
        this.$get('/wechat/wxuser/getDetail?',{
          id:localStorage.getItem('id')
        }).then(res=>{
          this.msg.name=res.nickName
          this.msg.trueName=res.trueName
          this.msg.gender=res.gender
          this.msg.phone=res.phone
          this.msg.headImgUrl=res.headImgUrl
        })
      },

      // 滚动轴归位
      scrollTo0(){
        window.scrollTo(0,0)
      },

//      修改按钮
      changePhoneBtn(){
        this.dialog = this.$createDialog({
          type: 'prompt',
          title: '请输入新的手机号',
          prompt: {
            value: '',
            placeholder: '请输入新的手机号'
          },
          onConfirm: (e, promptValue) => {
            this.newPhone.phone=promptValue
            this.getCode()
          }
        }).show()
      },

//      获取验证码
      getCode() {
        if (this.newPhone.phone.length === 11) {
          this.$createToast({
            type: 'warn',
            time: 2000,
            txt: `正在获取验证码`
          }).show()
          this.codeDialogShow()
          this.$post('/wechat/login/getSmsCode?phone=' + this.newPhone.phone).then(res => {
            let info = setInterval(() => {
              if (this.getCodeInfoTime !== 0) {
                this.getCodeInfoTime -= 1
                this.passwordInfo = this.getCodeInfoTime + '秒后可重获'
              } else {
                this.passwordInfo = '获取验证码'
                this.getCodeInfoTime = 60
                clearInterval(info)
              }
            }, 1000)
            this.toast = this.$createToast({
              txt: '成功获取验证码',
              type: 'txt'
            })
            this.toast.show()
          })
        } else {
          this.toast = this.$createToast({
            txt: '请输入正确的手机号',
            type: 'txt'
          })
          this.toast.show()
        }
      },

//      弹出验证码的框
      codeDialogShow(){
        MessageBox.prompt('请输入验证码').then(({ value, action }) => {
          this.newPhone.code=value
          if(action==='confirm'){
            this.changePhone()
          }
        })
      },

      // 修改手机号
      changePhone(){
        this.$post('/wechat/login/changePhone?phone='+this.newPhone.phone+'&smsCode='+this.newPhone.code+'&id='+localStorage.getItem('id'),{
        }).then(res=>{
          this.toast = this.$createToast({
            txt: '修改成功',
            type: 'txt'
          })
          this.toast.show()
          this.msg.phone=this.newPhone.phone
        })
      },

      // 提交
      submit(){
        this.$post('/wechat/wxuser/saveUserInfo',{
          id:localStorage.getItem('id'),
          trueName:this.msg.trueName,
          nickName:this.msg.name,
          gender:this.msg.gender
        }).then(res=>{
          this.$router.go(-1)
        })
      },

//      选择性别
      chooseGender(gender){
        this.msg.gender = gender
      },

      // 退出登录
      signOut(){
        this.$createDialog({
          type: 'confirm',
          title: '是否确认退出登录？',
          confirmBtn: {
            text: '退出',
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
            localStorage.clear()
            this.$router.push({path:'/login'})
          },
          onCancel: () => {
            console.log('取消')
          }
        }).show()
      }
    },
    mounted:function () {
      this.getInfo()
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
    top h(50)

  .change-order
    height 100vh
    width 100vw
    background white
    padding h(280) 0 0 w(42)
    box-sizing border-box

  .change-order-head
    height h(144)
    width w(144)
    transform translate(-50%,0)
    position absolute
    top 5%
    left 50%
    border-radius 50%

  .change-order-form
    height h(90)
    border-top $border-gray
    display flex
    justify-content space-between
    align-items center
    padding-right w(45)
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
    input
      text-align right
    b
      color #2049BF
      margin-left w(12)
      padding-left w(12)
      border-left $border-gray


</style>
