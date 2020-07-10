<template>
  <div class="add-car">
    <div class="add-car-item">
      <span>车牌号</span>
      <input type="text" placeholder="请输入车牌号" v-model="licensePlate" @click="ispopup" readonly="readonly">
    </div>

    <!-- 车牌号城市缩写键盘 -->
    <mt-popup
      v-model="showpopup"
      position="bottom"
      popup-transition="popup-fade">
      <div class="car-plate">
        <div class="car-plate-container">
          <mt-button class='plate-number' type="default" v-for="(item,index) in ChineseList" :key="index" @click="saveplate">{{item.name}}</mt-button>
        </div>
      </div>
    </mt-popup>

    <!-- 数字和字母键盘 -->
    <mt-popup
      v-model="shownumber"
      position="bottom"
      popup-transition="popup-fade">
      <div class="car-plate">
        <div class="car-plate-container-new">
          <mt-button class='plate-number-new' type="default" v-for="(item,index) in English_Number" :key="index" @click="savenumber">{{item.name}}</mt-button>
          <mt-button class='plate-number-new' type="default" @click="deletenumber">←</mt-button>
          <mt-button class='plate-number-confirm' type="default" @click="confirm">确认</mt-button>
        </div>
      </div>
    </mt-popup>

    <div class="add-car-item" @click="chooseColor">
      <span>车辆颜色</span>
      <span class="color-blue">{{color?color:'选择颜色'}}<img src="./../../assets/more.png" alt=""></span>
    </div>

    <div @click="showDrawer(licensePlate,clientId,storeId)" class="add-car-item">
      <span>品牌车系</span>
      <span class="color-blue">{{chooseBrand.carline?chooseBrand.carline:'选择品牌'}}<img src="./../../assets/more.png" alt=""></span>
    </div>

    <div class="add-car-item">
      <span>车辆照片</span>
      <!--<input class="add-car-upload" name="file" type="file"-->
             <!--accept="image/png,image/gif,image/jpeg" @change="update($event)"/>-->
      <!--<button>上传</button>-->
    </div>

    <cube-upload class="add-car-upload"
      ref="upload"
      action="https://www.freelycar.com/api/upload/carImg"
      :auto="true"
      :simultaneous-uploads="1" :max="1" @file-removed="fileRemoved"
      @file-success="fileSuccess"></cube-upload>

    <!--<img v-show="isImgShow" class="add-car-img" :src="carImageUrl" alt="">-->

    <button class="big-blue-btn" @click="addCar">保存</button>

  </div>
</template>

<script>
  export default {
    name: 'addCar',
    data() {
      return {
        msg: '',
        carImageUrl:'',
        isImgShow:false,
        licensePlate:'',
        clientId:'',
        storeId:'',
        chooseBrand:{},
        color:'',
        backTo:'',
        showpopup:false,//控制车牌号城市键盘
        shownumber:false,//数字字母键盘
        colorList:[
          {text:'黑色',value:'黑色'},
          {text:'白色',value:'白色'},
          {text:'红色',value:'红色'},
          {text:'蓝色',value:'蓝色'},
          {text:'银灰色',value:'银灰色'},
          {text:'其他',value:'其他'}],
          //车牌号键盘数据
          ChineseList:[
                    {name:'京',id:1},
                    {name:'津',id:2},
                    {name:'冀',id:3},
                    {name:'晋',id:4},
                    {name:'蒙',id:5},
                    {name:'辽',id:6},
                    {name:'吉',id:7},
                    {name:'黑',id:8},
                    {name:'沪',id:9},
                    {name:'苏',id:10},
                    {name:'浙',id:11},
                    {name:'皖',id:12},
                    {name:'闽',id:13},
                    {name:'赣',id:14},
                    {name:'鲁',id:15},
                    {name:'豫',id:16},
                    {name:'鄂',id:17},
                    {name:'湘',id:18},
                    {name:'粤',id:19},
                    {name:'桂',id:20},
                    {name:'琼',id:21},
                    {name:'渝',id:22},
                    {name:'川',id:23},
                    {name:'贵',id:24},
                    {name:'云',id:25},
                    {name:'藏',id:26},
                    {name:'陕',id:27},
                    {name:'甘',id:28},
                    {name:'青',id:29},
                    {name:'宁',id:30},
                    {name:'新',id:31},
                ],
                English_Number:[
                    {name:'1',id:28},
                    {name:'2',id:29},
                    {name:'3',id:30},
                    {name:'4',id:31},
                    {name:'5',id:32},
                    {name:'6',id:33},
                    {name:'7',id:34},
                    {name:'8',id:35},
                    {name:'9',id:36},
                    {name:'0',id:37},
                    {name:'Q',id:38},
                    {name:'W',id:39},
                    {name:'E',id:40},
                    {name:'R',id:41},
                    {name:'T',id:42},
                    {name:'Y',id:43},
                    {name:'U',id:44},
                    {name:'I',id:45},
                    {name:'O',id:46},
                    {name:'P',id:47},
                    {name:'A',id:48},
                    {name:'S',id:49},
                    {name:'D',id:50},
                    {name:'F',id:51},
                    {name:'G',id:52},
                    {name:'H',id:53},
                    {name:'J',id:54},
                    {name:'K',id:55},
                    {name:'L',id:56},
                    {name:'Z',id:57},
                    {name:'X',id:58},
                    {name:'C',id:59},
                    {name:'V',id:60},
                    {name:'B',id:61},
                    {name:'N',id:62},
                    {name:'M',id:63},
                ],
      }
    },
    methods: {
      // 选择车型车系
      showDrawer(licensePlate,clientId,storeId){
        this.$router.push( {path: '/choosebrand',
          query:{licensePlate,clientId,storeId,from:'/addCar',color:this.color,img:this.carImageUrl,backTo:this.backTo}})
      },
      //车牌号键盘
      ispopup(){
        this.showpopup = !this.showpopup
      },

      //车牌号城市缩写保存
      saveplate(event){
        let city = event.target.innerText
        this.licensePlate =city
        this.showpopup=false
        this.shownumber=true
      },
      //数字字母缩写
      savenumber(event){
        let number = event.target.innerText
        if(this.licensePlate.length < 7){
          this.licensePlate +=number
        }
        
      },
      // 退格
      deletenumber(){
        let arr = [...this.licensePlate]
        // console.log(arr)
        arr.pop()
        this.licensePlate =arr.join('')
      },
      //确认
      confirm(){
        this.shownumber=false
      },

      // 选颜色
      chooseColor(){
        this.picker = this.$createPicker({
          title: '请选择车辆颜色',
          data: [this.colorList],
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
        this.picker.show()
      },

      // 选颜色确认按钮
      selectHandle(selectedVal, selectedIndex, selectedText) {
        this.color=selectedVal[0]
      },

      //上传按钮
      fileSuccess(e){
        this.carImageUrl = e.response.data
        // this.isImgShow = true
      },

      // 删除图片
      fileRemoved(){
        this.carImageUrl = ''
      },

      // 提交
      addCar(){
        if(this.licensePlate&&this.chooseBrand.carline){
          this.$post('/wechat/client/addCar',{
            storeId:localStorage.getItem('storeId'),
            clientId:localStorage.getItem('clientId'),
            licensePlate:this.licensePlate,
            carBrand:this.chooseBrand.carline,
            carType:"",
            miles:"0",
            lastMiles:"0",
            color:this.color,
            carImageUrl:this.carImageUrl
          }).then(res=>{
            this.toast = this.$createToast({
              txt: '添加成功',
              type: 'txt'
            })
            this.toast.show()
            this.$router.push({path:this.backTo})
          })
        }else {
          this.toast = this.$createToast({
            txt: '请将车牌号和品牌车系填写完整',
            type: 'txt'
          })
          this.toast.show()
        }
      },

    },
    mounted: function () {
      this.clientId=localStorage.getItem('clientId')
      this.storeId=localStorage.getItem('storeId')
      this.chooseBrand.carbrandid = this.$route.query.carbrandid
      this.chooseBrand.carline = this.$route.query.carline
      this.chooseBrand.bgname = this.$route.query.bgname
      this.licensePlate = this.$route.query.licensePlate
      this.carImageUrl = this.$route.query.img
      this.color = this.$route.query.color
      this.backTo = this.$route.query.backTo
      if(this.carImageUrl){
        this.isImgShow=true
      }
      console.log(this.chooseBrand)
    }
  }
</script>

<style scoped lang="stylus">

  /*高度宽度*/
  h(n)
    n * 0.13vw

  w(n)
    n / 7.5vw

  .add-car
    height 100vh
    width 100vw
    background white

  .add-car-item
    height h(94)
    margin-left l=w(42)
    width 100vw-l
    border-top $border-gray
    display flex
    justify-content space-between
    align-items center
    padding-right w(42)
    box-sizing border-box

  .add-car-item img
    height h(25)
    width w(14)
    margin-left w(16)

  .add-car-item input
    width w(250)
    text-align right

  .add-car-item button
    height h(50)
    border 1px solid #2458CD
    border-radius h(50)
    width w(50)
    color #2458CD
    background white

  .color-blue
    color #2458CD

  .add-car-img
    height h(380)
    width w(667)
    position relative
    left w(40)

  .add-car-upload
    position absolute
    transform translateX(-50%)
    left 50%

  .big-blue-btn
    top h(250)

  .car-plate
    width 100%vw
    height h(350)
    position relative
  .car-plate-container
    padding 2vw
    text-align center
    position absolute
    left 0
    right 0 
    top 0 
    bottom 0
    margin auto
  .car-plate-container-new
    padding 3vw 2vw 0vw 2vw
    text-align center
    position absolute
    left 0
    right 0 
    top 0 
    bottom 0
    margin auto
  .plate-number
    width 8%
    height 15%
    padding 0 
    margin 2vw
    font-size 14px
    line-height 14px
  .plate-number-new
    width 6.5%
    height 15%
    padding 0 
    margin 1.6vw
    font-size 15px
    line-height 15px
  .plate-number-confirm
    height 15%
    padding 0 
    margin 1.5vw
    font-size 14px
    line-height 14px
</style>
