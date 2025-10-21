// mock/index.js
// 提供与真实 api.js 同名的方法，方便在开发环境切换引用
// 可根据需要继续补充

const randomDelay = (base = 300) => base + Math.random() * 150
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function wrap(data, { delay = randomDelay(), errorRate = 0 } = {}) {
  return sleep(delay).then(() => {
    if (errorRate > 0 && Math.random() < errorRate)
      throw new Error('Mock 网络异常')
    return typeof data === 'function' ? data() : data
  })
}

export async function getOnlineCount() {
  return wrap(Math.floor(30 + Math.random() * 50))
}

export async function getConfig() {
  return wrap({
    notice: '欢迎使用 DMPlay 播放器 (Mock 独立文件)',
    noticeOn: true,
    toolBars: [
      { key: 'robot', title: '求片' },
      { key: 'asset', title: '选集' }
    ],
    danmuOn: true,
    danmuApi: '/api/v1.0/Danmu',
    pageAdScript: '',
    blackWords: 'spam,广告,非法',
    copywriting: ['复制口令 A', '复制口令 B']
  })
}

export async function getAd(id = 1) {
  return wrap({
    ID: id,
    width: 640,
    height: 360,
    Weight: 80,
    Script: 'console.log("Mock 启动广告执行")',
    CloseCode: 'console.log("Mock 广告关闭")'
  })
}

export async function searchMovie(qes) {
  return wrap({
    qes,
    list: [
      {
        id: 1001,
        name: `${qes} 结果一`,
        cover: 'https://via.placeholder.com/120x160?text=Mock1'
      },
      {
        id: 1002,
        name: `${qes} 结果二`,
        cover: 'https://via.placeholder.com/120x160?text=Mock2'
      }
    ]
  })
}

export async function getMovieDetail(id) {
  return wrap({
    id,
    title: `影片 #${id} (Mock)`,
    assets: [
      { name: '线路1', url: 'https://example.com/mock1.m3u8' },
      { name: '线路2', url: 'https://example.com/mock2.m3u8' }
    ],
    desc: '这是一个模拟影片详情。'
  })
}

export async function getDanmuList(vodId) {
  console.log('Mock 获取弹幕列表，视频ID：', vodId)
  return wrap([
    { text: '弹幕一 (Mock)', time: 2, color: '#fff', mode: 0 },
    { text: '弹幕二 (Mock)', time: 5, color: '#ff0', mode: 0 },
    { text: '欢迎光临 (Mock)', time: 8, color: '#0ff', mode: 0 }
  ])
}

export async function sendDanmu(data) {
  const blackWords = 'spam,广告,非法'.split(',')
  if (blackWords.some((w) => data.text.includes(w))) {
    throw new Error('弹幕包含禁止词语 (Mock)')
  }
  return wrap({ code: 1, msg: '发送成功(Mock)' })
}

export async function getLoadingImages() {
  return wrap([
    '/static/images/1.webp',
    '/static/images/2.webp',
    '/static/images/3.webp',
    '/static/images/4.webp',
    '/static/images/5.webp'
  ])
}

export async function getHotList() {
  return wrap([
    {
      id: 1,
      name: '热播1(Mock)',
      cover: 'https://via.placeholder.com/120x160?text=热播1'
    },
    {
      id: 2,
      name: '热播2(Mock)',
      cover: 'https://via.placeholder.com/120x160?text=热播2'
    },
    {
      id: 3,
      name: '热播3(Mock)',
      cover: 'https://via.placeholder.com/120x160?text=热播3'
    }
  ])
}

export const isMock = true
