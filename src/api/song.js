import { commonParams } from './config'
import axios from 'axios'

export function getSongLyric (mid) {
  const url = '/api/getSongLyric'
  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallback_lrc',
    'pcachetime': Date.now(),
    'songmid': mid,
    'format': 'json',
    'platform': 'yqq.json',
    'needNewCode': 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
