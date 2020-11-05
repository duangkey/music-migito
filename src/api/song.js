// import jsonp from '@/common/js/jsonp'
import { commonParams } from './config'
import axios from 'axios'

export function getLyric (mid) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const data = Object({}, commonParams, {
    songmid: mid,
    pcatchetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
