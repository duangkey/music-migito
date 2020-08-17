<template>
    <div id="recommend">
        <div class="recommend-content">
          <!-- 轮播图，当请求到 recommends 时才渲染 -->
          <div v-if="recommends.length" class="slider-wrapper">
            <swiper>
              <div v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl" alt="">
                </a>
              </div>
            </swiper>
          </div>
          <div class="recommend-list">
            <h1 class="list-title"></h1>
            <ul></ul>
          </div>
        </div>
    </div>
</template>

<script>
import { getRecommend } from '@/api/recommend'
import Swiper from '@/base/swiper/Swiper'
import { ERR_OK } from '@/api/config'
export default {
  name: 'Recommend',
  components: {
    Swiper
  },
  data () {
    return {
      recommends: []
    }
  },
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    }
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
