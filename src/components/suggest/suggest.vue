<template>
  <div class="suggest">
    <div class="suggest-wrapper" ref="list">
      <scroll
        ref="scroll"
        class="suggest-scroll"
        :beforeScroll="true"
        :pullup="true"
        @scrollToEnd="scrollToEnd"
        @beforeScroll="listScroll"
      >
        <ul>
          <li @click="selectItem(item, index)" class="suggest-song" v-for="(item, index) in result" :key="index">
            <i :class="getIconCls(item)"></i>
            <p class="song-disc" v-html="getSongTxt(item)">1</p>
          </li>
        </ul>
        <loading v-show="hasMore"></loading>
        <no-result v-show="!hasMore && !result.length"></no-result>
      </scroll>
    </div>
  </div>
</template>

<script>
import { getSearchData } from 'api/search'
import { createSearchSong } from 'common/js/song.js'
import { mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import Singer from 'common/js/singer'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      result: [],
      page: 1,
      hasMore: true
    }
  },
  created () {},
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    listScroll () {
      this.$emit('listScroll')
    },
    scrollToEnd () {
      this.page++
      this._pushNewPageData(this.page)
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('getHistory')
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getSongTxt (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    checkMode (data) {
      const song = data.song
      if (!song.list.length || song.curnum + (song.curpage-1) * perpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getSearchData(query, page, show) {
      this.hasMore = true
      this.page = 1
      this.$refs.scroll.scrollTo(0, 0)
      getSearchData(query, page, show, perpage).then((res) => {
        this.result = this._genResult(res.data)
        this.checkMode(res.data)
      })
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normailizeSong(data.song.list))
      }
      return ret
    },
    _normailizeSong (list) {
      let ret = []
      list.forEach((item) => {
        ret.push(createSearchSong(item))
      })
      return ret
    },
    _pushNewPageData (newpage) {
      getSearchData(this.query, newpage, this.showSinger, perpage).then((res) => {
        this.result = this.result.concat(this._normailizeSong(res.data.song.list))
        this.checkMode(res.data)
      })
    },
  },
  watch: {
    query (newQuery) {
      this._getSearchData(newQuery, this.page, this.showSinger)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .suggest-wrapper
    position absolute
    top 0
    bottom 0
    width 100%
    font-size $font-size-medium
    .suggest-scroll
      overflow hidden
      height 100%
      width 100%
      .suggest-song
        display flex
        align-items center
        padding 10px 10px
        color: $color-text-l
        .song-disc
          margin 0 16px
          no-wrap()
</style>
