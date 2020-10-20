// 状态更改
import * as types from './mutation-types'

const mutations = {
  // 第一个参数：state
  // 第二个参数：传过来的参数设定
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  // 布尔值 使用flag字段标识
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  }
}

export default mutations
