import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail (singerId) {
  const url = '/api/getSongData'

  const data = Object.assign({}, {
    '-': 'getSingerSong853378733877024',
    g_tk: 5381,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      comm: {
        ct: 24,
        cv: 0
      },
      singerSongList: {
        method: 'GetSingerSongList',
        param: {
          order: 1,
          singerMid: singerId,
          begin: 0,
          num: 30
        },
        module: 'musichall.song_list_server'
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongUrl (songMid) {
  const url = '/api/getSongData'

  const data = Object.assign({}, commonParams, {
    '-': 'getplaysongvkey7284187107623652',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      req: {
        module: "CDN.SrfCdnDispatchServer",
        method: "GetCdnDispatch",
        param: {
          guid: "579147381",
          calltype: 0,
          userip: ""
        }
      },
      req_0: {
        module: "vkey.GetVkeyServer",
        method: "CgiGetVkey",
        param:{
          guid: "579147381",
          songmid:  [songMid],
          songtype: [0],
          uin:  "0",
          loginflag:  1,
          platform: "20"
        }
      },
      comm: {
        uin: 0,
        format: "json",
        ct: 24,
        cv: 0
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
