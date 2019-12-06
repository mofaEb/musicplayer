import axios from 'axios'
import { getSongLyric } from 'api/song'
import { Base64 } from 'js-base64'

export class Song {
  constructor ({ id, mid, singer, name, album, duration, image }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
  }
  getUrl () {
    if (this.url) {
      return Promise.resolve(this.url)
    }
    return new Promise((resolve) => {
      axios.get('/api/getSongUrl', {
        params: {
          id: this.mid
        }
      }).then((res) => {
        this.url = res.data.data[this.mid]
        resolve(this.url)
      })
    })
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve) => {
      getSongLyric(this.mid).then((res) => {
        this.lyric = Base64.decode(res.lyric)
        resolve(this.lyric)
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`
  })
}

export function createSearchSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
