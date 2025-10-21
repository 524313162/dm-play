import axios from 'axios'

const http = axios.create({
  timeout: 10000,
})

http.interceptors.response.use(
  res => res.data,
  err => {
    if (typeof window !== 'undefined') {
      window.alert('网络请求失败：' + (err?.message || '未知错误'))
    }
    return Promise.reject(err)
  }
)

export default http
