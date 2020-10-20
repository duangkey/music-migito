// 映射  getters包装，取数据到组件中
export const singer = state => state.singer

// 取播放组件的暂停/播放按钮
export const playing = state => state.playing
// 取展开/收起字段
export const fullScreen = state => state.fullScreen
// 取播放列表字段
export const playList = state => state.playList
// 取顺序列表字段
export const sequenceList = state => state.sequenceList
// 取播放方式字段
export const mode = state => state.mode
// 取当前播放下标字段
export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
