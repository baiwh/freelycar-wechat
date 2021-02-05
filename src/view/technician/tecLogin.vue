<template>
  <div class="login">
    <img class="logo" src="../../assets/teclogin-bg.png" alt="logo" />
    <div class="form">
      <div class="phone">
        <img src="../../assets/people.png" alt="账号" />
        <input type="text" placeholder="请输入技师账号" v-model="account" />
      </div>
      <div class="password">
        <img src="../../assets/password2.png" alt="验证码" />
        <input
          type="password"
          placeholder="请输入账号密码"
          v-model="password"
        />
      </div>
      <div class="btn">
        <button :class="loginBtn" @click="logIn">登录</button>
      </div>
      <div class="userbtn">
        <router-link to="/login"> 用户登录 </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      checked: false,
      account: "",
      password: "",
      passwordInfo: "获取验证码",
      isGetCode: false,
      userInfo: {
        // openId:'oBaSqs8EjiGhwLVaaoHNar5Znvx4',
        // headImgUrl:'http://thirdwx.qlogo.cn/mmopen/vi_32/MTFxlqUXArWp0jneoRvhXqPxhSziblzr6UFbgxateq5Ab2U1QgX57YINiac4qD2nGcNokWgtBdbdmuibVicGzkickFg/132',
        // nickName:'bwh',
        // gender:'女',
        headimgurl: "",
        message: "",
        nickname: "",
        openid: "",
        subscribe: true,
      },
      staffList: [],
      pickerList: [],
    };
  },
  mounted() {
      this.isweixin();
  },
  methods: {
    // 登录
    logIn() {
      this.$post("/wechat/employee/login", {
        account: this.account,
        password: this.password,
        openId: this.userInfo.openid,
        // openId:"oBaSqs8HZFzGxJpZGePKt1kkckOk",
        nickName: this.userInfo.nickname,
        phone: this.account,
        headImgUrl: this.userInfo.headimgurl,
        gender: "男",
        province: "江苏",
        city: "南京",
      }).then((res) => {
        // this.axios.defaults.headers.common["Authorization"] = res.jwt
        console.log(res);
        localStorage.setItem("jwt", res.jwt);
        localStorage.setItem("employeeId", res.employee.id);
        localStorage.setItem("province", res.employee.province);
        localStorage.setItem("city", res.employee.city);
        localStorage.setItem("trueName", res.employee.trueName);
        localStorage.setItem("phone", res.employee.phone);
        localStorage.setItem("gender", res.employee.gender);
        localStorage.setItem("headImgUrl", res.employee.headImgUrl);
        localStorage.setItem("openId", res.employee.openId);
        localStorage.setItem("Authorization", "Bearer " + res.jwt);

        this.staffList = res.staffList;
        console.log(this.staffList);

        this.$router.push({ path: "/order" });
      });
    },

    //判断受否是微信内置浏览器
    isweixin() {
      //判断是否是微信浏览器
        let ua = window.navigator.userAgent.toLowerCase();
        console.log("ua", ua);
        if (ua.indexOf("micromessenger") !== -1) {
          //判断是否存在code参数
          if (this.getQueryString("code") != null) {
            this.code = this.getQueryString("code");
              //将code保存起
              //获取个人信息
              this.$get("/wechat/config/getWeChatUserInfo", {
                code: this.code,
              }).then((res) => {
                console.log(res);
                this.userInfo = res;
                // localStorage.setItem("userinfo",JSON.stringify(this.userInfo))
                localStorage.setItem("openId", this.userInfo.openid);
                localStorage.setItem("subscribe", this.userInfo.subscribe);
                localStorage.setItem("nickName", this.userInfo.nickname);
                localStorage.setItem("headImgUrl", this.userInfo.headimgurl);
                console.log(localStorage.getItem("subscribe"));

                if (localStorage.getItem("subscribe") == "false") {
                  window.location.href =
                    "http://mp.weixin.qq.com/s?__biz=MzAxNDMwNDc3Mw==&mid=502678227&idx=1&sn=22cc3edc520a3058aa5b2aed5f376904&chksm=0397b1b934e038af1b3802e6b993461d18e5780b2349fe339c3fa82a3bee6586a3650d531ee4#rd";
                }
              }).catch((e)=>{
                console.log(e)
              });
          } else {
            //console.log('未授权')

            //开发
            // window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd188f8284ee297b&redirect_uri=http%3A%2F%2Fwww.freelycar.cn%2Fwechat%2FtecLogin&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect"

            // 部署
            window.location.href =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd188f8284ee297b&redirect_uri=https%3A%2F%2Fwww.freelycar.com%2Fwechat%2FtecLogin&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
          }
          // this.userInfo = {
          //   city: "杭州",
          //   gender: "男",
          //   headimgurl:
          //     "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJiamoz5DKExvibiaWlHZZQVQjHm2ueicIM0rENicVo0kKJAdArxP0hjK3NicnXGxs5w9DaTXZRHibmwKnew/132",
          //   nickname: "Baiye",
          //   openid: "oBaSqs8HZFzGxJpZGePKt1kkckOk",
          //   province: "浙江",
          //   subscribe: true,
          // };
          // localStorage.setItem("openId", this.userInfo.openid);
          // localStorage.setItem("subscribe", this.userInfo.subscribe);
          // localStorage.setItem("nickName", this.userInfo.nickname);
          // localStorage.setItem("headImgUrl", this.userInfo.headimgurl);
        } else {
          console.log("请在微信客户端打开！");
          return false;
        }
        console.log(this.userInfo);
    },

    //判断参数是否存在
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
  },
  computed: {
    loginBtn: function () {
      if (this.account.length === 11 && this.password !== "") {
        return "login-btn-blue";
      } else {
        return "login-btn-gray";
      }
    },
  },
};
</script>

<style scoped lang="stylus">
/* 高度宽度 */
h(n) {
  n * 0.13vw;
}

w(n) {
  ((n / 7.5vw));
}

.login {
  height: 100vh;
  width: 100vw;
  background: white;
}

.logo {
  width: 100vw;
}

.form {
  background: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.form div {
  display: flex;
  align-content: center;
}

.form input {
  border-bottom: $border-gray;
  width: w(566);
  padding: 0 0 w(11) 0;
  margin: 0 0 0 w(42);
  font-size: w(30);
}

.phone {
  margin-top: h(135);
}

.phone img {
  height: h(43);
  width: w(37);
}

.password {
  margin-top: h(76);
}

.password img {
  height: h(46);
  width: w(38);
}

.password-info {
  position: absolute;
  width: w(150);
  line-height: h(45);
  font-size: w(24);
  right: 0;
  border-left: $border-gray;
  padding: 0 w(82) 0 w(36);
  text-align: center;
}

.gray-info {
  color: darkgray;
}

.blue-info {
  color: #2049BF;
}

.btn {
  display: flex;
  width: 100%;
  justify-content: center;
}

.btn button {
  height: h(70);
  width: w(500);
  margin: w(116) w(28);
  border-radius: h(35);
  border: 0 solid;
  color: white;
  font-size: w(31);
}

.switch-user {
  background-color: $bt-yellow;
}

.login-btn-blue {
  background-color: $bt-blue;
}

.login-btn-gray {
  background-color: darkgray;
}

.userbtn {
  margin-top: w(80);
}

.userbtn button {
  font-size: w(28);
  color: #a9a9a9;
}
.feedback {
  position fixed;
  right 0
  bottom h(600)
}
</style>
