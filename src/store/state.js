import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from './cache'

const state = {
  singer: {},
  disc: {},
  rank: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state
