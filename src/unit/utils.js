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
