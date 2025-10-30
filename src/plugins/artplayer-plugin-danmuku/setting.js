import style from './style.less'
import danmuOn from './img/danmu-on.svg'
import danmuOff from './img/danmu-off.svg'
import danmuConfig from './img/danmu-config.svg'
import danmuStyle from './img/danmu-style.svg'

export default function setting(art, danmuku, icons, callback) {
  const { option } = danmuku
  const {
    template: { $controlsCenter, $player },
    constructor: {
      SETTING_ITEM_WIDTH,
      utils: {
        removeClass,
        addClass,
        append,
        setStyle,
        // eslint-disable-next-line no-unused-vars
        tooltip,
        query,
        inverseClass,
        getIcon
      }
    }
  } = art

  setStyle($controlsCenter, 'display', 'flex')

  const $danmuOn =
    icons.danmuOn ||
    getIcon('danmu-on', `<img src="${danmuOn}" class="icon-svg" />`)
  const $danmuOff =
    icons.danmuOff ||
    getIcon('danmu-off', `<img src="${danmuOff}" class="icon-svg" />`)
  const $danmuConfig =
    icons.danmuConfig ||
    getIcon('danmu-config', `<img src="${danmuConfig}" class="icon-svg" />`)
  const $danmuStyle =
    icons.danmuStyle ||
    getIcon('danmu-style', `<img src="${danmuStyle}" class="icon-svg" />`)

  let addEmitter = () => {
    const colors = [
      '#FE0302',
      '#FF7204',
      '#FFAA02',
      '#FFD302',
      '#FFFF00',
      '#A0EE00',
      '#00CD00',
      '#019899',
      '#4266BE',
      '#89D5FF',
      '#CC0273',
      '#222222',
      '#9B9B9B',
      '#FFFFFF'
    ].map((item) => {
      const isCurrent = option.color === item ? ' art-current' : ''
      return `<div class="art-danmuku-style-panel-color${isCurrent}" data-color="${item}" style="background-color:${item}"></div>`
    })
    const $emitter = append(
      $controlsCenter,
      `
            <div class="art-danmuku-emitter" style="max-width: ${
              option.maxWidth ? `${option.maxWidth}px` : '100%'
            }">
                <div class="art-danmuku-setting hint--rounded hint--top" data-index="1000" aria-label="关闭弹幕">${$danmuOn}</div>
                <div class="art-danmuku-Wrap">
                    <div class="art-danmuku-left">
                        <div class="art-danmuku-style">
                            <div class="art-danmuku-style-panel">
                                <div class="art-danmuku-style-panel-inner">
                                    <div class="art-danmuku-style-panel-title">模式</div>
                                    <div class="art-danmuku-style-panel-modes">
                                        <div class="art-danmuku-style-panel-mode art-current" data-mode="0">滚动</div>
                                        <div class="art-danmuku-style-panel-mode" data-mode="1">静止</div>
                                    </div>
                                    <div class="art-danmuku-style-panel-title">颜色</div>
                                    <div class="art-danmuku-style-panel-colors">
                                        ${colors.join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input class="art-danmuku-input" maxlength="${
                          option.maxLength
                        }" placeholder="${
        option.placeholder || '发个弹幕见证当下'
      }" />
                        <a href="${
                          option.prot || 'javascript:return;'
                        }" target="_blank" class="art-danmu-prot">弹幕礼仪 ></a>
                    </div>
                    <div class="art-danmuku-send">发送</div>
                </div>
            </div>
            `
    )
    const $dmSetting = query('.art-danmuku-setting', $emitter)
    const $style = query('.art-danmuku-style', $emitter)
    const $input = query('.art-danmuku-input', $emitter)
    const $send = query('.art-danmuku-send', $emitter)
    const $panel = query('.art-danmuku-style-panel-inner', $emitter)
    const $modes = query('.art-danmuku-style-panel-modes', $emitter)
    const $colors = query('.art-danmuku-style-panel-colors', $emitter)
    const $layer =
      option.mount ||
      append($player, '<div class="art-layer-danmuku-emitter"></div>')
    const $inputF = query('.art-danmuku-Wrap', $emitter)

    if (art.option.backdrop) {
      addClass($panel, 'art-backdrop-filter')
    }

    if (option.theme) {
      addClass($emitter, `art-danmuku-theme-${option.theme}`)
    }

    let timer = null
    let { mode, color } = option
    append($style, $danmuStyle)

    let countdown = (time) => {
      if (time <= 0) {
        timer = null
        $send.innerText = '发送'
        removeClass($send, 'art-disabled')
      } else {
        $send.innerText = time + ' s'
        timer = setTimeout(() => countdown(time - 1), 1000)
      }
    }

    let onSend = () => {
      const danmu = {
        mode,
        color,
        border: true,
        text: $input.value.trim()
      }

      if (timer === null && option.beforeEmit(danmu)) {
        $input.value = ''
        danmuku.emit(danmu)
        addClass($send, 'art-disabled')
        countdown(option.lockTime)
        art.emit('artplayerPluginDanmuku:emit', danmu)
      }
    }

    let onResize = () => {
      if ($controlsCenter.clientWidth < option.minWidth) {
        append($layer, $emitter)
        setStyle($layer, 'display', 'flex')
        addClass($emitter, 'art-danmuku-mount')

        if (!option.mount) {
          setStyle($player, 'marginBottom', '40px')
        }
        if (callback) callback('show')
      } else {
        append($controlsCenter, $emitter)
        setStyle($layer, 'display', 'none')
        removeClass($emitter, 'art-danmuku-mount')

        if (!option.mount) {
          setStyle($player, 'marginBottom', null)
        }
        if (callback) callback('hide')
      }
    }
    art.proxy($send, 'click', onSend)

    art.proxy($input, 'keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onSend()
      }
    })

    art.proxy($modes, 'click', (event) => {
      const { dataset } = event.target
      if (dataset.mode) {
        mode = Number(dataset.mode)
        inverseClass(event.target, 'art-current')
      }
    })

    art.proxy($colors, 'click', (event) => {
      const { dataset } = event.target
      if (dataset.color) {
        color = dataset.color
        inverseClass(event.target, 'art-current')
      }
    })

    onResize()
    // art.on('resize', () => {
    //     if (!art.isInput) {
    //         onResize();
    //     }
    // });

    //art.on('fullscreen', (state) => {
    // if (!art.isInput) {
    //     onResize();
    // }
    //});

    art.on('destroy', () => {
      if (option.mount && $emitter.parentElement === option.mount) {
        option.mount.removeChild($emitter)
      }
    })

    art.on('artplayerPluginDanmuku:show', () => {
      showInput()
    })

    art.on('artplayerPluginDanmuku:hide', () => {
      hideInput()
    })
    const framez = document.createElement('div')
    framez.className = 'art-danmuku-frame-disabled-z'
    let showInput = () => {
      art.notice.show = '弹幕显示'
      $dmSetting.setAttribute('aria-label', '弹幕显示')
      $dmSetting.innerHTML =
        typeof $danmuOn == 'string' ? $danmuOn : $danmuOn.outerHTML
      if ($inputF.classList.contains('art-danmuku-frame-disabled')) {
        removeClass($inputF, 'art-danmuku-frame-disabled')
        if (framez) $inputF.removeChild(framez)
      }
    }

    let hideInput = () => {
      art.notice.show = '弹幕隐藏'
      $dmSetting.setAttribute('aria-label', '弹幕关闭')
      $dmSetting.innerHTML =
        typeof $danmuOff == 'string' ? $danmuOff : $danmuOff.outerHTML
      if (!$inputF.classList.contains('art-danmuku-frame-disabled')) {
        addClass($inputF, 'art-danmuku-frame-disabled')
        $inputF.appendChild(framez)
      }
    }
    art.proxy($dmSetting, 'click', (e) => {
      console.log(e)
      if (danmuku.isHide) {
        danmuku.show()
        showInput()
      } else {
        danmuku.hide()
        hideInput()
      }
    })
  }
  let addSetting = () => {
    art.setting.add({
      width: 260,
      name: 'danmuku',
      html: '弹幕设置',
      tooltip: '更多',
      icon: $danmuConfig,
      selector: [
        {
          width: SETTING_ITEM_WIDTH,
          html: '播放速度',
          icon: '',
          tooltip: '适中',
          selector: [
            {
              html: '极慢',
              time: 10
            },
            {
              html: '较慢',
              time: 7.5
            },
            {
              default: true,
              html: '适中',
              time: 5
            },
            {
              html: '较快',
              time: 2.5
            },
            {
              html: '极快',
              time: 1
            }
          ],
          onSelect: function (item) {
            danmuku.config({
              speed: item.time
            })
            return item.html
          }
        },
        {
          width: SETTING_ITEM_WIDTH,
          html: '字体大小',
          icon: '',
          tooltip: '较小',
          selector: [
            {
              html: '极小',
              fontSize: 14
            },
            {
              default: true,
              html: '较小',
              fontSize: 18
            },
            {
              html: '适中',
              fontSize: 22
            },
            {
              html: '较大',
              fontSize: 26
            },
            {
              html: '极大',
              fontSize: 30
            }
          ],
          onSelect: function (item) {
            danmuku.config({
              fontSize: item.fontSize
            })
            return item.html
          }
        },
        {
          width: SETTING_ITEM_WIDTH,
          html: '不透明度',
          icon: '',
          tooltip: '100%',
          selector: [
            {
              default: true,
              opacity: 1,
              html: '100%'
            },
            {
              opacity: 0.75,
              html: '75%'
            },
            {
              opacity: 0.5,
              html: '50%'
            },
            {
              opacity: 0.25,
              html: '25%'
            },
            {
              opacity: 0,
              html: '0%'
            }
          ],
          onSelect: function (item) {
            danmuku.config({
              opacity: item.opacity
            })
            return item.html
          }
        },
        {
          width: SETTING_ITEM_WIDTH,
          html: '显示范围',
          icon: '',
          tooltip: '1/4',
          selector: [
            {
              default: true,
              html: '1/4',
              margin: [10, '75%']
            },
            {
              html: '半屏',
              margin: [10, '50%']
            },
            {
              html: '3/4',
              margin: [10, '25%']
            },
            {
              html: '满屏',
              margin: [10, 10]
            }
          ],
          onSelect: function (item) {
            danmuku.config({
              margin: item.margin
            })
            return item.html
          }
        },
        {
          html: '弹幕防重叠',
          icon: '',
          tooltip: option.antiOverlap ? '开启' : '关闭',
          switch: option.antiOverlap,
          onSwitch(item) {
            danmuku.config({
              antiOverlap: !item.switch
            })
            item.tooltip = item.switch ? '关闭' : '开启'
            return !item.switch
          }
        },
        {
          html: '同步视频速度',
          icon: '',
          tooltip: option.synchronousPlayback ? '开启' : '关闭',
          switch: option.synchronousPlayback,
          onSwitch(item) {
            danmuku.config({
              synchronousPlayback: !item.switch
            })
            item.tooltip = item.switch ? '关闭' : '开启'
            return !item.switch
          }
        }
      ]
    })
    danmuku.config({
      fontSize: 18
    })
  }

  addEmitter()
  //addControl();
  addSetting()
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
