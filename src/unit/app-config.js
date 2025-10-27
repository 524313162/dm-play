// 播放器与弹幕配置集中管理
// 仅保留动态部分在调用处传入，静态与默认项放这里，便于统一维护

// 基础播放器默认配置（除 url, container 由调用处决定）
export const basePlayerOption = {
  setting: true,
  autoSize: false,
  theme: '#23ade5',
  autoplay: true,
  loop: true,
  autoMini: true,
  flip: true,
  playbackRate: true,
  screenshot: true,
  hotkey: true,
  fullscreen: true,
  miniProgressBar: true,
  playsInline: true,
  fastForward: true,
  gesture: true,
  aspectRatio: true,
  autoOrientation: true,
  autoPlayback: true,
  airplay: true,
  volume: 0.7,
  isLive: false, //使用直播模式，会隐藏进度条和播放时间
  lang: 'zh-cn'
}

// HLS 控制插件默认配置
export function createHlsControlOption() {
  return {
    quality: {
      control: true,
      setting: true,
      getName: (level) => `${level.height}P`,
      title: 'Quality',
      auto: 'Auto'
    },
    audio: {
      control: true,
      setting: true,
      getName: (track) => track.name,
      title: 'Audio',
      auto: 'Auto'
    }
  }
}

// Document Picture in Picture 插件默认配置
export function createDocumentPipOption() {
  return {
    width: 480,
    height: 270,
    fallbackToVideoPiP: true,
    placeholder: 'Playing in Document Picture-in-Picture'
  }
}

// 弹幕插件默认配置生成（由调用处传入动态函数和状态）
export function createDanmukuOption({
  danmuOn,
  vodId,
  loadDanmuku,
  sendDanmuToServer,
  filterDanmu,
  beforeVisible,
  mountSelector
}) {
  return {
    danmuku: () => loadDanmuku(), // 支持异步加载
    id: vodId,
    autoplay: danmuOn,
    speed: 5,
    margin: [10, '75%'],
    opacity: 1,
    color: '#FFFFFF',
    mode: 0,
    modes: [0, 1, 2],
    fontSize: 25,
    useWorker: true,
    antiOverlap: true,
    synchronousPlayback: false,
    heatmap: false,
    width: 280,
    points: [],
    filter: (d) => (filterDanmu ? filterDanmu(d) : d.text.length <= 50),
    beforeVisible: (danmu) =>
      beforeVisible ? beforeVisible(danmu) : danmu.text.trim(),
    mount: mountSelector || undefined,
    visible: true,
    emitter: true,
    maxLength: 200,
    lockTime: 5,
    theme: 'dark',
    beforeEmit(danmu) {
      return sendDanmuToServer(danmu)
    }
  }
}

// 自定义类型处理 (m3u8) 可提取为函数以复用
export function createCustomType() {
  return {
    m3u8(video, url, artInstance) {
      try {
        const Hls = require('hls.js')
        if (Hls.isSupported()) {
          if (artInstance.hls) artInstance.hls.destroy()
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          artInstance.hls = hls
          artInstance.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          artInstance.notice.show = 'Unsupported playback format: m3u8'
        }
      } catch (e) {
        artInstance.notice.show = 'Hls.js load error'
        console.error(e)
      }
    }
  }
}

// 汇总创建最终播放器配置（不含 container）
export function createPlayerOption({ url }) {
  return {
    ...basePlayerOption,
    url
  }
}
