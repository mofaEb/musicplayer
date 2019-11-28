<template>
  <div class="disc">
    <music-list :bgImage="bgImage" :songs="songs" :title="title"></music-list>
  </div>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { getDiscDetail } from 'api/disc'
import { mapGetters } from 'vuex'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'

export default {
  name: 'Disc',
  created () {
    this._getDiscDetail(this.disc.dissid)
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    }
  },
  methods: {
    _getDiscDetail (dissid) {
      if (!this.disc.dissid) {
        this.$router.push(`/recommend`)
        return
      }
      getDiscDetail(dissid).then((res) => {
        if (res.code === ERR_OK) {
          const songlist = res.cdlist[0].songlist
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
    .disc
      position fixed
      z-index 50
      top: 0
      right: 0
      bottom: 0
      left 0
      background-color $color-background
</style>
