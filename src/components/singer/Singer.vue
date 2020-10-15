<template>
    <div id="singer">
        <list-view @select="selectSinger" :data='singers'></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
import { createSinger } from '@/common/js/SingerClass'
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import ListView from '@/base/singerList/SingerList'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  components: {
    ListView
  },
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this.handleInitData(res.data.list)
          console.log(this.singers, 111)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleInitData (list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 填充歌手数据
      list.forEach((item, index) => {
        // 填充热门歌手数据
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(createSinger(item))
        }
        // 填充 a-z 字母
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 填充对应字母歌手数据
        map[key].items.push(createSinger(item))
      })
      // 得到有序列表
      const hot = []
      const ret = []
      for (const key in map) {
        const val = map[key]
        // 正则校验
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    selectSinger (singer) {
      console.log(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="scss">
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

#singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
