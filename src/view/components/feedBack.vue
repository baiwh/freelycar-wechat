// 反馈按钮
<template>
  <div>
    <div
      class="xuanfu"
      ref="moveDiv"
      :style="position"
      @mousedown="down"
      @touchstart="down"
      @mousemove="move"
      @touchmove="move"
      @mouseup="end"
      @touchend="end"
      @click="feedback"
    >
      <img src="./../../assets/feedback.png" alt="反馈按钮" />
    </div>
  </div>
</template>

<script>
export default {
  name: "feedBack",
  data() {
    return {
      position: {
        top: "28.25rem",
        left: "20.34375rem",
      },
      flags: false,
      positionTemp: { x: 0, y: 0 }, // 记录手指点击的位置
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
    };
  },
  methods: {
    down() {
      this.flags = true;
      var touch;
      // 该if判断是用touch还是mouse来移
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      //   console.log(event)
      //   console.log(touch)
      this.positionTemp.x = touch.clientX; // 手指点击后的位置
      this.positionTemp.y = touch.clientY;
      // console.log(this.$refs.moveDiv.offsetLeft)
      this.dx = this.$refs.moveDiv.offsetLeft; // 移动的div元素的位置
      this.dy = this.$refs.moveDiv.offsetTop;

      //   console.log("moveDiv.offsetLeft", this.$refs.moveDiv.offsetLeft)
      //   console.log("touch.clientX", touch.clientX)
    },
    move() {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.positionTemp.x; // 手指移动的变化量
        this.ny = touch.clientY - this.positionTemp.y;

        this.xPum = this.dx + this.nx; // 移动后，div元素的位置
        this.yPum = this.dy + this.ny;

        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;
        // console.log("window.clientWidth", windowWidth)
        // console.log(this.xPum)
        // console.log(" moveDiv.clientWidth",  moveDiv.clientWidth)

        if (
          this.xPum > 0 &&
          this.xPum + this.$refs.moveDiv.clientWidth < windowWidth
        ) {
          // movediv的左右边，未出界
          this.$refs.moveDiv.style.left = this.xPum + "px";
        } else if (this.xPum <= 0) {
          // 左边出界，则左边缘贴边
          this.$refs.moveDiv.style.left = 0 + "px";
        } else if (this.xPum + this.$refs.moveDiv.clientWidth >= windowWidth) {
          // 右边缘出界
          this.$refs.moveDiv.style.left =
            windowWidth - this.$refs.moveDiv.clientWidth + "px";
          // console.log("dx", windowWidth - moveDiv.clientWidth)
        }
        // 上下未出界
        if (
          this.yPum > 0 &&
          this.yPum + this.$refs.moveDiv.clientHeight < windowHeight
        ) {
          this.$refs.moveDiv.style.top = this.yPum + "px";
        } else if (this.yPum <= 0) {
          // 上边缘出界
          this.$refs.moveDiv.style.top = 0 + "px";
        } else if (
          this.yPum + this.$refs.moveDiv.clientHeight >=
          windowHeight
        ) {
          // 下边缘
          // console.log("windowHeight:", windowHeight)
          // console.log("moveDiv.clientHeight:", moveDiv.clientHeight)
          // console.log(this.yPum + moveDiv.clientHeight)
          this.$refs.moveDiv.style.top =
            windowHeight - this.$refs.moveDiv.clientHeight + "px";
        }
        // 阻止页面的滑动默认事件，为了只让悬浮球滑动，其他部分不滑动；如果碰到滑动问题，1.2 请注意是否获取到 touchmove, 系统默认passive: true，无法使用preventDefault
        // document.addEventListener("touchmove", function(){
        //    event.preventDefault();
        // }, { passive: false });
        // document.addEventListener("mousemove", function(){
        //     event.preventDefault();
        // }, { passive: false });
        document.addEventListener("touchmove", this.preventDefault, {
          passive: false,
        });
        document.addEventListener("mousemove", this.preventDefault, {
          passive: false,
        });
      }
    },
    //鼠标释放时候的函数，鼠标释放，移除之前添加的侦听事件，将passive设置为true，不然背景会滑动不了
    end() {
      this.flags = false;
      // 注意事项，在添加和删除监听事件时，其function必须是同名的函数，不能为匿名函数。
      document.removeEventListener("touchmove", this.preventDefault, false);
      document.removeEventListener("mousemove", this.preventDefault, false);
      // 下面两句是保证在移除监听事件后，除了悬浮球的部分还能够滑动，如果不添加，则无法滑动
      document.addEventListener("touchmove", function (e) {
        window.event.returnValue = true;
      });
      document.addEventListener("mousemove", function (e) {
        window.event.returnValue = true;
      });
    },
    preventDefault(e) {
      e.preventDefault();
    },
    feedback() {
      this.$router.push({ path: "/feedBack" });
    },
  },
};
</script>

<style scoped lang="stylus">
.xuanfu {
  /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级 */
  z-index: 2;
  position: fixed; // 这里的定位方式有待考量，fixed的话存在未知设置不合理，跑出屏幕不显示的问题

  img {
    width: w(80);
    background-color: #f2f2f2;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
  }
}
</style>
