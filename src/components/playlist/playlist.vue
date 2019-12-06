<template>
  <transition name='body'>
    <div class="playlist" v-show="showFlag" @click.self="hide">
      <div class="list">
        <div class="header">
          <span class="header-mode">
            <i class='mode-icon' :class="modeIcon" @click="changeMode"></i>
            <span class="mode-text">{{ modeText }}</span>
          </span>
          <span class="icon-wrapper" @click="showConfirm">
            <i class="icon-clear icon"></i>
          </span>
        </div>
        <div class="body">
          <div class="body-content">
            <scroll :refreshDelay="200" class="scroll" :data="playlist" ref="scroll">
              <transition-group name="list" tag="ul" ref='list'>
                <li
                  class="content-list"
                  v-for="(item,index) in playlist"
                  :key="item.id"
                  @click="selectItem(item,index)"
                >
                  <i class="current-icon" :class="getCurrentIcon(item)"></i>
                  <span class='list-title'>{{ item.name }}</span>
                  <span class="icon-wrapper">
                    <i class="icon" :class="likeCls(item)" @click.stop="toggleLike(item)"></i>
                    <i class="icon-delete icon" @click.stop="deleteOne(item)"></i>
                  </span>
                </li>
              </transition-group>
            </scroll>
          </div>
          <div class="body-bottom">
            <div class="bottom-disc-wrapper" >
              <div class="bottom-disc" @click="showAddPage">
                <i class="icon-add"></i>
                <span>添加歌曲到队列</span>
              </div>
            </div>
          </div>
        </div>
        <div class="footer" @click="hide"> 关闭 </div>
        <confirm ref="confirm" confirmBtnText="清空" text="是否清空播放列表 " @confirm="clearAll"></confirm>
      </div>
      <add-song ref="add"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from '../add-song/add-song'
import { playerMixin } from 'common/js/mixin'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  mixins: [playerMixin],
  name: 'Playlist',
  data () {
    return {
      showFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playing',
      'playlist',
      'currentIndex',
      'favoriteList'
    ])
  },
  methods: {
    ...mapActions([
      'deleteSong',
      'deleteSongList',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent()
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIcon (item) {
      if (item.id === this.currentSong.id) {
        if (this.playing) {
          return 'icon-pause'
        } else {
          return 'icon-play'
        }
      }
    },
    selectItem (item, index) {
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent () {
      const e = this.$refs.list.$el.children[this.currentIndex]
      this.$refs.scroll.scrollToElement(e, 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    clearAll () {
      this.deleteSongList()
    },
    showAddPage () {
      this.$refs.add.show()
    },
    likeCls (song) {
      const list = this.favoriteList.slice()
      const id = song.id
      let index = list.findIndex((item) => {
        return item.id === id
      })
      return index > -1 ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleLike (song) {
      const like = this.isLike(song)
      if (!like) {
        this.saveFavoriteList(song)
      } else if (like) {
        this.deleteFavoriteList(song)
      }
    },
    isLike (song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent()
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .playlist
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    &.body-enter-active, &.body-leave-active
      transition: all .4s
    &.body-enter, &.body-leave-to
      // opacity: 0
      transform: translateY(100%)
    .list
      position absolute
      bottom 0
      width 100%
      color $color-text-l
      background-color $color-highlight-background
      .header
        display flex
        align-items center
        height 50px
        width 100%
        .header-mode
          display flex
          align-items center
          flex 1
          padding-left 16px
          .mode-icon
            color $color-theme
            font-size 28px
          .mode-text
            margin-left 10px
            font-size $font-size-medium
            color $color-text-ll
        .icon-wrapper
          float right
          line-height 50px
          padding-right 20px
          .icon
            margin 6px
      .body-content
        overflow hidden
        height 240px
        .scroll
          height 100%
          .current-icon
            position absolute
            width 40px
            line-height 40px
            color $color-theme
            text-align center
            font-size $font-size-large
          .content-list
            display flex
            height 40px
            line-height 40px
            width 100%
            &.list-enter-active, &.list-leave-active
              transition all .4s linear
            &.list-enter, &.list-leave-to
              height 0
            .list-title
              flex 1
              margin-left 40px
              font-size $font-size-medium
              no-wrap()
            .icon-wrapper
              float right
              line-height 40px
              padding-right 20px
              color $color-theme
              .icon
                margin 6px
              .icon-favorite
                color $color-sub-theme
      .body-bottom
        display flex
        align-items center
        width 100%
        height 80px
        text-align center
        .bottom-disc-wrapper
          height 30px
          width 100%
          .bottom-disc
            height 30px
            line-height 30px
            width 160px
            margin 0 auto
            border 1px solid $color-text-ll
            border-radius 15px
            font-size $font-size-small
      .footer
        width 100%
        height 50px
        line-height 50px
        text-align center
        background-color $color-background
</style>
