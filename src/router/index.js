import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/components/rank/Rank'
import Recommend from '@/components/recommend/Recommend'
import Singer from '@/components/singer/Singer'
import Search from '@/components/search/Search'
import SingerDetail from '@/components/singer-detail/SingerDetail'
import Disc from '@/components/disc/disc'
import TopList from '@/components/top-list/top-list'

Vue.use(Router)

// 防止导航重复报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 路由懒加载
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: 'id',
        component: Disc
      }
    ]
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: TopList
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        name: 'SingerDetail',
        component: SingerDetail
      }
    ]
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
