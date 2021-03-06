<template>
<!-- 进度条组件 -->
    <div>
        <div class="progress-bar" ref="progressBar" @click="handleClickBar">
            <div class="bar-inner">
                <div class="progress" ref="progress"></div>
                <!-- better-scroll插件封装的touch事件，用于进度条点击和拖动进度 -->
                <div class="progress-btn-wrapper" ref="progressBtn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
                >
                    <div class="progress-btn"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { prefixStyle } from '@/common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    //   外部组件传入，在此接受百分比
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    // 不同touch事件共享数据所挂载的对象
    this.touch = {}
  },
  methods: {
    // 拖动小球改变播放进度，小球滑动开始位置
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 拖动小球改变播放进度，小球滑动过程中
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return {}
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    // 拖动小球改变播放进度，小球滑动结束
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      //   把percent派发出去
      this.$emit('percentChange', percent)
    },
    // 处理点击跳转进度
    handleClickBar (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 当点击progress-btn的时候，offsetX获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    }
  },
  watch: {
    percent (newPercent) {
      if ((newPercent >= 0) && (!this.touch.initiated)) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth // 已有进度宽度
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
