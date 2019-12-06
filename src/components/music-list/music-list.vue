<template>
  <div class="music-list">
    <div class="list-header">
        <div class="header-title">
          <i class="header-icon iconfont" @click="back">&#xe679;</i>
          <span> {{ title }} </span>
        </div>
    </div>
    <div
      class="list-banner"
      ref="bgImage"
      :style="bgStyle"
    >
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper" v-show="songs.length" ref="play">
        <div class="play" @click="_randomPlay">
          <i class="play-icon iconfont">&#xe801;</i>
          <span class="play-desc">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div
      class="song-list-wrapper"
      ref="list"
    >
      <scroll
        class="song-list-scroll"
        ref="scroll"
        :songs="songs"
        :listenScroll="listenScroll"
        :probe-type="probeType"
        @scroll="scroll"
      >
        <div class="song-list-container">
          <song-list :isTopRank="isTopRank" :songs="songs" @select="selectItem"></song-list>
        </div>
        <div class="loading-container" v-show="!songs.length">
          <loading></loading>
        </div>
      </scroll>
    </div>

  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HEADER_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  name: 'MusicList',
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    isTopRank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: NaN
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    },
    showSongs () {
      const newList = this.songs.concat()
      console.log(newList)
      if (!this.fullScreen) {
        return newList.push('')
      }
      return newList
    },
    ...mapGetters([
      'fullScreen'
    ])
  },
  created () {
    this.listenScroll = true
    this.probeType = 3
    this.bgImageHeight = NaN
    this.minTranslateY = NaN
    // console.log(this.bgImage, this.songs, this.title)
  },
  mounted () {
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.bgImageHeight + HEADER_HEIGHT
    this.$refs.list.style.top = `${this.bgImageHeight}px`
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
      // console.log(this.scrollY)
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    _randomPlay () {
      this.randomPlay({
        list: this.songs
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  watch: {
    scrollY (posY) {
      let zIndex = 0
      let translateY = Math.max(this.minTranslateY, posY)
      let scale = 1
      let blur = 0

      this.$refs.layer.style[transform] = `translateY(${translateY}px)`
      const percent = Math.abs(posY / this.bgImageHeight)

      if (posY > 0) {
        scale += percent
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      if (translateY === this.minTranslateY) {
        zIndex = 10
        this.$refs.play.style.display = 'none'
        this.$refs.bgImage.style.height = `${HEADER_HEIGHT}px`
        this.$refs.bgImage.style.paddingBottom = 0
      } else {
        this.$refs.play.style.display = ''
        this.$refs.bgImage.style.height = 0
        this.$refs.bgImage.style.paddingBottom = '70%'
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .list-banner
    position relative
    background-repeat: no-repeat
    background-size: cover
    width 100%
    height 0
    padding-bottom: 70%
    transform-origin: top
    .play-wrapper
      position absolute
      bottom: 20px
      height 35px
      margin auto auto
      width 100%
      z-index 0
      .play
        height 100%
        line-height 35px
        width 145px
        margin 0 auto
        border 1px solid $color-theme
        border-radius 17.5px
        text-align center
        color $color-theme
        .play-icon
          display inline-block
          padding 0 5px
          vertical-align: top
          font-size $font-size-large
        .play-desc
          display inline-block
          vertical-align: top
          font-size $font-size-medium
    .filter
      position absolute
      width 100%
      height 100%
      background-color rgba(0, 0, 0, 0.5)
  .list-header
    position absolute
    display flex
    height: 40px
    width 100%
    z-index 100
    .header-title
      position relative
      height: 40px
      line-height: 40px
      text-align center
      flex: 1
      font-size: $font-size-medium-x
      .header-icon
        position absolute
        height: 40px
        line-height: 40px
        padding: 0 10px
        left: 0
        font-size: $font-size-large-x
        color $color-theme
  .bg-layer
    width 100%
    padding-bottom 100%
    background-color $color-background
  .song-list-wrapper
    position fixed
    top 0
    bottom 0
    left 5%
    width 90%
    .song-list-scroll
      // overflow hidden
      height 100%
      .song-list-container
        padding-top 10px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
