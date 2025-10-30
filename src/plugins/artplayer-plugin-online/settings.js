import style from './style.less'
import Artplayer from 'artplayer'
export default function setting(art, option) {
  const {
    template: { $player },
    constructor: {
      utils: {
        // eslint-disable-next-line no-unused-vars
        removeClass,
        // eslint-disable-next-line no-unused-vars
        addClass,
        append,
        // eslint-disable-next-line no-unused-vars
        setStyle,
        // eslint-disable-next-line no-unused-vars
        tooltip,
        // eslint-disable-next-line no-unused-vars
        query,
        // eslint-disable-next-line no-unused-vars
        inverseClass
      }
    }
  } = art

  const { func } = option
  let $layer = option.mount

  if (!$layer) {
    const $wrap = append($player, '<div class="art-layer-online"></div>')
    $layer = append($wrap, '<span class="art-layer-online-num">1</span>')
    append($wrap, '<span class="art-layer-online-info">人正在观看</span>')
  }

  const key = '__current_online_dmplay'
  if ($layer) {
    const refreshOnLineFun = async () => {
      try {
        const res = await func()
        if (res && typeof res === 'object' && 'data' in res) {
          $layer.innerHTML = res.data
          art.storage.set(key, res.data)
        }
      } catch (e) {
        console.error('获取在线人数失败', e)
      }
    }
    window.ONLINE_INTERVAL = setInterval(async () => {
      refreshOnLineFun()
    }, 1000 * 60)
    refreshOnLineFun()

    const val = art.storage.get(key)
    if (val) {
      $layer.innerHTML = val
    }
    art.on('control', (state) => {
      // state: true=控制栏出现, false=控制栏消失
      const onlineLayer = document.querySelector('.art-layer-online')
      if (onlineLayer) {
        const { isMobile } = Artplayer.utils
        onlineLayer.classList.toggle('mobile', isMobile)
        onlineLayer.classList.toggle('no-controlbar', !state)
      }
    })
  }

  if (
    typeof document !== 'undefined' &&
    !document.getElementById('artplayer-plugin-danmuku')
  ) {
    const $style = document.createElement('style')
    $style.id = 'artplayer-plugin-danmuku'
    $style.textContent = style
    document.head.appendChild($style)
  }
}
