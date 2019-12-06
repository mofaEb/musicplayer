<template>
  <div class="search">
    <div class="search-box">
      <search-box ref="searchBox"  @query="onQuerychange"></search-box>
    </div>
    <div class="scroll-wrapper" ref='list' v-show="!query">
      <scroll :data="shortcut" ref="scroll" class="scroll">
        <div class="shortcut-wrapper">
          <div class="hotKey">
            <h1 class="hotKey-title">热门搜索</h1>
            <ul class="hotKey-wrapper">
              <li @click="addQuery(key.k)" class="hotKey" v-for="(key, index) in hotKey" :key="index">
                {{ key.k }}
              </li>
            </ul>
          </div>
          <div class="search-history" v-show='searchHistory.length'>
            <h1 class="search-title">
              <span class="search-title-text">搜索历史</span>
              <span class="search-title-icon" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="search" v-show="query">
      <suggest @getHistory="getHistory" @listScroll="blurInput" :query="query"></suggest>
    </div>
    <div class="confirm">
      <confirm @confirm="clearSearchHistory" text="是否清空搜索历史" confirmBtnText="清空" ref="confirm"></confirm>
    </div>
    <transition-slide>
      <router-view></router-view>
    </transition-slide>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import TransitionSlide from 'base/transition/transition-slide'
import Suggest from '../suggest/suggest'
import SearchList from 'base/search-list/search-list'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  name: 'Search',
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    shortcut () {
      return this.searchHistory.concat(this.hotKey)
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    showConfirm () {
      this.$refs.confirm.show()
    },
    onQuerychange (newQuery) {
      this.query = newQuery
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    getHistory () {
      this.saveSearchHistory(this.query)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.bottom = bottom
      this.$refs.search.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        this.$refs.scroll.refresh()
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
    TransitionSlide
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
    .search
      width 90%
      margin 10px auto
      .search-box
        margin-top 30px
        margin-bottom 10px
      .scroll-wrapper
        position fixed
        left 5%
        right 5%
        top 180px
        bottom 10px
        .scroll
          overflow hidden
          height 100%
        .shortcut-wrapper
          font-size $font-size-medium
          .hotKey-title
            margin 15px 0
            color: $color-text-ll
          .hotKey-wrapper
            display flex
            flex-wrap wrap
            color: $color-text-l
            .hotKey
              margin-bottom 10px
              padding 5px 10px
              margin-right 20px
              border-radius 5px
              background-color $color-highlight-background
          .search-title
            display flex
            align-items center
            margin 20px 0
            font-size $font-size-medium
            color: $color-text-ll
            .search-title-text
              flex 1
            .search-title-icon
              float right
      .search-result
        position fixed
        top 180px
        bottom 0
        left 5%
        right 5%
</style>
