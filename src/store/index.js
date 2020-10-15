// 出口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 监测state的修改是不是通过mutations实现
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  state,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
