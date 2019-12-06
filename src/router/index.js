import Vue from 'vue'
import VueRouter from 'vue-router'
// import Rank from '@/components/rank/rank'
// import RankDetail from '@/components/rank-detail/rank-detail'
// import Recommend from '@/components/recommend/recommend'
// import Search from '@/components/search/search'
// import Singer from '@/components/singer/singer'
// import SingerDetail from '@/components/singer-detail/singer-detail'
// import Disc from '@/components/disc/disc'
// import UserCenter from '@/components/user-center/user-center'

Vue.use(VueRouter)

const Rank = (resolve) => {
  import('@/components/rank/rank').then((module) => {
    resolve(module)
  })
}
const RankDetail = (resolve) => {
  import('@/components/rank-detail/rank-detail').then((module) => {
    resolve(module)
  })
}
const Recommend = (resolve) => {
  import('@/components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('@/components/search/search').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('@/components/singer/singer').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('@/components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const Disc = (resolve) => {
  import('@/components/disc/disc').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => {
  import('@/components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

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
    component: Search,
    children: [
      {
        path: ':id',
        name: 'SingerDetail',
        component: SingerDetail
      }
    ]
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
  }, {
    path: '/user',
    name: 'UserCenter',
    component: UserCenter
  }
]

const router = new VueRouter({
  routes
})

export default router
