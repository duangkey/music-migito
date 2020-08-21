<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
      class="dot"
      v-for="(item, index) in dots" :key="index"
      :class="{active:currentPageIndex===index}"
      >
      </span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { myDOM } from '@/common/js/dom'

export default {
  props: {
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播延时
    interval: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  methods: {
    // 计算轮播区域的宽度
    _setWidth (isResize) {
    // 拿到轮播图片数据
      this.children = this.$refs.sliderGroup.children

      // 父元素的宽度
      let width = 0
      const sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        myDOM.addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 复制一个图片的宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化轮播图
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: true
      })
      this.slider.on('scrollEnd', () => {
        // 获取当前页的下标
        const activeIndex = this.slider.getCurrentPage().pageX
        // 去掉拷贝下标
        // if (this.loop) {
        //   activeIndex -= 1
        // }
        this.currentPageIndex = activeIndex

        // 重置自动轮播定时器
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._initAutoPlay()
        }
      })
    },
    // 导航点初始化
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    // 循环播放
    _initAutoPlay () {
      let pageIndex = this.currentPageIndex
      if (this.loop) {
        if (this.currentPageIndex === 4) {
          pageIndex = -1
        }
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  mounted () {
    // 相当于$nextTick,20 ms 是一个经验值，每一个 Tick 约为 17 ms），对用户体验而言都是无感知的。
    setTimeout(() => {
      this._setWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._initAutoPlay()
      }
    }, 20)
    // 监听窗口改变事件
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setWidth(true)
      // 重新计算
      this.slider.refresh()
    })
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.slider {
  min-height: 1px;
  position: relative;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
