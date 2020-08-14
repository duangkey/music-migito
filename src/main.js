import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fastclick from 'fastclick'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import './common/scss/index.scss'

fastclick.attach(document.body)

Vue.config.productionTip = false
Vue.use(ViewUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
