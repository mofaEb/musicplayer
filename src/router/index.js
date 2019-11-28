import Vue from 'vue'
import VueRouter from 'vue-router'
import Rank from '@/components/rank/rank'
import RankDetail from '@/components/rank-detail/rank-detail'
import Recommend from '@/components/recommend/recommend'
import Search from '@/components/search/search'
import Singer from '@/components/singer/singer'
import SingerDetail from '@/components/singer-detail/singer-detail'
import Disc from '@/components/disc/disc'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [
      {
        path: ':id',
        name: 'RankDetail',
        component: RankDetail
      }
    ]
  }, {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        name: 'Disc',
        component: Disc
      }
    ]
  }, {
    path: '/search',
    name: 'Search',
    component: Search
  }, {
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
  }
]

const router = new VueRouter({
  routes
})

export default router
