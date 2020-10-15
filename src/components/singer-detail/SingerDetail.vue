<template>
<transition name="slide">
    <!-- <div class="singer-detail"> -->
      <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    <!-- </div> -->
</transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { ERR_OK } from '@/api/config'
import { getSingerDetail } from '@/api/singer.js'
import { createSong } from '@/common/js/song'
import MusicList from '@/components/music-list/music-list'
export default {
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    _normalSongs (list) {
      const ret = []
      list.forEach(item => {
        const { musicData } = item
        // console.log(item)
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

// .singer-detail {
//   position: fixed;
//   z-index: 100;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: $color-background;
// }

.slide-enter-active, .slide-leave-active {
  transition: all 1s;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
</style>
