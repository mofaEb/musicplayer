<template>
  <div class="singer-detail">
    <music-list
      :bg-image="bgImage"
      :title="title"
      :songs="songs"
    ></music-list>
  </div>
</template>

<script>
import MusicList from '../music-list/music-list'
import { getSingerDetail } from 'api/singer.js'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'

export default {
  name: 'SingerDetail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    bgImage () {
      return this.singer.avatar
    },
    title () {
      return this.singer.name
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail(this.singer.id)
  },
  methods: {
    _getSingerDetail (singerId) {
      if (!singerId) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(singerId).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.singerSongList.data.songList)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { songInfo } = item
        if (songInfo.id && songInfo.mid) {
          ret.push(createSong(songInfo))
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
  @import "~stylus/variable"

  .singer-detail
    position fixed
    z-index 50
    top: 0
    right: 0
    bottom: 0
    left 0
    background-color $color-background
</style>
