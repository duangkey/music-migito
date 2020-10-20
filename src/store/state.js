import { playMode } from '@/common/js/config'

// 初始状态管理
const state = {
  singer: {},
  palying: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state
