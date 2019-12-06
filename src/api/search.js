import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams } from './config'

export function getHotKey () {
  const url = '/api/getHotKey'
  const data = Object.assign({}, commonParams, {
    format: 'json',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSearchData (keyWord, page, zhida, perpage) {
  const url = '/api/getSearchData'
  const data = Object.assign({}, commonParams, {
    w: keyWord,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    _: 1575010971227,
    uin: '',
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
