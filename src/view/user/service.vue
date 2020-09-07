<template>
  <div>
    <div class="header">
      <div class="header-info">
        <i class="cubeic-home"></i>
        <span>徐庄·软件园</span>
      </div>
      <div class="header-little">
        <i class="cubeic-navigation"></i>
        <span>徐庄·软件园停车场</span>
      </div>
    </div>
    <div class="container">
      <div class="store-service">
        <div v-for="(item,index) in store" :key="index">
          <div class="store-service-item-title flex-center" @click="openOrCloseProject(index)">
            <span>{{item.servicename}}</span>
            <img :src="item.show?'./static/up.png':'./static/down.png'" alt />
          </div>
          <div
            v-show="item.show"
            v-for="(projectItem,projuctIndex) in item.serviceproject"
            class="flex-center store-service-item"
            :key="projuctIndex"
          >
            <div>
              <span class="store-service-items">{{projectItem.project}}</span>
            </div>
            <div>
              <span class="store-service-price">￥100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "service",
  data() {
    return {
      serviceList: [],
      store: [
        {
          servicename: "服务商A",
          serviceproject: [{ project: "普洗A" }, { project: "普洗B" }],
          show:true
        },
        {
          servicename: "服务商B",
          serviceproject: [{ project: "打蜡" }, { project: "精洗B" },],
          show:true
        },
      ],
      projects: [],
      projectListIndex: 'all',
    };
  },
  methods: {
    openOrCloseProject(index) {
        this.store[index].show =!this.store[index].show;
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
  n / 7.5vw;
}

.header {
  width: 100vw;
  height: h(200);
  background-color: #2458CE;
}

.header-info {
  height: 22px;
  padding: h(50) h(40) h(40);
  font-size: 22px;
  color: #ffffff;
  font-family: sans-serif;
  vertical-align: middle;
}

.header-info span {
  margin: 0 h(30);
}

.header-little {
  padding: 0 h(40);
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
  position: relative;
}

.header-little span {
  margin: h(90);
}

.cubeic-navigation {
  font-size: 22px;
  position: absolute;
  top: h(5);
}

// 服务商列表
.store-service {
  background: white;
  margin-bottom: h(16);
}

.store-service-title {
  height: h(77);
  padding: 0 w(40);
}

.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: $border-gray;
  position: relative;
}

.store-service-item-title {
  height: h(74);
  padding: 0 w(40);
  font-size: w(26);

  b {
    color: #858585;
    font-size: w(20);
    margin-left: w(10);
  }

  img {
    width: w(25);
    height: h(14);
  }
}

.store-service-item {
  height: h(115);
  padding: 0 w(44) 0 w(61);
}

.store-service-items {
  position: absolute;
  top: h(35);
  font-size: w(30);
}
.store-service-price
    color #FFBD03
    font-size w(24)
    position absolute
    right w(44)
    top h(35)
</style>