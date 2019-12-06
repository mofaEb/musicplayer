<template>
  <transition-slide>
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <div class="header-title">
          添加歌曲到列表
        </div>
        <div class="header-icon">
          <i class="icon-delete" @click="hide"></i>
        </div>
      </div>
      <div class="box-wrapper">
        <search-box ref="searchBox" @query="getQuery"></search-box>
      </div>
      <div class="body" v-show="!query">
        <div class="body-switches">
          <switches @addQuery="addQuery" @getChoose="getChoose"></switches>
        </div>
        <div class="list-wrapper">
          <scroll ref="songScroll" class='list-scroll' :data="playHistory" v-if="!choose">
            <div>
              <song-list @select="selectItem" :songs='playHistory'></song-list>
            </div>
          </scroll>
          <scroll ref="searchScroll" class='list-scroll' :data="searchHistory" v-if="choose">
            <div>
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="suggest-wrapper" v-show="query">
        <suggest @getHistory="getHistory" @listScroll="blurInput" :query="query"></suggest>
      </div>
      <top-tip ref="tip">
        <div class="tip">
          <i class="icon-ok tip-icon"></i>
          <span class="tip-text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition-slide>
</template>

<script>
import TransitionSlide from 'base/transition/transition-slide'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Suggest from '../suggest/suggest'
import TopTip from 'base/top-tip/top-tip'
import { searchMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'
import { Song } from 'common/js/song'

export default {
  mixins: [searchMixin],
  name: 'AddSong',
  data () {
    return {
      showFlag: false,
      choose: 0
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        if (!this.choose) {
          this.$refs.songScroll.refresh()
        } else {
          this.$refs.searchScroll.refresh()
        }
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getHistory () {
      this.saveSearchHistory(this.query)
      this.$refs.tip.show()
    },
    getQuery (newQuery) {
      this.query = newQuery
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    getChoose (num) {
      this.choose = num
    },
    selectItem (item, index) {
      this.insertSong(new Song(item))
      this.$refs.tip.show()
    }
  },
  components: {
    TransitionSlide,
    Suggest,
    Switches,
    SongList,
    Scroll,
    TopTip
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .add-song
    position fixed
    top 0
    bottom 0
    width 100%
    background-color $color-background
    z-index 200
    .header
      position relative
      .header-title
        line-height 40px
        height 40px
        width 100%
        color $color-text
        text-align center
      .header-icon
        position absolute
        top 0
        right 0
        line-height 40px
        height 40px
        width 40px
        text-align center
    .box-wrapper
      position relative
      width 90%
      margin 0 auto
      padding-top 20px
    .body
      // position relative
      margin 0 auto
      width 90%
      .body-switches

        width 100%
        padding 25px 0
        .tab
          display flex
          height 30px
          width 220px
          margin 25px auto
          color $color-text-l
          .be-choose
            flex 1
            height 30px
            line-height 30px
            border 1px solid $color-text-l
            font-size $font-size-medium
            text-align center
            background-color $color-text-l
          .no-choose
            flex 1
            height 30px
            line-height 30px
            border 1px solid $color-text-l
            font-size $font-size-medium
            text-align center
      .list-wrapper
        position fixed
        top 170px
        bottom 0
        left 5%
        right 5%
        .list-scroll
          overflow hidden
          height 100%
    .suggest-wrapper
      position fixed
      top 120px
      bottom 0
      left 5%
      right 5%
      z-index 999
    .tip
      line-height 50px
      text-align center
      .tip-icon
        margin 5px
        font-size $font-size-large
      .tip-text
        color $color-text
</style>
