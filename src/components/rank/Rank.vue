<!-- 排行页组件 -->

<template>
  <div class="rank" ref="rank">
    <!-- 排行榜数据 -->
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="select(item)">
          <!-- 左图 -->
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>

          <!-- 右歌 -->
          <ul class="songlist">
            <!-- <h3 class="title">{{ item.topTitle }}</h3> -->
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index + 1}} </span>
              <span>{{song.songname}}</span>
              <span class="singername">-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>

      <!-- loading 组件 -->
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>

    <router-view></router-view>
  </div>
</template>

<script>
import Loading from '@/base/loading/Loading'
import Scroll from '@/base/scroll/Scroll'
import { getTopList } from '@/api/rank.js'
import { ERR_OK } from '@/api/config.js'
import { playlistMixin } from '@/common/js/mixin'
// import { playlistMixin } from '@/common/js/mixin.js'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  components: {
    Loading,
    Scroll
  },
  data () {
    return {
      topList: []
    }
  },
  props: {},
  watch: {},
  filters: {},
  methods: {
    // 获取排行播放列表
    select (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    // 处理迷你播放器距离底部的距离
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
      console.log(111)
    },
    getTopList () {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  computed: {},
  created () {
    this.getTopList()
  },
  mounted () {},
  destroyed () {}
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: auto;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 auto;
        width: auto;
        height: auto;
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
          .singername {
            color: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
