import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/components/rank/Rank'
import Recommend from '@/components/recommend/Recommend'
import Singer from '@/components/singer/Singer'
import Search from '@/components/search/Search'

Vue.use(Router)

// 路由懒加载
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
