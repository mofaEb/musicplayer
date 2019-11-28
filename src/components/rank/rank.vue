<template>
  <div class="scroll-wrapper" ref="list">
    <scroll class="rank-scroll" :data="rankGroup" ref="scroll">
      <div class="rank">
        <ul v-for="(rank, rankIndex) in rankGroup" :key="rankIndex">
          <li
            class="rank-list"
            v-for="(list, listIndex) in rank.toplist"
            :key="listIndex"
            @click="selectList(list)"
          >
            <div class="list-img-wrapper">
              <img class="list-img" :src="list.frontPicUrl">
            </div>
            <div class="list-disc-wrapper">
              <p class="list-disc" v-for="(song, songIndex) in list.song" :key="songIndex">
                {{ `${song.rank} ${song.title}-${song.singerName}` }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!rankGroup.length">
        <loading></loading>
      </div>
    </scroll>
    <transition-slide>
      <router-view></router-view>
    </transition-slide>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Rank from 'common/js/rank'
import Loading from 'base/loading/loading'
import TransitionSlide from 'base/transition/transition-slide'
import { getRankData } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  name: 'Rank',
  data () {
    return {
      rankGroup: []
    }
  },
  created () {
    this._getRankData()
  },
  methods: {
    ...mapMutations({
      setRank: 'SET_RANK'
    }),
    selectList (list) {
      this.$router.push(`/rank/${list.topId}`)
      const listData = new Rank({
        id: list.topId,
        title: list.title,
        avatar: list.mbFrontPicUrl,
        period: list.period
      })
      this.setRank(listData)
    },
    _getRankData () {
      getRankData().then((res) => {
        if (res.code === ERR_OK) {
          this.rankGroup = res.topList.data.group
        }
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  components: {
    Scroll,
    Loading,
    TransitionSlide
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .scroll-wrapper
    position fixed
    top 100px
    bottom 0
    width 100%
    .rank-scroll
      overflow hidden
      height 100%
      .rank
        position relative
        width 90%
        margin 10px auto
        .rank-list
          position relative
          display flex
          width 100%
          height 100px
          margin 20px 0
          background-color $color-highlight-background
          .list-img-wrapper
            display inline-block
            height 100px
            .list-img
              height 100%
          .list-disc-wrapper
            position relative
            display inline-block
            overflow hidden
            margin 10px 10px
            width 90%
            color $color-text-l
            font-size $font-size-medium
            .list-disc
              padding 6px
              no-wrap()
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
