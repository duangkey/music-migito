<template>
    <div class="player" v-show="playList.length>0">
        <!-- 正常播放器大小 -->
      <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
      >
        <div class="normal-player" v-show="fullScreen">
          <!-- 背景图 -->
          <div class="background">
              <img width="100%" height="100%" :src="currentSong.image" alt="">
          </div>
          <!-- 播放器顶部区块 -->
          <div class="top">
              <div class="back" @click="back">
                  <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <!-- 中间唱片部分 -->
          <div class="middle"
               @touchstart.prevent="middleTouchStart"
               @touchmove.prevent="middleTouchMove"
               @touchend="middleTouchEnd">
              <div class="middle-l" ref="middleL">
                  <div class="cd-wrapper" ref="cdWrapper">
                      <div class="cd" :class="cdRotate">
                          <img :src="currentSong.image" alt="" class="image">
                        </div>
                  </div>
                  <!-- 当前歌词显示 -->
                  <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">{{playingLyric}}</div>
                  </div>
              </div>
              <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p class="text"
                    ref="lyricLine"
                    :class="{'current': currentLineNum === index}"
                    v-for="(line, index) in currentLyric.lines"
                    :key="index"
                    >{{line.txt}}</p>
                  </div>
                </div>
              </scroll>
          </div>
          <!-- 底部操作区 -->
          <div class="bottom">
            <!-- 滚动dot -->
            <div class="dot-wrapper">
              <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
              <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
              </div>
              <span class="time time-r">{{format(currentSong.duration)}}</span>
            </div>
              <div class="operators">
                  <div class="icon i-left" @click="changeMode">
                      <i :class="iconMode"></i>
                  </div>
                   <div class="icon i-left" :class="disabledCls">
                      <i @click="prev" class="icon-prev"></i>
                  </div>
                  <div class="icon i-center" :class="disabledCls">
                      <i @click="handleMusicPlay" :class="playIcon"></i>
                  </div>
                  <div class="icon i-right" :class="disabledCls">
                      <i @click="next" class="icon-next"></i>
                  </div>
                  <div class="icon i-right">
                      <i class="icon-not-favorite"></i>
                  </div>
              </div>
          </div>
      </div>
      </transition>
      <!-- 缩小版播放器 -->
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
          <div class="icon">
              <img :class="cdRotate" height="40" width="40" :src="currentSong.image" alt="">
          </div>
          <div class="text">
              <h2 class="name" v-html="currentSong.name"></h2>
              <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control">
            <!-- 小型进度条插件 -->
            <progress-circle :radius="radius" :percent="percent">
              <i @click.stop="handleMusicPlay" class="icon-mini" :class="miniIcon"></i>
            </progress-circle>
          </div>
          <div class="control">
              <i class="icon-playlist"></i>
          </div>
      </div>
      </transition>
      <audio id="audio" ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '@/common/js/dom'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll/Scroll'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data () {
    return {
      songReady: false,
      // 当前播放进度
      currentTime: 0,
      radius: 32,
      // 默认当前歌词为空
      currentLyric: null,
      // 当前歌词高亮显示
      currentLineNum: 0,
      // 维护dot高亮
      currentShow: 'cd',
      // 当前歌词
      playingLyric: ''
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  created () {
    // 关联touchMove,touchStart,touchend等数据
    this.touch = {}
  },
  methods: {
    back () {
    //   this.fullScreen = false  //不能直接修改
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    // 歌曲前进后退按钮
    next () {
      if (!this.songReady) {
        return
      }
      // 对歌曲列表仅有一首歌曲进行极限判断
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let $index = this.currentIndex + 1
        if ($index === this.playList.length) {
          $index = 0
        }
        // 改变currentSong的下标 针对下标对应的歌曲进行播放
        this.setCurrentIndex($index)
        if (!this.playing) {
          this.handleMusicPlay()
        }
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let $index = this.currentIndex - 1
        if ($index === -1) {
          $index = this.playList.length - 1
        }
        this.setCurrentIndex($index)
        if (!this.playing) {
          this.handleMusicPlay()
        }
      }
      this.songReady = false
    },
    enter (el, done) {
      const { x, y, scale } = this._handleposAndScale()
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      // 清空animation
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._handleposAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    handleMusicPlay () {
      if (!this.songReady) {
        return false
      }
      // 暂停时，歌词也暂停
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      this.setPlayingState(!this.playing)
    },
    // 处理音频播放进度
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    // 转换时间格式
    format (interval) {
      // 向下取整
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60 | 0)
      return `${minute}:${second}`
    },
    middleTouchStart (e) {
      this.touch.initiated = true // 设置初始化标志位
      const $touch = e.touches[0]
      // 记录首次触摸的横坐标及纵坐标
      this.touch.startX = $touch.pageX
      this.touch.startY = $touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return false
      }
      const $touch = e.touches[0]
      // 记录偏移量
      const deltaX = $touch.pageX - this.touch.startX
      const deltaY = $touch.pageY - this.touch.startY
      // 纵向偏移不记录左右滑动事件
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return false
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.lyricList.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      // 左右滑动的两种情况
      let offsetWidth
      let opacity
      const time = 300
      // 向左滑动
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.lyricList.style[transitionDuration] = `${time}ms`
    },
    // 时间戳补零
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.handleMusicPlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    _handleposAndScale () {
      // 定义小缩略图的宽度
      const targetWidth = 40
      // 定义缩略图中心坐标离左侧的距离
      const paddingLeft = 40
      // 定义缩略图中心坐标离底部的距离
      const paddingBottom = 30
      // 定义中心图距离顶部的距离
      const paddingTop = 80
      // 定义中心图片的宽度
      const width = window.innerWidth * 0.8
      // 初始缩放比例
      const scale = targetWidth / width
      // 大小图中心点之间的横向距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 大小图中心点之间的纵向距离
      const y = window.innerHeight - width / 2 - paddingBottom - paddingTop
      return {
        x,
        y,
        scale
      }
    },
    // 音频播放结束触发事件
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      }
      this.next()
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      // 单曲循环播放下，歌词跟随显示
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      // 修改列表
      let list = null
      if (mode === playMode.random) {
        // 洗牌
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex (list) {
      const index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 获取歌词
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handeLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 歌词异常时清理
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // 歌词每一行改变，触发回调函数
    handeLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        const lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    ...mapMutations({
      // 映射出fullScreen
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  computed: {
    cdRotate () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 播放模式
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 歌曲没有准备好，出现短暂的禁止
    disabledCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen', // 控制显示/隐藏
      'playList', // 控制整个播放器的渲染
      'currentSong',
      'playing', // 歌曲的播放
      'currentIndex', // 播放歌曲的下标
      'mode', // 播放模式
      'sequenceList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      // 判断新旧歌曲是否一致
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
              -webkit-animation-play-state:paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
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
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
            margin-right: 5px;
          }
          &.time-r {
            text-align: right;
            margin-left: 5px;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;
      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      // width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      // width: 30px;
      padding: 0 10px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
