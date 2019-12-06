import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { setRandomList } from 'common/js/util'
import SearchList from 'base/search-list/search-list'
import SearchBox from 'base/search-box/search-box'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    modeIcon () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'currentIndex',
      'mode'
    ])
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    changeMode () {
      const newMode = (this.mode + 1) % 3
      this.setPlayMode(newMode)
      let list = null
      if (this.mode === playMode.random) {
        list = setRandomList(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      const currentIndex = this.resetCurrentIndex(list)
      this.setPlayList(list)
      this.setCurrentIndex(currentIndex)
    },
    resetCurrentIndex (list) {
      return list.findIndex(item => item.id === this.currentSong.id)
    }
  }
}

export const searchMixin = {
  data () {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'playHistory'
    ])
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'deleteSearchHistory',
      'saveSearchHistory',
      'insertSong'
    ])
  },
  components: {
    SearchList,
    SearchBox
  }
}
