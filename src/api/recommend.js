import axios from 'axios'
import { commonParams } from './config'

export function getRecommend () {
  const url = '/api/getSongData'
  const data = Object.assign({}, commonParams, {
    '-': 'recom05551762753745604',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      comm:{
        ct:24
      },
      focus:{
        module: 'QQMusic.MusichallServer',
        method: 'GetFocus',
        param: {}
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getRecommendList (mid) {
  const url = '/api/getSongData'
  const data = {
    '-': 'albumSonglist19635885138270237',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      comm: {
        ct: 24,
        cv: 10000
      },
      albumSonglist: {
        method: 'GetAlbumSongList',
        param: {
          albumMid: '000e8H6M2E2O8l',
          albumID: 0,
          begin: 0,
          num: 10,
          order: 2
        },
        module: 'music.musichallAlbum.AlbumSongList'
      }
    }
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
