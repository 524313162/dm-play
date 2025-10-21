// 通用工具函数

export function getQueryParams() {
  const params = {}
  const search = window.location.search.substring(1)
  if (!search) return params
  search.split('&').forEach(item => {
    const [key, value] = item.split('=')
    params[key] = decodeURIComponent(value)
  })
  return params
}

export function isMobile() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}
