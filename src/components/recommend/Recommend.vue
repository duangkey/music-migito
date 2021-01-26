<template>
    <div id="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content" :data="recommends">
            <!-- 轮播图，当请求到 recommends 时才渲染 -->
          <div v-if="recommends.length" class="slider-wrapper">
            <swiper>
              <div v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img class="needsclick" :src="item.picUrl" alt="">
                </a>
              </div>
            </swiper>
          </div>
          <!-- 歌单列表 -->
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="item in discList" :key="item.dissid">
                <div class="icon">
                  <img @load="loadImage" v-lazy="item.imgurl" width="60" height="60" alt="">
                </div>
                <!-- 使用v-html可对转码内容进行翻译 -->
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
          <div v-show="!discList.length" class="loading-container">
            <loading></loading>
          </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import Scroll from '@/base/scroll/Scroll'
import { getRecommend, getDiscList } from '@/api/recommend'
import Swiper from '@/base/swiper/Swiper'
import { ERR_OK } from '@/api/config'
import Loading from '@/base/loading/Loading'
import { playlistMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  name: 'Recommend',
  mixins: [playlistMixin],
  components: {
    Swiper,
    Scroll,
    Loading
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    async _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
      // 测试async 与 await
      var res1 = await getRecommend()
      console.log(res1.data)
    },
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    // 轮播区域图片加载一次
    loadImage () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="scss">
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

#recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slide-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
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
