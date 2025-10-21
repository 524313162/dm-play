import http from './http'
import { getQueryParams } from './utils'
import CryptoJS from 'crypto-js'

const API_BASE = process.env.VUE_APP_API_BASE || 'https://dmplay.knowhub.vip'
const PLATFORM = process.env.VUE_APP_PLATFORM || 'web'
const SECRET_KEY = process.env.VUE_APP_API_SECRET || 'dmplay_secret'

function getUrlEncry(params = {}) {
  // 按 key 排序，拼接字符串，md5(secret+拼接)
  const keys = Object.keys(params).sort()
  const str = keys.map(k => `${k}=${params[k]}`).join('&')
  const raw = SECRET_KEY + str
  return CryptoJS.MD5(raw).toString()
}

export async function getOnlineCount() {
  const params = getQueryParams()
  const timespan = Date.now()
  const urlEncry = getUrlEncry({ ...params, timespan })
  const url = `${API_BASE}/Online/Index?timespan=${timespan}&urlEncry=${urlEncry}&platform=${PLATFORM}`
  const res = await http.get(url)
  if (res && res.code === 1) return res.data
  return null
}

export async function getConfig() {
  const params = getQueryParams()
  const timespan = Date.now()
  const urlEncry = getUrlEncry({ ...params, timespan })
  const url = `${API_BASE}/api/v1.0/dmplay/config?timespan=${timespan}&urlEncry=${urlEncry}&platform=${PLATFORM}`
  const res = await http.get(url)
  if (res && res.state === 0) return res.data
  return null
}

export async function getAd(id = 1) {
  const params = getQueryParams()
  const timespan = Date.now()
  const urlEncry = getUrlEncry({ ...params, id, timespan })
  const url = `${API_BASE}/api/v1.0/Ads/Index?id=${id}&platform=${PLATFORM}&timespan=${timespan}&urlEncry=${urlEncry}`
  const res = await http.get(url)
  if (res && res.ID) return res
  return null
}

export async function searchMovie(qes) {
  const params = getQueryParams()
  const timespan = Date.now()
  const urlEncry = getUrlEncry({ ...params, qes, timespan })
  const url = `${API_BASE}/api/v1.0/Chat/Index?qes=${encodeURIComponent(qes)}&timespan=${timespan}&urlEncry=${urlEncry}&platform=${PLATFORM}`
  return await http.get(url)
}

export async function getMovieDetail(id) {
  const params = getQueryParams()
  const timespan = Date.now()
  const urlEncry = getUrlEncry({ ...params, id, timespan })
  const url = `${API_BASE}/api/v1.0/dmjx/index?id=${id}&timespan=${timespan}&urlEncry=${urlEncry}&platform=${PLATFORM}`
  return await http.post(url)
}

export async function sendDanmu(data) {
  const config = await getConfig()
  const blackWords = (config && config.blackWords) ? config.blackWords.split(',') : []
  if (blackWords.some(word => data.text.includes(word))) {
    throw new Error('弹幕包含禁止词语')
  }
  const params = getQueryParams()
  const timespan = Date.now()
  const urlEncry = getUrlEncry({ ...params, ...data, timespan })
  const url = `${API_BASE}/api/v1.0/Danmu?timespan=${timespan}&urlEncry=${urlEncry}&platform=${PLATFORM}`
  return await http.post(url, data)
}

export async function getLoadingImages() {
  let covers = []
  covers.push('/static/images/1.webp')
  covers.push('/static/images/2.webp')
  covers.push('/static/images/3.webp')
  covers.push('/static/images/4.webp')
  covers.push('/static/images/5.webp')
  
  return await Promise.resolve(covers)
}

export async function getHotList() {
  // TODO: 替换为真实热播推荐接口
  return [
    { id: 1, name: '热播1', cover: 'https://via.placeholder.com/120x160?text=热播1' },
    { id: 2, name: '热播2', cover: 'https://via.placeholder.com/120x160?text=热播2' },
    { id: 3, name: '热播3', cover: 'https://via.placeholder.com/120x160?text=热播3' },
  ]
}

// 其它API函数（如广告、配置、弹幕、机器人等）后续补全
