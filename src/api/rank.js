import axios from 'axios'
import { commonParams } from 'api/config'

export function getRankData () {
  const url = '/api/getSongData'
  const data = {
    '_': 1574914312497,
    data: {
      comm: {
        g_tk: 5381,
        uin: '',
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        ct: 23,
        cv: 0
      },
      topList: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetAll',
        param: {}
      }
    }
  }
  return axios(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getRankDetail (id, period) {
  const url = '/api/getSongData'
  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI13585293057084047',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      detail: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetDetail',
        param: {
          topId: id,
          offset: 0,
          num: 30,
          period: period
        }
      },
      comm: {
        ct: 24,
        cv: 0
      }
    }
  })
  return axios(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
