<template>
  <div class="user">
    <div class="header">
      <span class="header-icon">
        <i class="header-icon iconfont" @click="back">&#xe679;</i>
      </span>
      <div class="header-tab">
        <switches :tabText="tabText" @getChoose="getChoose"></switches>
      </div>
    </div>
    <div class="neck">
      <div class="play" @click="random">
        <i class="play-icon iconfont">&#xe801;</i>
        <span class="play-desc">随机播放全部</span>
      </div>
    </div>
    <div class="user-body" ref="list">
      <scroll ref="scroll" :data="favoriteList" class="scroll">
        <div>
          <song-list v-show="choose" :songs="playHistory" @select="selectLike"></song-list>
          <song-list v-show="!choose" :songs="favoriteList" @select="selectLike"></song-list>
        </div>
      </scroll>
    </div>
    <no-result v-show="noResult" :infoText="noRusultText"></no-result>
  </div>
</template>

<script>
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
import { Song } from 'common/js/song'
import NoResult from 'base/no-result/no-result'

export default {
  mixins: [playlistMixin],
  name: 'UserCenter',
  data () {
    return {
      tabText: ['我喜欢的','最近听的'],
      choose: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ]),
    noResult () {
      if (!this.choose) {
        return this.favoriteList.length === 0
      } else {
        return this.playHistory.length === 0
      }
    },
    noRusultText () {
      if (!this.choose) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    }
  },
  methods: {
    ...mapActions([
      'randomPlay',
      'insertSong'
    ]),
    back () {
      this.$router.back()
    },
    getChoose (num) {
      this.choose = num
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectLike (item, index) {
      this.insertSong(new Song(item))
    },
    random () {
      let list = !this.choose ? this.favoriteList : this.playHistory
      list = this._normalizeSong(list)
      this.randomPlay(list.slice())
    },
    _normalizeSong (list) {
      let ret = []
      list.forEach((item) => {
        ret.push(new Song(item))
      })
      return ret
    }
  },
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .user
    position fixed
    top 0
    bottom 0
    width 100%
    background-color $color-background
    .header
      height 44px
      .header-icon
        position absolute
        left 5px
        top 5px
        font-size 26px
        color $color-theme
      .header-tab
        margin 10px
    .neck
      height 60px
      padding-top 20px
      .play
        display flex
        align-items center
        justify-content center
        height 36px
        width 160px
        margin 0px auto
        border 1px solid $color-text-ll
        border-radius 20px
        text-align center
        font-size $font-size-medium
        color $color-text-ll
        .play-icon
          font-size $font-size-large
          margin-right 5px
    .user-body
      position fixed
      top 120px
      bottom 0
      left 7.5%
      right 7.5%
      .scroll
        overflow hidden
        height 100%
</style>
