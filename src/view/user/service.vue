<template>
  <div>
    <div class="header" v-show="storeShow">
      <div class="header-info">
        <i class="cubeic-home"></i>
        <span>{{storeName}}</span>
      </div>
      <div class="header-little">
        <i class="cubeic-navigation"></i>
        <span>{{storeAddress}}</span>
      </div>
    </div>
    <div class="header" v-show="!storeShow">
      <div class="header-nostore">
        <i class="cubeic-home"></i>
        <span>暂未选择</span>
      </div>
    </div>
    <div class="container" v-show="storeShow">
      <div class="store-service">
        <div v-for="(serviceitem,index) in serviceList" :key="index">
          <div class="store-service-item-title flex-center" @click="openOrCloseProject(index)">
            <span>{{serviceitem.name}}</span>
            <img :src="serviceitem.show?'./static/up.png':'./static/down.png'" alt />
          </div>
          <div
            v-show="serviceitem.show"
            v-for="(projectItem,projuctIndex) in serviceitem.projects"
            class="flex-center store-service-item"
            :key="projuctIndex"
          >
            <div>
              <span class="store-service-items">{{projectItem.name}}</span>
            </div>
            <div>
              <span class="store-service-price">￥{{projectItem.price}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-store" v-show="!storeShow">
      对不起，您暂未选择网点
    </div>
  </div>
</template>

<script>
export default {
  name: "service",
  data() {
    return {
      serviceList: [],
      projects: [],
      projectListIndex: 'all',
      newUser:false,
      storeName:'',
      storeAddress:'',
      storeShow:false
    };
  },
  methods: {
    openOrCloseProject(index) {
        this.serviceList[index].show =!this.serviceList[index].show;
    },
    getServiceData(newUser){
      this.$get("/wechat/ark/getRspProjects",{
        storeId: localStorage.getItem("storeId"),
        newUser: newUser,
      }).then((res)=>{
        console.log(res)
        for(var i in res){
          res[i].show = true;
        }
        this.serviceList = res;
      })
    }
  },
  mounted(){
    this.newUser = localStorage.getItem("newUser");
    if(localStorage.getItem("storeId")){
      this.storeShow = true
      this.storeName = localStorage.getItem("storeName");
      this.storeAddress = localStorage.getItem("storeAddress");
    }
    this.getServiceData(this.newUser);
  }
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

.header-nostore{
  height: 27px;
  padding: h(70) h(40) h(40);
  font-size: 27px;
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
  font-size: w(35);

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
.no-store{
  height:400px;
  line-height 400px;
  text-align center
}
</style>