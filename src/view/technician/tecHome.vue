<template>
  <div class="user-home">
    <div class="my-info">
      <img class="my-info-photo" :src="staffInfo.headImgUrl" alt="头像" />
      <span class="name">{{ staffInfo.trueName }}</span>
      <span class="my-info-other"
        >{{ staffInfo.gender }} · {{ staffInfo.province }} ·
        {{ staffInfo.city }}</span
      >
    </div>

    <div class="switch">
      <img
        v-if="staffInfo.notification"
        src="../../assets/switch-on.png"
        alt="开"
      />
      <img v-else src="../../assets/switch-off.png" alt="关" />
      <span>服务状态</span>

      <span
        :class="[
          staffInfo.notification
            ? 'switch-info switch-info-blue'
            : 'switch-info switch-info-gray',
        ]"
        >{{ staffInfo.notification ? "接单中" : "停止接单" }}</span
      >
      <mt-switch
        class="switch-btn"
        @change="switchService"
        v-model="staffInfo.notification"
      ></mt-switch>
    </div>

    <div>
      <!-- <router-link to="/historyOrder">
        <div class="menu">
          <img class="history-icon" src="../../assets/history-icon.png" alt="历史">
          <span>历史订单</span>
          <span class="count">总计：{{staffInfo.historyOrderCount?staffInfo.historyOrderCount:0}}单</span>
          <img class="more" src="../../assets/more.png" alt="详细">
        </div>
      </router-link> -->

      <a href="tel:025-86697165">
        <div class="menu">
          <img
            class="call-me-icon"
            src="../../assets/call-me.png"
            alt="联系小易"
          />
          <span>联系小易</span>
          <img class="more" src="../../assets/more.png" alt="详细" />
        </div>
      </a>
    </div>

    <button class="big-gray-btn" @click="signOut">退出登录</button>
    <feed-back class="feedback"> </feed-back>
  </div>
</template>

<script>
import feedBack from "@/view/components/feedBack.vue";
export default {
  name: "userHome",
  components: { feedBack },
  data() {
    return {
      switchValue: false,
      selected: "",
      options: ["服务状态"],
      staffInfo: {},
      storeName: "",
      storeList: [],
      pickerList: [],
    };
  },
  methods: {
    // 切换服务状态
    switchService() {
      this.$get("/wechat/employee/switchServiceStatus", {
        id: localStorage.getItem("employeeId"),
      }).then((res) => {});
    },

    // 个人信息
    getInfo() {
      this.$get("/wechat/employee/detail", {
        id: localStorage.getItem("employeeId"),
      }).then((res) => {
        console.log(res);
        this.staffInfo = res;
      });
    },

    // 退出登录
    signOut() {
      this.$createDialog({
        type: "confirm",
        title: "是否确认退出登录？",
        confirmBtn: {
          text: "退出",
          active: true,
          disabled: false,
          href: "javascript:;",
        },
        cancelBtn: {
          text: "取消",
          active: false,
          disabled: false,
          href: "javascript:;",
        },
        onConfirm: () => {
          localStorage.clear();
          this.$router.push({ path: "/login" });
        },
        onCancel: () => {
          console.log("取消");
        },
      }).show();
    },
  },
  mounted: function () {
    this.getInfo();
  },
};
</script>

<style scoped lang="stylus">
/* 高度宽度 */
h(n) {
  n * 0.13vw;
}

w(n) {
  (n / 7.5vw);
}

.user-home {
  background: white;
  height: 100vh;
  width: 100vw;
}

.my-info {
  height: h(389);
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background: url('../../assets/userHomeBg.png') no-repeat;
  background-size: 100% 100%;
  color: white;
}

.my-info-setting {
  height: w(40);
  width: w(40);
  position: absolute;
  right: w(40);
  top: w(40);
}

.my-info-photo {
  height: w(136);
  width: w(136);
  border: w(4) solid #ffffff;
  border-radius: 50%;
  margin: h(51) 100px h(10) 100px;
}

.name {
  font-size: h(29);
  margin: 0 100px;
}

.my-info-other {
  font-size: h(20);
  margin: 0 100px;
  color: #7A9BE2;
}

.my-info-position img {
  width: w(20);
  height: h(24);
}

.my-info-position span {
  font-size: h(26);
}

.my-info-position button {
  font-size: h(24);
  color: #FFBD03;
  background: transparent;
  border: transparent;
}

.switch {
  width: 100vw;
  height: h(90);
  border-top: h(16) solid #EEEEEE;
  border-bottom: h(16) solid #EEEEEE;
  display: flex;
  align-items: center;
  font-size: w(25);
}

.switch img {
  height: w(34);
  width: w(34);
  margin: 0 w(28) 0 w(46);
}

.switch-info {
  font-size: w(25);
  position: absolute;
  right: w(169);
}

.switch-info-gray {
  color: #CFCFCF;
}

.switch-info-blue {
  color: #2049BF;
}

.switch-btn {
  transform: scale(0.6, 0.6) !important;
  position: absolute;
  right: w(46);
}

.menu {
  height: h(88);
  margin-left: w(41);
  width: w(709);
  border-bottom: $border-gray;
  display: flex;
  align-items: center;
}

.menu span {
  font-size: w(25);
}

.history-icon {
  height: h(41);
  width: w(32);
  margin-right: w(29);
}

.call-me-icon {
  width: w(39);
  height: h(37);
  margin-right: w(26);
}

.more {
  height: h(25);
  width: w(14);
  right: w(37);
  position: absolute;
}

.count {
  position: absolute;
  right: w(71);
}

.feedback {
  position: fixed;
  right: 0;
  bottom: h(500);
}
</style>
