// 通用工具函数

import Artplayer from 'artplayer'
import CryptoJS from 'crypto-js/md5'

export function getQueryParams() {
  const params = {}
  const search = window.location.search.substring(1)
  if (!search) return params
  search.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    params[key] = decodeURIComponent(value)
  })
  return params
}

// 初始化全局标记与监听
export function initGlobalDeviceFlag() {
  window.__IS_MOBILE__ = Artplayer.utils.isMobile
  // 暴露一个全局函数
  window.isMobile = () => window.__IS_MOBILE__
}

// 全局系统配置，集中管理可调整的 UI 尺寸等
export const system = {
  toolbarHeight: 60
}

export function initGlobalSystemConfig() {
  if (!window.system) {
    window.system = system
  } else {
    // 合并，保持已有引用
    Object.assign(window.system, system)
  }
}

export function getMd5(str) {
  return CryptoJS(str).toString()
}

/**
 * 随机获取广告（支持权重）
 * @param {Array} adArr - 广告数组，每个元素可有 weight 字段
 * @returns {*} 随机选中的广告或 undefined
 */
export function getRandomAdByWeight(adArr) {
  if (!Array.isArray(adArr) || adArr.length === 0) return undefined
  const totalWeight = adArr.reduce(
    (sum, item) => sum + (typeof item.weight === 'number' ? item.weight : 1),
    0
  )
  if (totalWeight <= 0) return adArr[Math.floor(Math.random() * adArr.length)]
  let rand = Math.random() * totalWeight
  for (const item of adArr) {
    const w = typeof item.weight === 'number' ? item.weight : 1
    if (rand < w) return item
    rand -= w
  }
  return adArr[adArr.length - 1]
}

/**
 * 返回 [min, max] 区间的随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number}
 */
export function random(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
