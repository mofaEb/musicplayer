import { commonParams } from './config'
import axios from 'axios'

export function getDiscDetail (mid) {
  const url = '/api/getDiscDetail'
  const data = Object.assign({}, commonParams, {
    'type': 1,
    'json': 1,
    'utf8': 1,
    'onlysong': 0,
    'new_format': 1,
    'disstid': mid,
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
