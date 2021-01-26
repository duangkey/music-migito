<template>
    <transition>
        <music-list :rank="rank" :title="title" :bg-image="bigImage" :songs="musicList"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { getMusicList } from '@/api/rank.js'
import { ERR_OK } from '@/api/config.js'
import { mapGetters } from 'vuex'
import { createSong } from '@/common/js/song'
export default {
  components: {
    MusicList
  },
  data () {
    return {
      musicList: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bigImage () {
      if (this.musicList.length) {
        return this.musicList[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList(this.topList.id)
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.musicList = this._normallizeSongs(res.songlist)
        }
        // console.log(this.musicList)
      })
    },
    _normallizeSongs (list) {
      const ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';
.slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
}
</style>
