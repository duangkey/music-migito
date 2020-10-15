import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fastclick from 'fastclick'
import ViewUI from 'view-design'
import VueLazyLoad from 'vue-lazyload'
import 'view-design/dist/styles/iview.css'
import './common/scss/index.scss'
import store from './store'

fastclick.attach(document.body)

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(VueLazyLoad, {
  loading: require('@/common/img/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
