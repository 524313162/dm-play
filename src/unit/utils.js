// 通用工具函数

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

export function isMobile() {
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.innerWidth < 860
  )
}

// 初始化全局标记与监听
export function initGlobalDeviceFlag() {
  const update = () => {
    window.__IS_MOBILE__ = isMobile()
  }
  update()
  window.addEventListener('resize', update)
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
