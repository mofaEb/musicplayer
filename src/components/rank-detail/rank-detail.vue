<template>
  <div class="rank-detail">
    <music-list :isTopRank="isTopRank" :bgImage="bgImage" :songs="songs" :title="title"></music-list>
  </div>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'
import { getRankDetail } from 'api/rank'

export default {
  name: 'Disc',
  created () {
    this._getRankDetail(this.rank)
  },
  data () {
    return {
      songs: [],
      isTopRank: true
    }
  },
  computed: {
    ...mapGetters([
      'rank'
    ]),
    title () {
      return this.rank.title
    },
    bgImage () {
      return this.rank.avatar
    }
  },
  methods: {
    _getRankDetail (data) {
      if (!data.id) {
        this.$router.push('/rank')
        return
      }
      getRankDetail(data.id, data.period).then((res) => {
        if (res.code === ERR_OK) {
          const songlist = res.detail.data.songInfoList
          this.songs = this._normalizeSongs(songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        if (item.id && item.mid) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
    .rank-detail
      position fixed
      z-index 50
      top: 0
      right: 0
      bottom: 0
      left 0
      background-color $color-background
</style>
