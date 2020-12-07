<template>
  <div class="billing-order">
    <div class="billing-order-card billing-order-user align-center">
      <span>
        <img class="billing-order-img" src="./../../assets/name1.png" alt />
        {{ msg.name }}
      </span>
      <span @click="changeCar" class="billing-order-user-info">
        {{ msg.number }}
        <img src="./../../assets/change.png" alt />
        <b>切换</b>
      </span>
    </div>

    <div class="billing-order-card billing-order-project">
      <div class="align-center">
        <span>
          <img
            class="billing-order-img"
            src="./../../assets/setting-blue.png"
            alt
          />
          <span class="mark">*</span>本次预约项目
        </span>
        <button @click="chooseProject">项目选择</button>
      </div>
      <span
        class="billing-order-project-item"
        v-for="(item, index) in consumerProjectInfos"
        :key="index"
        >{{ item.projectName }}</span
      >
      <!--<span class="billing-order-project-count">合计费用： {{trueOrderPrice}}元</span>-->
    </div>

    <div class="billing-order-card billing-order-position">
      <div class="align-center">
        <span>
          <img
            class="billing-order-img"
            src="./../../assets/position-blue.png"
            alt
          />
          <span class="mark">*</span>车辆所在位置
        </span>
        <span class="billing-order-position-button" @click="addLocation"
          >快速定位</span
        >
      </div>

      <textarea
        v-model="consumerOrder.parkingLocation"
        class="billing-order-position-input"
        placeholder="请尽可能准确输入位置，方便技师取车！"
        cols="40"
        rows="3"
      ></textarea>
    </div>
    <div class="billing-order-card billing-order-photo">
      <div class="align-center">
        <span>
          <img
            class="billing-order-img"
            src="./../../assets/img.png"
            alt
          />上传爱车照片
        </span>
      </div>
      <!--<cube-upload v-show="!isImgShow"-->
      <cube-upload
        ref="upload"
        :action="action"
        :simultaneous-uploads="1"
        :max="3"
        @file-removed="fileRemoved"
        @file-success="fileSuccess"
        :process-file="processFile"
        @files-added="filesAdded"
        @file-submitted="fileSubmitted"
      ></cube-upload>
      <!--<img v-show="isImgShow" class="billing-order-car-img" :src="carImageUrl" alt="">-->
      <!--<img class="billing-order-photo-add" src="./../../assets/add-img.png" alt="">-->
      <!--<img v-show="isImgShow" class="del-img" src="./../../assets/del-img.png" alt="" @click="delImg">-->
      <div class="tip">您可以上传能显示车辆位置的照片(最多3张)</div>
    </div>
    <div class="billing-order-card billing-order-position">
      <div class="align-center">
        <span>备注信息</span>
      </div>

      <textarea
        v-model="consumerOrder.comment"
        class="billing-order-position-input"
        placeholder="您可填写期望还车位置信息！"
        cols="38"
        rows="2"
      ></textarea>
    </div>
    <div class="align-center billing-order-protocol color-blue">
      <span @click="changeAgreeState">
        <img
          class="billing-order-img"
          :src="[isAgree ? './static/checked.png' : './static/no-checked.png']"
          alt
        />
        <span class="mark">*</span>同意
      </span>
      <span class="open-protocol" @click="openProtocol"
        >《小易智能柜使用协议》</span
      >
    </div>

    <button class="submit-btn" @click="submit">提交</button>

    <!--模态框-->
    <div class="dialog-layer" v-show="isDialogShow">
      <div class="dialog-box billing-order-dialog">
        <div class="billing-order-dialog-header">
          <span class="store-color">{{ storeName }}</span>
          <img @click="closeDialog" src="./../../assets/close-black.png" alt />
        </div>
        <div class="billing-order-dialog-content">
          <!-- 服务商 -->
          <div
            class="billing-order-dialog-content-list"
            :class="[{ active: !item.staffReady }]"
            v-for="(item, serviceindex) in service"
            :key="serviceindex"
          >
            <div class="service">
              <span>{{ item.name }}</span>
            </div>
            <!-- {active:!item.staffReady} -->
            <div
              @click="selectProject(serviceindex, projectItem)"
              :class="[
                projectItem.comment === '***新用户专享***'
                  ? 'billing-order-dialog-item'
                  : 'billing-order-dialog-item',
              ]"
              v-for="(projectItem, index) in item.projects"
              :key="index"
            >
              <img
                :src="[
                  checkedId.indexOf(projectItem.id) !== -1
                    ? './static/check-yellow.png'
                    : './static/check-no.png',
                ]"
                alt
              />
              <span>{{ projectItem.name }}</span>
              <span class="billing-order-dialog-item-price"
                >{{ projectItem.standard === 0 ? "运费：" : "" }}￥{{
                  projectItem.price
                }}</span
              >
              <!-- <div class="member-price" v-show="item.memberPrice||item.memberPrice===0"><span>会员价</span><span>￥{{item.memberPrice}}</span></div> -->
              <div
                :class="[
                  projectItem.comment === '***新用户专享***'
                    ? 'is-new'
                    : 'is-old',
                ]"
              >
                {{ projectItem.comment }}
              </div>
            </div>
          </div>
        </div>
        <div class="billing-order-dialog-footer">
          <!--<span><b>￥</b>{{orderPrice}}</span>-->
          <!--<span class="billing-order-footer-project">普洗</span>-->
          <button @click="selectProjectBtn">确认</button>
        </div>
      </div>
    </div>

    <!--使用协议-->
    <div class="dialog-layer" v-show="isProtocolShow">
      <div class="dialog-box billing-order-dialog">
        <div class="billing-order-dialog-header">
          <span>小易智能柜使用协议</span>
          <img
            @click="closeProtocol"
            src="./../../assets/close-black.png"
            alt
          />
        </div>
        <div class="billing-order-dialog-content">
          "欢迎您使用小易智能柜（以下简称“小易”）软件及服务！
          <br />
          <br />1.重要须知
          <br />
          <br />1.1为更好使用服务，您应当认真阅读并遵守《小易智能柜使用协议》（以下简称“本协议”），请您务必谨慎阅读、充分理解各条款内容。
          <br />1.2除非您已阅读并接受本协议所有条款，否则您无权使用本软件及相关服务。您的使用、获取微信账号信息、登录等行为即视为您已阅读并同意上述协议的约束。
          <br />1.3如果您未满18周岁，请您务必在您的监护人仔细阅读本协议并同意的前提下使用我们的产品或服务或向我们提供信息；如您违反法律法规或本协议内容使用小易产品或服务，造成的一切后果由您及您的监护人承担。
          <br />1.4小易有权对本协议进行修订，且无须单独事先通知您。本协议一旦发生变动，小易将会在小易产品或服务和/或相关网站上公布修订后的本协议。您理解并同意，修订后的本协议具有溯及力，如果您在本协议修订版本公布后继续使用小易产品或服务的，即视为您同意修订后的本协议。
          <br />
          <br />2.个人信息及安全
          <br />
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了能够向您提供服务、客户帮助，并向您和其他用户提供更具针对性的、更好的服务，我们向您收集有关您本人以及您使用服务情况的各类信息，包括个人信息和非个人信息。使用服务，代表您同意允许我们收集、展示、分享、储存及使用这些信息。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“个人信息”是指涉及您个人身份或个人隐私的信息，比如，您的真实姓名、手机号码、手机设备识别码、IP地址。“个人隐私信息”是指您的密码以及依法禁止我们披露的其他信息。“非个人信息”是指您的使用历史记录（如您的账户状态）以及个人信息范围外的其他普通信息。
          <br />
          <br />2.1保护您的个人信息是小易智能柜的一项基本原则，小易将会采取合理的措施保护您的个人信息。除法律法规规定的情形或事先获得您的同意外，小易未经用户许可不会向第三方公开、透露用户的个人信息。小易会尽力采取适合的安全保护措施，保护您个人信息的安全可控。
          <br />2.2未经您的同意，小易不会向小易以外的任何公司、组织和个人披露您的个人信息，法律法规另有规定的除外。
          <br />2.3小易提醒您注意，切勿在小易服务中公布或向不信任第三方披露自己的各类财产账户、银行卡、信用卡、第三方支付账户及对应密码等重要资料，否则由此带来的任何损失由用户自行承担。
          <br />2.4您在使用小易产品及服务时，须自行承担如下来自小易不可控的风险内容，包括但不限于：
          <br />2.4.1由于不可抗拒因素可能引起的个人信息丢失、泄露等风险；
          <br />2.4.2用户使用过程中由于您将密码告知他人或与他人共享注册账号，由此导致的任何个人信息的泄露；
          <br />2.4.3本产品根据法律规定或相关政府、司法机关的要求提供您的个人信息。
          <br />
          <br />3.主权利义务条款
          <br />
          <br />3.1账号使用规范
          <br />3.1.1用户在使用本服务前需要同意获得微信授权，并通过手机号注册一个小易账号，一个手机号仅对应一个小易账号；
          <br />3.1.2用户有责任妥善保管注册账户信息及账户密码的安全，用户需要对注册账户以及密码下的行为承担法律责任。您同意在任何情况下不向他人透露账户及密码信息。当在您怀疑他人在使用您的账号时，您应立即通知小易公司；
          <br />3.1.3用户注册小易账号后如果长期不使用该帐号，小易有权回收该账号及其他所有信息，以免造成资源浪费，由此带来的任何损失均由用户自行承担；
          <br />3.1.4用户不得冒充他人、不得利用他人的名义传播任何信息，否则本产品有权立即停止提供服务，收回小易账号并由用户独自承担由此产生的一切法律责任。
          <br />3.2用户使用条款
          <br />3.2.1为了给用户提供有效的服务，小易会利用您终端设备的处理器和宽带等资源，在使用小易的过程中可能会产生数据流量的费用，您需自行向运营商了解相关资费信息，并自行承担相关费用；
          <br />3.2.2小易智能柜账号的所有权归本产品所有，用户完成申请注册手续后，仅获得小易账号的使用权，且该使用权仅属于初始申请注册人。同时，初始申请注册人不得赠与、转让或售卖小易账号或者以其他方式许可非初始申请注册人使用小易账号。非初始申请注册人不得通过受赠、继承、受让或者其他任何方式使用小易账号。
          <br />3.2.3用户不得在使用本服务过程中，制作、复制、发布、传播、存储违反国家法律法规禁止的内容：
          <br />1）散布谣言，扰乱社会秩序，破坏社会稳定的；
          <br />2）散步淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
          <br />3）侮辱或者诽谤他人，侵害他人合法权益的；
          <br />4）含有法律、行政法规禁止的其他内容。
          <br />3.2.4用户在使用本产品服务时，本产品可能会调用第三方系统或者通过第三方支持用户的使用或访问，使用或访问的结果由该第三方提供，小易不保证通过第三方提供服务及内容的安全性、准确性、有效性及其他不确定的风险，由此若引发的任何争议及损害，与小易无关，小易不承担任何责任。
          <br />3.3产品使用规范
          <br />3.3.1除非法律允许或小易书面许可，您使用本产品服务过程中不得从事下列行为：
          <br />1）对本软件产品进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件产品的源代码；
          <br />2）
          对本软件产品或者本软件产品运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件产品运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非小易经授权的第三方工具/服务接入本软件和相关系统；
          <br />3）自行或者授权他人、第三方软件对本软件产品及其组件、模块、数据进行干扰。
          <br />3.3.2您理解并同意，基于用户体验、相关服务平台运营安全、平台规则要求及健康发展等综合因素，小易有权选择提供服务的对象，有权决定功能设置，有权决定功能开发、数据接口和相关数据披露的对象和范围。针对以下情况，有权视具体情况中止或终止提供本服务，包括但不限于：
          <br />1）违反法律法规或本协议规定的； <br />2）影响服务体验的；
          <br />3）存在安全隐患的；
          <br />4）违背小易及其服务平台运营原则，或不符合小易其他管理要求的。
          <br />3.4对自己的行为负责
          <br />您充分了解并同意，您应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。小易无法且不会对因前述风险而导致的任何损失或损害承担责任。
          <br />3.5违约处理
          <br />3.5.1一旦小易发现或收到他人举报或投诉用户违反本协议约定的，小易有权不经过通知随时对相关内容进行删除、屏蔽，并视行为情节对违规账号处以包括但不限于警告、限制或禁止使用部分或全部功能、账号封禁直至注销的处罚，并公告处理结果。
          <br />3.5.2您理解并同意，小易有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。
          <br />3.5.3您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；小易因此遭受损失的，您也应当一并赔偿。
          <br />
          <br />4.终端安全责任
          <br />
          <br />4.1您理解并同意，本软件同大多数互联网软件一样，可能会受多种因素影响，包括但不限于用户原因、网络服务质量、社会环境等；也可能会受各种安全问题的侵扰，包括但不限于他人非法利用用户资料，进行现实中的骚扰；用户下载安装的其他软件或访问的其他网站中可能含有病毒、木马程序或其他恶意程序，威胁您的终端设备信息和数据安全，继而影响本软件的正常使用等。因此，您应加强信息安全及个人信息的保护意识，注意密码保护，以免遭受损失。
          <br />4.2您不得制作、发布、使用、传播用于窃取小易账号及他人个人信息、财产的恶意程序。
          <br />4.3维护软件安全与正常使用是小易和您的共同责任，小易将按照行业标准合理审慎地采取必要技术措施保护您的终端设备信息和数据安全，但是您承认和同意小易并不能就此提供完全保证。
          <br />
          <br />5.其他
          <br />
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您使用本软件产品即视为您已阅读并同意受本协议的约束。小易有权在必要时修改本协议条款。您可以在本软件的最新版本中查阅相关协议条款。本协议条款变更后，如果您继续使用本软件，即视为您已接受修改后的协议。如果您不接受修改后的协议，应当停止使用本软件。"
        </div>
        <div class="billing-order-dialog-footer">
          <button @click="changeAgreeState">同意</button>
        </div>
      </div>
    </div>

    <open-door
      ref="openDoor"
      :ark-info-state="arkInfoState"
      v-show="isOpenDoorShow"
    ></open-door>
    <success
      ref="successArk"
      :ark-info-state="arkInfoState"
      v-show="isSuccessShow"
    ></success>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import compress from "@/components/compress";
export default {
  name: "billingOrder",
  data() {
    return {
      msg: {
        name: "",
        number: "",
      },
      isProtocolShow: false,
      arkInfoState: "billingOrder",
      consumerOrder: {
        carId: "",
        clientId: "",
        parkingLocation: "",
        //新增备注信息
        comment: "",
      },
      consumerProjectInfos: [],
      clientOrderImgs: [],
      clientOrderImg: {
        createTime: "",
        url: "",
        id: "",
      },
      service: [],
      projects: [],
      sortprojects: [],
      wxUserInfo: {},
      cars: [],
      isDialogShow: false,
      storeName: "",
      isOpenDoorShow: false,
      isSuccessShow: false,
      carImageUrl: "",
      isImgShow: false,
      isAgree: false,
      consumerProjectList: [],
      checkedId: [],
      idList: [],
      toastTxt: "",
      submitOrder: false,
      arkSn: "",
      newUser: "",
      //图片上传action
      action: {
        target: "https://www.freelycar.com/api/upload/clientOrderImg",
        // target: "http://192.168.0.168/api/upload/clientOrderImg",
        prop: "base64Value",
      },
      timer: null,
    };
  },
  methods: {
    //图片压缩
    processFile(file, next) {
      compress(
        file,
        {
          compress: {
            width: 1600,
            height: 1600,
            quality: 0.8,
          },
        },
        next
      );
    },
    fileSubmitted(file) {
      file.base64Value = file.file.base64;
    },
    //图片过滤
    filesAdded(files) {
      let hasIgnore = false;
      const maxSize = 10 * 1024 * 1024; // 10M
      for (let k in files) {
        const file = files[k];
        if (file.size > maxSize) {
          file.ignore = true;
          hasIgnore = true;
        }
      }
      hasIgnore &&
        this.$createToast({
          type: "warn",
          time: 1000,
          txt: "上传的图片不能超过10M!",
        }).show();
    },
    // 获取用户信息
    getUserInfo() {
      this.$get("/wechat/wxuser/getCurrentPersonalInfo", {
        id: localStorage.getItem("id"),
      }).then((res) => {
        this.wxUserInfo = res.wxUserInfo;
        this.cars = res.cars;
        this.msg.name = res.wxUserInfo.trueName;
        // this.getStoreProject(res.newUser)
        this.newUser = res.newUser;
        if (this.$route.query.licensePlate) {
          this.msg.number = this.$route.query.licensePlate;
          this.consumerOrder.carId = this.$route.query.id;
        } else {
          if (res.cars.length === 0) {
            this.$createDialog({
              type: "alert",
              title: "",
              content: "请先添加车辆",
              icon: "cubeic-alert",
              onConfirm: (e, promptValue) => {
                this.$router.push({
                  path: "/addCar",
                  query: { backTo: "/billingOrder" },
                });
              },
            }).show();
          } else {
            this.msg.number = res.cars[0].licensePlate;
            this.consumerOrder.carId = res.cars[0].id;
          }
        }
      });
    },

    // 打开使用协议
    openProtocol() {
      this.isProtocolShow = true;
    },

    // 获取网点服务列表
    getStoreProject(newUser) {
      this.$get("/wechat/ark/getRspProjects", {
        storeId: localStorage.getItem("storeId"),
        newUser: newUser,
      }).then((res) => {
        console.log(res);
        this.projects = res;
        this.service = res;
        //按照sort排序
        console.log(this.projects);
        this.projects = this.sortByKey(this.projects, "sort");
      });
    },
    //获取的项目数据按照某一值排序
    sortByKey(array, key) {
      //(数组、排序的列)
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },

    // 上传图片
    fileSuccess(e) {
      console.log("----");
      console.log(e);
      let client = {};
      client.url = e.response.data.url;
      client.id = e.response.data.id;
      this.clientOrderImgs.push(client);
      console.log(this.clientOrderImgs);
      // this.isImgShow = true
    },

    // 删除图片
    fileRemoved(e) {
      console.log(e);
      for (var i in this.clientOrderImgs) {
        if (this.clientOrderImgs[i].id == e.response.data.id) {
          this.clientOrderImgs.splice(i, 1);
        }
      }
      console.log(this.clientOrderImgs);
    },

    // 选择项目按钮
    chooseProject() {
      this.getStoreProject(this.newUser);
      this.isDialogShow = true;
    },

    // 关闭模态框
    closeDialog() {
      this.isDialogShow = false;
    },

    // 关闭使用协议模态框
    closeProtocol() {
      this.isProtocolShow = false;
    },

    // 选择项目
    selectProject(serviceindex, item) {
      // 检测项目能不能选
      console.log(this.projects[serviceindex].staffReady);
      if (this.projects[serviceindex].staffReady) {
        this.consumerProjectList = [
          {
            price: item.price,
            projectId: item.id,
            projectName: item.name,
            memberPrice: item.memberPrice,
          },
        ];
        this.checkedId = [item.id];
        /**   多选功能暂时不用
          // 购物车consumerProjectList。全部列表projects
          // 先看购物车里有没有点击的这个，
          let haveThisProject = false
          this.consumerProjectList.map(item=>{
            if(item.projectId===this.projects[index].id){
              haveThisProject=true
            }
          })
          //有就去掉，没有就加进去
          if(haveThisProject){
            let newList = this.consumerProjectList.filter(item=>item.projectId!==this.projects[index].id)
            let newIdList = this.checkedId.filter(item=>item!==this.projects[index].id)
            this.consumerProjectList=newList
            this.checkedId=newIdList
          }else {
            this.consumerProjectList.push({
              price:this.projects[index].price,
              projectId: this.projects[index].id,
              projectName: this.projects[index].name,
              memberPrice: this.projects[index].memberPrice,
            })
            this.checkedId.push(this.projects[index].id)
          }
           **/
      } else {
        alert("当前项目暂时没有技师服务");
      }
    },

    // 确认按钮
    selectProjectBtn() {
      // 赋值给正主consumerProjectInfos
      this.consumerProjectInfos = this.consumerProjectList;
      console.log(this.consumerProjectInfos);
      this.idList = this.checkedId;
      this.closeDialog();
    },

    // 同意小易智能柜使用协议
    changeAgreeState() {
      this.isAgree = !this.isAgree;
      this.isProtocolShow = false;
    },

    // 切换车
    changeCar() {
      this.$router.push({ path: "/changeCar" });
    },

    // 微信注入权限
    wxConfig() {
      this.$get("/wechat/config/getJSSDKConfig", {
        targetUrl: location.href.split("?")[0],
      }).then((res) => {
        this.configInfo = res;
        wx.config({
          debug: false,
          appId: this.configInfo.appId,
          timestamp: this.configInfo.timestamp,
          nonceStr: this.configInfo.nonceStr,
          signature: this.configInfo.signature,
          jsApiList: ["checkJsApi", "openLocation", "getLocation"],
        });
        // 需要检测的JS接口列表
        wx.checkJsApi({
          jsApiList: ["getLocation"],
          success: function (res) {
            console.log(res);
          },
          fail: function (error) {
            console.log(error);
          },
        });
        wx.ready(function () {
          console.log("微信接口成功");
        });
        wx.error(function (res) {
          console.log(res);
        });
      });
    },

    //       快速定位
    addLocation() {
      this.$get("/wechat/ark/getCurrentArkLocation", {
        arkSn: localStorage.getItem("arkSn"),
      }).then((res) => {
        this.consumerOrder.parkingLocation = res;
      });
    },
    // 删除照片

    // 提交
    submit() {
      if (!this.consumerOrder.carId) {
        this.toastTxt = "请选择车辆";
        this.showTxt();
      } else if (this.consumerProjectInfos.length <= 0) {
        this.toastTxt = "请选择项目";
        this.showTxt();
      } else if (!this.consumerOrder.parkingLocation) {
        this.toastTxt = "请填写汽车位置";
        this.showTxt();
      } else if (!this.isAgree) {
        this.toastTxt = "请勾选同意使用协议";
        this.showTxt();
      } else {
        // 判断刚刚有没有点过提交
        if (this.submitOrder) {
          alert("请勿重复提交");
        } else {
          this.submitOrder = true;
          this.submitHttp();
        }
      }
    },

    // 显示提示信息
    showTxt() {
      this.toast = this.$createToast({
        txt: this.toastTxt,
        type: "txt",
      });
      this.toast.show();
    },

    // 提交下单的接口（用柜子号获取门id）
    submitHttp() {
      this.$get("/wechat/ark/getEmptyDoor", {
        arkSn: localStorage.getItem("arkSn"),
      })
        .then((res) => {
          this.arkInfoState = "billingOrder";
          this.$refs.openDoor.changeTxt("billingOrder", res.doorSn);
          this.isOpenDoorShow = true;
          this.submitBilling(res.id);
        })
        .catch((err) => {
          alert("下单失败，请勿放入钥匙");
          this.submitOrder = false;
          this.isOpenDoorShow = false;
        });
    },

    // 提交下单的接口（下单）
    submitBilling(id) {
      this.$post("/wechat/ark/orderService", {
        consumerOrder: this.consumerOrder,
        consumerProjectInfos: this.consumerProjectInfos,
        doorId: id,
        clientOrderImgs: this.clientOrderImgs,
      })
        .then((res) => {
          console.log(res);
          const resid = res;
          this.timer = setInterval(() => {
            this.$get("/wechat/order/getDoorState", {
                orderId: resid,
              })
              .then((doorres) => {
                // console.log(res)
                if (doorres.isBuffer) {
                  this.arkInfoState = "billingOrder";
                  this.$refs.openDoor.changeTxt("billingOrder", doorres.doorSn);
                  this.isOpenDoorShow = true;
                } else {
                  clearInterval(this.timer);
                  this.$refs.successArk.changeTxt("billingOrder");
                  this.isSuccessShow = true;
                  setTimeout(() => {
                    this.$router.push({ path: "/myOrder" });
                  }, 1000);
                }
              });
          }, 3000);
        })
        .catch((err) => {
          if (err === "智能柜已满") {
            wx.closeWindow();
          } else {
            alert("下单失败，请勿放入钥匙");
            this.submitOrder = false;
            this.isOpenDoorShow = false;
          }
        });
    },
    //判断存储的网点是否是当前网点
    getUserArkInfo() {
      this.$get("/wechat/ark/getArkInfo", {
        arkSn: this.arkSn,
      }).then((res) => {
        this.$post("/wechat/wxuser/chooseDefaultStore", {
          id: localStorage.getItem("id"),
          defaultStoreId: res.storeId,
        }).then((res) => {
          if (res) {
            localStorage.setItem("storeName", res.defaultStoreName);
            localStorage.setItem("storeId", res.defaultStoreId);
            localStorage.setItem("clientId", res.defaultClientId);
          }
          this.storeName = localStorage.getItem("storeName");
        });
      });
    },
  },
  mounted: function () {
    console.log(window.location.href);
    if (this.$route.query.arkSn) {
      this.arkSn = this.$route.query.arkSn;
      localStorage.setItem("arkSn", this.$route.query.arkSn);
    } else {
      this.arkSn = localStorage.getItem("arkSn");
    }
    this.wxConfig();
    this.getUserArkInfo();
    this.consumerOrder.clientId = localStorage.getItem("clientId");
    this.getUserInfo();
  },
  // mounted: function () {
  //   this.storeName=localStorage.getItem('storeName')
  //   this.consumerOrder.clientId=localStorage.getItem('clientId')
  //   this.getUserInfo()
  //   this.wxConfig()
  // },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  computed: {
    orderPrice: function () {
      let price = 0;
      this.consumerProjectList.map((item) => {
        price = price + item.price;
      });
      return price;
    },
    trueOrderPrice: function () {
      let price = 0;
      this.consumerProjectInfos.map((item) => {
        price = price + item.price;
      });
      return price;
    },
    // //获取按照sort排序后的数组
    // sortprojects:function(){
    //   return sortByKey(this.projects,'price');
    // }
  },
};
</script>

<style scoped lang="stylus">
/* 高度宽度 */
h(n) {
  n * 0.13vw;
}

w(n) {
  ((((((n / 7.5vw))))));
}

.open-protocol {
  text-decoration: underline;
}

.member-price {
  color: red;
  display: flex;
  justify-content: space-between;
}

.submit-btn {
  height: h(84);
  width: w(579);
  border-radius: w(40);
  border: transparent;
  color: white;
  font-size: w(32);
  background: $bt-blue;
  position: relative;
  transform: translate(-50%, 0);
  left: 50%;
  margin: h(100) 0;
}

.billing-order-car-img {
  height: w(125);
  width: w(125);
  margin-left: w(50);
}

.billing-order {
  min-height: 100vh;
  width: 100vw;
  background: white;
}

.billing-order-card {
  margin-left: l = w(42);
  width: 100vw -l;
  border-bottom: $border-gray;
  padding-right: w(43);
  box-sizing: border-box;
  position: relative;
}

.billing-order-img {
  height: w(30);
  width: w(30);
  margin-right: w(25);
}

.align-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.align-center span {
  display: flex;
  align-items: center;
}

.billing-order-user {
  height: h(103);
}

.billing-order-user-info img {
  height: w(18);
  width: w(18);
  margin: 0 w(7) 0 w(28);
}

.billing-order-user-info b {
  color: #2049BF;
}

.billing-order-project {
  min-height: h(210);
  position: relative;
}

.billing-order-project button {
  height: h(44);
  width: w(160);
  color: white;
  background: #2049BF;
  border-radius: h(30);
  border: transparent;
}

.billing-order-project div {
  height: h(103);
}

.billing-order-project-item {
  height: h(55);
  border: 1px solid #2049BF;
  color: #2049BF;
  border-radius: h(30);
  padding: h(12) w(40);
  box-sizing: border-box;
  font-size: w(24);
  margin: w(24);
  display: inline-block;
}

.billing-order-project-count {
  color: #B3B3B3;
  font-size: w(22);
  position: absolute;
  right: w(50);
  bottom: h(20);
}

.store-color {
  color: #2049bf;
}

.billing-order-position-button {
  font-size: w(26);
  color: #FFBD03;
}

.billing-order-position-input {
  border: transparent;
  color: #AEAEAE;
}

.billing-order-position div {
  height: h(103);
}

.billing-order-photo {
  height: h(300);
  position: relative;
}

.billing-order-photo div {
  height: h(103);
}

.billing-order-photo .tip {
  height: h(25);
  font-size: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #aeaeae;
}

.billing-order-photo-add {
  height: w(125);
  width: w(125);
  margin-left: w(50);
}

.billing-order-protocol {
  height: h(103);
  margin-left: w(42);
  position: absolute;
}

.color-blue {
  color: #2049BF;
}

.del-img {
  height: w(29);
  width: w(29);
  position: absolute;
  top: h(90);
  left: w(158);
}

.billing-order-dialog {
  height: h(794);
  width: w(570);
}

.billing-order-dialog-header {
  height: h(90);
  border-bottom: $border-gray;
  padding: 0 w(30);
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    height: w(25);
    width: w(25);
  }
}

.is-new {
  color: red;
}

.is-old {
  color: #AFAEAE;
}

.billing-order-dialog-content {
  height: h(594);
  // margin-left w(30)
  overflow: scroll;

  .billing-order-dialog-item {
    padding: h(30) w(30) h(30) 0;
    border-bottom: $border-gray;

    div {
      width: w(450);
      margin-left: w(70);
      margin-top: h(20);
      font-size: w(25);
    }
  }

  .billing-order-dialog-item-price {
    float: right;
    color: #FFBD03;
  }

  img {
    height: w(30);
    width: w(30);
    margin: 0 0 0 w(30);
  }
}

.billing-order-dialog-footer {
  height: h(110);
  border-top: $border-gray;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 w(30);
  box-sizing: border-box;

  b {
    color: $bt-yellow;
    font-size: w(20);
  }

  span {
    color: $bt-yellow;
    font-size: w(40);
    line-height: h(80);
  }

  .billing-order-footer-project {
    font-size: w(25);
    width: w(300);
    color: $bt-gray;
    position: absolute;
    top: h(40);
    left: w(30);
  }

  button {
    border: 1px solid #2049BF;
    background: white;
    padding: h(5) w(40);
    border-radius: w(30);
    color: #2049BF;
    margin: h(30) 0;
    float: right;
  }
}

.mark {
  padding-top: 4px;
  color: red;
}

.active {
  background: #DCDCDC;
  opacity: 0.7;
}

.mark-text {
  font-size: w(24);
  color: red;
}

.service {
  font-size: w(32);
  padding-left: 4vw;
  height: h(60);
  border-bottom: 1px solid #ebebeb;
  line-height: h(60);
}
</style>
