 <template>
  <div class="player" v-show="playlist.length">
    <transition name="full"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="player-full" v-show="fullScreen">
        <div class="bg-img" >
          <div class="bg-cover"></div>
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="header">
          <i class="iconfont header-icon" @click='setFullScreen(!fullScreen)'>&#xe603;</i>
          <h1 class="header-title" v-html="currentSong.name"></h1>
          <h2 class="header-subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="body"
          @touchstart.prevent="bodyTouchStart"
          @touchmove.prevent="bodyTouchMove"
          @touchend="bodyTouchEnd"
        >
          <div class="circle-wrapper" ref="cd">
            <div class="body-circle">
              <img :src="currentSong.image" alt="" class="circle-img" :class="cdCls">
            </div>
            <div class="circle-lyric">
              <p>
                {{ playingLyric }}
              </p>
            </div>
          </div>
          <scroll class="lyric-scroll" ref="lyricList" >
            <div v-if="currentLyric">
              <p
                class="lyric-line"
                ref="lines"
                :class="{current: currentLineNum === index}"
                v-for="(line, index) in currentLyric.lines"
                :key="index"
              >
                {{ line.txt }}
              </p>
            </div>
          </scroll>
        </div>
        <div class="footer">
          <div class="dot-wrapper">
            <div class="footer-dot" :class="{'active':currentShow==='cd'}"></div>
            <div class="footer-dot" :class="{'active':currentShow==='lyric'}"></div>
          </div>
          <div class="process-wrapper">
            <span class="bar-time">{{ currentTime | formatTime }}</span>
            <div class="process-bar-wrapper">
              <process-bar
                :barPercent="barPercent"
                :songTime="currentSong.duration"
                @checkClick="checkClick"
                @resetTime="resetTime"
                @showTime='showTime'
              ></process-bar>
            </div>
            <span class="bar-time">{{ currentSong.duration | formatTime }}</span>
          </div>
          <div class="icons-wrapper">
            <div class="footer-icons">
              <i @click="changeMode" class="i-left" :class="modeIcon"></i>
            </div>
            <div class="footer-icons" :class="displayCls">
              <i @click="changeSong(false)" class="icon-prev i-left"></i>
            </div>
            <div class="footer-icons" :class="displayCls">
              <i @click="togglePlaying" class="i-center" :class="playIcon"></i>
            </div>
            <div class="footer-icons" :class="displayCls">
              <i @click="changeSong(true)" class="icon-next i-right"></i>
            </div>
            <div class="footer-icons">
              <i @click="toggleLike" class="i-right" :class="likeCls" ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="player-mini" v-show="!fullScreen" @click='setFullScreen(!fullScreen)'>
        <div class="mini-left" >
          <img :src="currentSong.image" class="mini-img" :class="cdCls">
        </div>
        <div class="mini-body">
          <h1 class="mini-title" v-html="currentSong.name"></h1>
          <h2 class="mini-subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="mini-right">
          <process-circle :barPercent="barPercent" :radius="32">
            <i :class="miniIcon" @click.stop="togglePlaying" class="miniIcon"></i>
          </process-circle>
        </div>
        <div class="mini-right" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio"
           id="music"
           :src='songUrl'
           @play="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="ended"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { prefixStyle } from 'common/js/dom'
import { playerMixin } from 'common/js/mixin'
import { playMode } from 'common/js/config'
import ProcessBar from 'base/process-bar/process-bar'
import ProcessCircle from 'base/process-circle/process-circle'
import Scroll from 'base/scroll/scroll'
import Playlist from '../playlist/playlist'
import animations from 'create-keyframe-animation'
import Lyric from 'lyric-parser'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins: [playerMixin],
  name: 'Player',
  data () {
    return {
      songUrl: '',
      currentLyric: null,
      songReady: false,
      currentTime: 0,
      currentLineNum: 0,
      clicking: false,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  created () {
    this.touch = {}
  },
  mounted () {
    this.wakeAudio ()
  },
  computed: {
    likeCls () {
      const list = this.favoriteList.slice()
      const id = this.currentSong.id
      let index = list.findIndex((item) => {
        return item.id === id
      })
      return index > -1 ? 'icon-favorite' : 'icon-not-favorite'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    displayCls () {
      return this.songReady ? '' : 'display'
    },
    barPercent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'playing',
      'favoriteList'
    ])
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    wakeAudio () {
      document.addEventListener('DOMContentLoaded', () => {
        if (!this.songUrl) {
          return
        }
        this.$refs.audio.play()
      })
      document.addEventListener('touchstart', () => {
        if (!this.songUrl) {
          return
        }
        this.$refs.audio.play()
      })
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cd, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cd.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cd.style.transition = 'all .4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cd.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cd.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cd.style.transition = ''
      this.$refs.cd.style[transform] = ''
    },
    updateTime (e) {
      if (!this.clicking && this.songReady) {
        this.currentTime = e.target.currentTime
      }
    },
    ended () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.changeSong(true)
      }
      this.currentTime = 0
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    checkClick (boolean) {
      this.clicking = boolean
    },
    showTime (time) {
      this.currentTime = time
    },
    resetTime (time) {
      this.$refs.audio.currentTime = time
      if (this.currentLyric) {
        this.currentLyric.seek(time * 1000)
      }
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    changeSong (next) {
      if (!this.songReady) {
        return
      }
      const len = this.playlist.length
      if (len === 1) {
        this.loop()
        return
      } else {
        this.$refs.audio.currentTime = 0
        let newIndex = next ? this.currentIndex + 1 : this.currentIndex - 1
        newIndex = newIndex < 0 ? len - 1 : newIndex
        newIndex = newIndex < len ? newIndex : 0
        this.setCurrentIndex(newIndex)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error (e) {
      if (this.songUrl) {
        this.songReady = true
      }
    },
    _getPosAndScale () {
      const before = {
        width: window.innerWidth * 0.8,
        offsetTop: 40,
        offsetLeft: 0,
        x: window.innerWidth / 2,
        y: window.innerWidth / 2 + 40
      }
      const after = {
        width: 40,
        offsetLeft: 20,
        offsetbottom: 10,
        x: 40 / 2 + 20,
        y: 40 / 2 + 10
      }

      const x = after.x - before.x
      const y = window.innerHeight - before.y - after.y
      const scale = after.width / before.width
      return {
        x,
        y,
        scale
      }
    },
    _getNewUrlAndPlay (newSong) {
      newSong.getUrl().then((url) => {
        this.songUrl = url
        setTimeout(() => {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
        }, 1000)
      })

    },
    _getSongLyric (newSong) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      newSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        clearTimeout(this.lyricTimer)
        this.lyricTimer = setTimeout(() => {
          this.currentLyric.play()
        }, 1000)
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      this.playingLyric = txt
      if (lineNum > 5) {
        let element = this.$refs.lines[lineNum - 5]
        this.$refs.lyricList.scrollToElement(element, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    bodyTouchStart (el) {
      this.touch.initiated = true
      this.touch.startX = el.touches[0].pageX
      this.touch.startY = el.touches[0].pageY
    },
    bodyTouchMove (el) {
      if (!this.touch.initiated) {
        return
      }
      this.touch.moveX = el.touches[0].pageX
      this.touch.moveY = el.touches[0].pageY
      const offsetX = this.touch.moveX - this.touch.startX
      const offsetY = this.touch.moveY - this.touch.startY
      if (Math.abs(offsetY) > Math.abs(offsetX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const width = this.currentShow === 'cd' ? Math.max(-window.innerWidth, left + offsetX) : Math.max(-window.innerWidth, left + offsetX)
      this.touch.percent = width / -window.innerWidth
      this.$refs.lyricList.$el.style[transform] = `translateX(${width}px)`
      this.$refs.cd.style.opacity = `${1 - this.touch.percent}`
    },
    bodyTouchEnd (el) {
      this.touch.initiated = false
      let offsetWidth, opacity
      if (this.currentShow === 'cd') {
        offsetWidth = this.touch.percent > 0.1 ? -window.innerWidth : 0
        opacity = this.touch.percent > 0.1 ? 0 : 1
      } else if (this.currentShow === 'lyric') {
        offsetWidth = this.touch.percent < 0.9 ? 0 : -window.innerWidth
        opacity = this.touch.percent < 0.9 ? 1 : 0
      }
      const time = 300
      this.currentShow = opacity === 1 ? 'cd' : 'lyric'
      this.$refs.lyricList.$el.style[transform] = `translateX(${offsetWidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.cd.style.opacity = `${opacity}`
      this.$refs.cd.style[transitionDuration] = `${time}ms`
      this.touch.percent = NaN
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    toggleLike () {
      if (this.likeCls === 'icon-not-favorite') {
        this.saveFavoriteList(this.currentSong)
      } else if (this.likeCls === 'icon-favorite') {
        this.deleteFavoriteList(this.currentSong)
      }
    }
  },
  filters: {
    formatTime (time) {
      time = time | 0
      let minite = (time / 60 | 0).toString()
      let second = (time % 60 | 0).toString()
      second = second.length === 1 ? '0' + second : second
      return `${minite}:${second}`
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      this._getNewUrlAndPlay(newSong)
      this._getSongLyric(newSong)
    },
    playing (state) {
      const audio = this.$refs.audio
      if (this.songUrl) {
        this.$nextTick(() => {
          state ? audio.play() : audio.pause()
        })
      }
    }
  },
  components: {
    ProcessBar,
    ProcessCircle,
    Scroll,
    Playlist
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .player
    color $color-theme
    .player-full
      position fixed
      z-index 100
      top 0
      right 0
      bottom 0
      left 0
      background-color $color-background
      .bg-img
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        filter blur(20px)
        .bg-cover
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          background-color rgba(0, 0, 0, 0.5)
      .header
        position relative
        height 40px
        line-height 40px
        font-size $font-size-large
        text-align center
        .header-icon
          position absolute
          display inline-block
          font-size $font-size-large-x
          padding 0 15px
          left 0
        .header-title
          display inline-block
          color white
          no-wrap()
        .header-subtitle
          width 90%
          margin -20px auto
          font-size $font-size-medium
          color white
          no-wrap()
      .body
        position fixed
        top 10%
        bottom 25%
        width 200%
        .circle-wrapper
          display inline-block
          position relative
          float left
          width 50%
          height 0
          padding-bottom 50%
          .body-circle
            position absolute
            top 10%
            left 10%
            height 80%
            width 80%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius 50%
            text-align center
            .circle-img
              height 100%
              width 100%
              border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
          .circle-lyric
            position absolute
            top 100%
            left 5%
            width 90%
            padding-top 20px
            color $color-text-l
            font-size $font-size-medium
            text-align center
        .lyric-scroll
          display inline-block
          overflow hidden
          position relative
          float left
          left 2.5%
          width 45%
          height 100%
          color $color-text-l
          font-size $font-size-medium
          text-align center
          .lyric-line
            padding-top 20px
          .current
            color white
      .footer
        position absolute
        right 5%
        left 5%
        bottom 40px
        width 90%
        .dot-wrapper
          height 8px
          width 50px
          margin 30px auto
          // background-color white
          .footer-dot
            display inline-block
            height 8px
            width 8px
            margin 0 4px
            background-color $color-text-l
            border-radius 4px
            &.active
              width 20px
              background-color $color-text-ll
        .process-wrapper
          display flex
          justify-content center
          margin 10px auto
          height 15px
          line-height 15px
          width 90%
          font-size $font-size-small-s
          color white
          .bar-time
            width 30px
          .process-bar-wrapper
            flex 1
            padding 0 6px
            display inline-block
        .icons-wrapper
          display flex
          overflow hidden
          height 50px
          align-items: center
          text-align center
          .footer-icons
            flex 1
            .i-left
              font-size 30px
            .i-center
              font-size 40px
            .i-right
              font-size 30px
              // background-color #fff
            .icon-favorite
              color $color-sub-theme
          .display
            color $color-text-d
      &.full-enter-active, &.full-leave-active
        transition: all .4s
        .header, .footer
          transition: all .4s cubic-bezier(.86, .18, .82, 1.32)
      &.full-enter, &.full-leave-to
        opacity: 0
        .header
          transform translateY(-100px)
        .body
          transfrom translateX(-100px)
        .footer
          transform translateY(100px)
    .player-mini
      position fixed
      display flex
      align-items center
      z-index 100
      bottom 0
      width 100%
      height 60px
      background-color $color-highlight-background
      .mini-left
        position relative
        float left
        height 100%
        width 40px
        margin-left 20px
        // background-color #000
        .mini-img
          margin-top 10px
          height 40px
          width 40px
          border-radius 50%
          &.play
            animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
      .mini-body
        overflow hidden
        flex 1
        padding 12px
        .mini-title
          margin 6px 0
          font-size $font-size-medium-x
          color white
          no-wrap()
        .mini-subtitle
          margin 8px 0
          font-size $font-size-small
          color $color-text-d
          no-wrap()
      .mini-right
        float right
        padding 0 10px
        width 30px
        font-size 30px
        color $color-theme-d
        .miniIcon
          // background-color #fff
          font-size 32px
          position absolute
          left 0
          top 0
      &.mini-enter-active, &.mini-leave-active
        transition: all .4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
