import { playMode } from '@/common/js/config'

// 初始状态管理
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  // 定义歌单对象
  disc: {},
  topList: {}
}

export default state
