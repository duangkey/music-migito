// 状态更改
import * as types from './mutation-types'

const mutations = {
  // 第一个参数：state
  // 第二个参数：传过来的参数设定
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
