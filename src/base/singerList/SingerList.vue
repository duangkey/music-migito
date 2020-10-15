<template>
    <scroll
     class="singer-list"
     :data='data'
     ref="listView"
     :listenScroll="listenScroll"
     :probeType="probeType"
     @scroll="scroll"
     >
        <ul>
            <li v-for='group in data' class="list-group" :key="group.title" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for='item in group.items' :key="item.id" class="list-group-item">
                        <img class="avatar" v-lazy="item.avatar" alt="">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onshortTouchMove">
          <ul>
            <li
            v-for="(item, index) in shortCutList"
            :key="index"
            class="item"
            :data-index="index"
            :class="{'current':currentIndex===index}"
            >
            {{item}}
            </li>
          </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
          <h1 class="fixed">{{fixedTitle}}</h1>
        </div>
        <div class="loading-container" v-show="!data.length">
          <loading></loading>
        </div>
    </scroll>
</template>

<script>
import Scroll from '@/base/scroll/Scroll'
import { myDOM } from '@/common/js/dom.js'
import Loading from '@/base/loading/Loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Scroll,
    Loading
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    shortCutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      const $data = this.data[this.currentIndex]
      return $data ? $data.title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      const anchorIndex = myDOM.getData(e.target, 'index')
      const firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onshortTouchMove (e) {
      const firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 向下取整
      const delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算每个group的高度
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem (item) {
      this.$emit('select', item)
    }
  },
  watch: {
    data () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        const heightT = listHeight[i]
        const heightL = listHeight[i + 1]
        if (-newY >= heightT && -newY < heightL) {
          this.currentIndex = i
          this.diff = heightL + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.singer-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      touch-action: none; //禁止触摸事件产生默认行为
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: -1px;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
