<template>
  <!-- 选择品牌 -->
  <div>
    <!-- 搜索框 -->
    <section class="search">
      <div class="mint-search">
        <div class="mint-searchbar">
          <div class="mint-searchbar-inner">
            <i class="mintui mintui-search" @click="searchbrand"></i>
            <input type="search" placeholder="搜索品牌关键字" class="mint-searchbar-core" v-model="keyword"
                   @keyup.enter="searchbrand">
          </div>
          <a class="mint-searchbar-cancel" style="display: none;">取消</a>
        </div>
        <div class="mint-search-list" style="display: none;">
          <div class="mint-search-list-warp">
          </div>
        </div>
      </div>
    </section>
    <!-- 热门品牌 -->
    <section class="hot">
      <p>热门品牌</p>
      <mt-swipe :auto="4000">
        <mt-swipe-item>
          <a v-for="(item,index) in hotbrand" v-show="index<8" @click="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)" :key="index">
            <img :src="item.bgname">
            <span>{{item.brand}}</span>
          </a>
        </mt-swipe-item>
      </mt-swipe>
    </section>
    <!-- 列表 -->
    <section class="list">
      <mt-index-list>
        <mt-index-section index="A" v-show="A.length!=0">
          <mt-cell v-for="(item,index) in A" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="B" v-show="B.length!=0">
          <mt-cell v-for="(item,index) in B" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="C" v-show="C.length!=0">
          <mt-cell v-for="(item,index) in C" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="D" v-show="D.length!=0">
          <mt-cell v-for="(item,index) in D" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="E" v-show="E.length!=0">
          <mt-cell v-for="(item,index) in E" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="F" v-show="F.length!=0">
          <mt-cell v-for="(item,index) in F" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="G" v-show="G.length!=0">
          <mt-cell v-for="(item,index) in G" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="H" v-show="H.length!=0">
          <mt-cell v-for="(item,index) in H" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="I" v-show="I.length!=0">
          <mt-cell v-for="(item,index) in I" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="J" v-show="J.length!=0">
          <mt-cell v-for="(item,index) in J" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="K" v-show="K.length!=0">
          <mt-cell v-for="(item,index) in K" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="L" v-show="L.length!=0">
          <mt-cell v-for="(item,index) in L" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="M" v-show="M.length!=0">
          <mt-cell v-for="(item,index) in M" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="N" v-show="N.length!=0">
          <mt-cell v-for="(item,index) in N" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="O" v-show="O.length!=0">
          <mt-cell v-for="(item,index) in O" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="P" v-show="P.length!=0">
          <mt-cell v-for="(item,index) in P" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="Q" v-show="Q.length!=0">
          <mt-cell v-for="(item,index) in Q" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="R" v-show="R.length!=0">
          <mt-cell v-for="(item,index) in R" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="S" v-show="S.length!=0">
          <mt-cell v-for="(item,index) in S" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="T" v-show="T.length!=0">
          <mt-cell v-for="(item,index) in T" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="U" v-show="U.length!=0">
          <mt-cell v-for="(item,index) in U" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="V" v-show="V.length!=0">
          <mt-cell v-for="(item,index) in V" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="W" v-show="W.length!=0">
          <mt-cell v-for="(item,index) in W" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="X" v-show="X.length!=0">
          <mt-cell v-for="(item,index) in X" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="Y" v-show="Y.length!=0">
          <mt-cell v-for="(item,index) in Y" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
        <mt-index-section index="Z" v-show="Z.length!=0">
          <!-- 取消车系后修改品牌click事件参数 -->
          <mt-cell v-for="(item,index) in Z" :title="item.brand" :key="index"
                   @click.native="choosebrand(item.id,item.brand,licensePlate,clientId,storeId,item.bgname)">
            <div class="mint-cell-left">
              <img :src="item.bgname">
            </div>
          </mt-cell>
        </mt-index-section>
      </mt-index-list>
    </section>

    <!-- 弹出框 -->
    <!-- 更新：取消车系选择 -->
    <!-- <div class="mint-msgbox-wrapper" v-show="isshow">
      <div class="mint-msgbox">
        <div class="mint-msgbox-header" style="height:50px">
          <img :src="bgname">
          <p>{{choosedbrand}}</p>
        </div>
        <div class="mint-msgbox-content">
          <div class="carlines" v-for="(item,index) in vehiclesystem"
               @click="choosedcarline(item.id,item.type,licensePlate,clientId,storeId,bgname)" :key="index">
            <p>{{item.type}}</p>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 阴影层 -->
    <!-- <div class="v-modal" style="z-index: 2000;" v-show="isshow" @click="rechoose"></div> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
        img:'',
        backTo:'',
        from:'',
        carbrand: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],//分类
        keyword: '',//关键字搜索
        isshow: false,
        vehiclesystem: [],//车系
        choosedbrand: '',
        licensePlate: '',
        storeId: '',
        clientId: '',
        hotbrand: [],
        color:'',
        bgname: ''//图片
      }
    },
    created() {
      this.licensePlate = this.$route.query.licensePlate
      this.clientId = this.$route.query.clientId
      this.storeId = this.$route.query.storeId
      this.from = this.$route.query.from
      this.img = this.$route.query.img
      this.color = this.$route.query.color
      this.backTo = this.$route.query.backTo
      this.$get('/wechat/carBrand/getAllCarBrand').then(response => {
        this.carbrand = response
        this.carbrand = response.map(item => {
          return {
            brand: item.brand,
            hot: item.hot,
            id: item.id,
            pinyin: item.pinyin,
            bgname: require(`@/assets/brand/images/${item.brand}.jpg`)
          }
        })
        this.classify(this.carbrand)

      })

      this.$get('/wechat/carBrand/getHotCarBrand').then(response => {
        this.hotbrand = response
        this.hotbrand = response.map(item => {
          return {
            brand: item.brand,
            hot: item.hot,
            id: item.id,
            pinyin: item.pinyin,
            bgname: require(`@/assets/brand/images/${item.brand}.jpg`)
          }
        })
      })

    },
    methods: {
      //根据A-Z进行分类
      classify(data) {
        this.A = [];
        this.B = [];
        this.C = [];
        this.D = [];
        this.E = [];
        this.F = [];
        this.G = [];
        this.H = [];
        this.I = [];
        this.J = [];
        this.K = [];
        this.L = [];
        this.M = [];
        this.N = [];
        this.O = [];
        this.P = [];
        this.Q = [];
        this.R = [];
        this.S = [];
        this.T = [];
        this.U = [];
        this.V = [];
        this.W = [];
        this.X = [];
        this.Y = [];
        this.Z = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].pinyin === "A") {
            this.A.push(data[i])
          } else if (data[i].pinyin === "B") {
            this.B.push(data[i])
          } else if (data[i].pinyin === "C") {
            this.C.push(data[i])
          } else if (data[i].pinyin === "D") {
            this.D.push(data[i])
          } else if (data[i].pinyin === "E") {
            this.E.push(data[i])
          } else if (data[i].pinyin === "F") {
            this.F.push(data[i])
          } else if (data[i].pinyin === "G") {
            this.G.push(data[i])
          } else if (data[i].pinyin === "H") {
            this.H.push(data[i])
          } else if (data[i].pinyin === "I") {
            this.I.push(data[i])
          } else if (data[i].pinyin === "J") {
            this.J.push(data[i])
          } else if (data[i].pinyin === "K") {
            this.K.push(data[i])
          } else if (data[i].pinyin === "L") {
            this.L.push(data[i])
          } else if (data[i].pinyin === "M") {
            this.M.push(data[i])
          } else if (data[i].pinyin === "N") {
            this.N.push(data[i])
          } else if (data[i].pinyin === "O") {
            this.O.push(data[i])
          } else if (data[i].pinyin === "P") {
            this.P.push(data[i])
          } else if (data[i].pinyin === "Q") {
            this.Q.push(data[i])
          } else if (data[i].pinyin === "R") {
            this.R.push(data[i])
          } else if (data[i].pinyin === "S") {
            this.S.push(data[i])
          } else if (data[i].pinyin === "T") {
            this.T.push(data[i])
          } else if (data[i].pinyin === "U") {
            this.U.push(data[i])
          } else if (data[i].pinyin === "V") {
            this.V.push(data[i])
          } else if (data[i].pinyin === "W") {
            this.W.push(data[i])
          } else if (data[i].pinyin === "X") {
            this.X.push(data[i])
          } else if (data[i].pinyin === "Y") {
            this.Y.push(data[i])
          } else if (data[i].pinyin === "Z") {
            this.Z.push(data[i])
          }
        }
      },
      //根据关键字搜索
      searchbrand() {
        if (this.keyword !== '') {
          this.$get('/wechat/carBrand/getCarBrandByKeyword', {'keyword': this.keyword}).then(response => {
            this.carbrand = response
            this.carbrand = response.map(item => {
              return {
                brand: item.brand,
                hot: item.hot,
                id: item.id,
                pinyin: item.pinyin,
                bgname: require(`@/assets/brand/images/${item.brand}.jpg`)
              }
            })
            this.classify(this.carbrand)
          })
        } else if (this.keyword === '') {
          this.$get('/wechat/carBrand/getAllCarBrand').then(response => {
            this.carbrand = response
            this.carbrand = response.map(item => {
              return {
                brand: item.brand,
                hot: item.hot,
                id: item.id,
                pinyin: item.pinyin,
                bgname: require(`@/assets/brand/images/${item.brand}.jpg`)
              }
            })
            this.classify(this.carbrand)
          })
        }

      },
      //选择品牌然后弹出选择车系
      //选择车系，然后跳转到添加爱车页面
      // choosebrand(id, brand, bgname) {
      //   console.log(document.body.clientHeight)
      //   let height = document.body.clientHeight - 130
      //   document.getElementsByClassName('mint-msgbox-content')[0].style.height = height + "px"
      //   this.bgname = bgname;
      //   this.choosedbrand = brand;
      //   this.isshow = true;
      //   //this.noScroll();
      //   this.$get('/wechat/carBrand/getCarTypeByCarBrandId', {carBrandId: id}).then(response => {
      //     this.vehiclesystem = response
      //   })
      // },
      
      //选择车系，然后跳转到添加爱车界面
      choosebrand(carbrandid, carline, licensePlate, clientId, storeId, bgname) {

        console.log(carbrandid,carline,licensePlate,clientId,storeId,bgname)
        this.$router.push({path: this.from,
          query: {backTo:this.backTo, color:this.color,img:this.img,
            carbrandid, carline, licensePlate, bgname}})
      },
      rechoose() {
        this.isshow = !this.isshow;
      }
    }
  }
</script>

<style lang="less" scoped>
  //热门搜索
  .hot {
    height: 180px;
    background: rgba(255, 255, 255, 1);
    border-top: 1px solid rgba(242, 242, 242, 1);
    p {
      width: 55px;
      height: 16px;
      font-size: 13px;
      font-family: PingFangSC-Regular;
      color: rgba(153, 153, 153, 1);
      line-height: 16px;
      margin-left: 4%;
      padding-top: 10px;
    }
    a {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 25%;
      float: left;
      margin-top: 15px;
      img {
        width: 28px;
        height: 28px;
        background-color: #ebebeb;
      }
      span {
        font-size: 13px;
        color: #333333;
        margin-top: 5px;
      }
    }
  }

  //搜索框
  .search {
    width: 100%;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    .mint-search {
      width: 92%;
      height: 30px;
      margin-left: 4%;
      background-color: rgba(242, 242, 242, 1);
      .mint-searchbar {
        width: 100%;
        height: 100%;
        padding: 0;
        .mint-searchbar-inner, .mint-searchbar-core {
          background-color: rgba(242, 242, 242, 1);
        }
        .mintui-search {
          font-size: 14px;

        }
        .mint-searchbar-core {
          font-size: 14px;
        }
        input::-webkit-input-placeholder {
          color: rgba(156, 156, 157, 1);
        }
      }
    }
  }

  .mint-msgbox-wrapper {
    position: absolute;
    z-index: 2001;
    .mint-msgbox {
      position: fixed;
      width: 78%;
      height: 100%;
      left: 61%;
      margin-top: 50px;
      border-radius: 0;
      border-top: 1px solid rgba(242, 242, 242, 1);
      .mint-msgbox-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 15px 0;
        img {
          width: 50px;
          height: 50px;
          margin-left: 16px;
        }
        p {
          width: 155px;
          height: 24px;
          font-size: 17px;
          font-family: PingFangSC-Regular;
          color: rgba(51, 51, 51, 1);
          line-height: 24px;
          margin-left: 12px;
        }
      }
      .mint-msgbox-content {
        width: 100%;
        height: 100%;
        position: absolute;
        overflow-y: scroll;
        padding: 0;
        border-top: 1px solid rgba(242, 242, 242, 1);
        .carlines {
          width: 100%;
          height: 52px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(242, 242, 242, 1);
          p {
            width: 230px;
            height: 24px;
            font-size: 17px;
            font-family: PingFangSC-Regular;
            color: rgba(51, 51, 51, 1);
            line-height: 24px;
            margin-left: 16px;
          }
        }
      }
    }
  }

  .v-modal {
    position: fixed;
    left: 0;
    top: 50px;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }
</style>
<style type="">
  .mint-cell-left {
    height: 28px;
    width: 28px;
    left: 11%;
    top: 10px;
    background-color: #ebebeb;
  }

  .mint-cell-left img {
    width: 100%;
    height: 100%;
  }

  .mint-cell-text {
    padding-left: 40px;
  }

  .mint-indexlist-navitem {
    color: rgba(16, 142, 233, 1);
  }

  .mint-indexlist-nav {
    position: fixed;
    top: 75px;
    border-left: 0px;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0);
  }

  ul.mint-indexlist-content {
    margin-right: 0px !important;
  }

  @media screen and (max-width: 360px) {
    .mint-indexlist-navitem {
      padding: 1px 6px;
      font-size: 11px;
    }

    .mint-indexlist-nav {
      top: 60px;
    }
  }
</style>
