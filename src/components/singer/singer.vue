<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers" :barData="barData"></list-view>
    <transition-slide>
      <router-view></router-view>
    </transition-slide>
  </div>
</template>

<script>
import TransitionSlide from 'base/transition/transition-slide'
import ListView from 'base/listview/listview'
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  data () {
    return {
      singers: []
    }
  },
  computed: {
    barData () {
      return this.singers.map((group) => {
        return group.title
      })
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    selectSinger (item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      // 歌手整理
      list.forEach((item, index) => {
        let key = item.Findex

        // 整理热门歌手
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }

        // 按字母整理歌手
        if (!map[key] && /[A-Z]/.test(key)) {
          map[key] = {
            title: key,
            items: []
          }
        } else if (!map[key]) {
          key = '#'
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      // 获得字母列表顺序
      let hot = []
      let alpha = []
      let num = []
      for (const key in map) {
        const val = map[key]
        if (val.title === HOT_NAME) {
          hot.push(val)
        } else if (val.title.match(/[A-Z]/)) {
          alpha.push(val)
        } else if (val.title === '#') {
          num.push(val)
        }
      }
      alpha.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(alpha, num)
    },
    handleBarClick (title) {
      if (this.letter !== title) {
        this.letter = title
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView,
    TransitionSlide
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
</style>
