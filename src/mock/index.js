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
  return wrap({ data: Math.floor(30 + Math.random() * 50) })
}

export async function getConfig() {
  return wrap({
    temp: null,
    msg: null,
    data: {
      ad: {
        startAds: [],
        pauseAds: [],
        toolBars: [
          {
            key: 'zyz',
            title: 'DMPlay',
            tip: '好用的播放器',
            hots: '',
            icon: '',
            link: 'https://dmplay.knowhub.vip'
          }
        ],
        copywriting: [
          'l:/RbsNVUM908Y 或复制此消息打开支付宝搜索，快来领碰一下支付红包啦  u:/z ZH6213 2021/05/08'
        ],
        jumpLink: [],
        pageAd:
          "var sawaid = 'TIM'+Math.floor(Math.random() * 10000);\r\nvar sd3 = document.createElement(\"SD3MTI\");\r\nsd3.id = sawaid;\r\nvar sc =  document.createElement(\"script\");\r\nsc.setAttribute('src','https://ssl.zax01.com/o.php?id=8199');\r\ndocument.body.appendChild(sd3);\r\ndocument.body.appendChild(sc);"
      },
      notice:
        '通知：视频上的博彩广告请勿相信，该广告是视频资源自带，播放器无法去除，请大家不要上当受骗，合作资源站资源资源迎来重大更新，欢迎大家采集哦。若有不会采集可联系我免费帮忙配置，及播放器配置。若支持逗喵资源就点点下面的广告吧，播放器不收取任何费用，',
      noticeOn: true,
      danmuApi: 'https://dmplay.knowhub.vip/api/v1.0/Danmu',
      danmuOn: true,
      danmuRule: '/Article/detail/1',
      danmuTip: '请文明发言！',
      blackWords: '他妈',
      crashCode: null
    },
    state: 0
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
    msg: qes,
    data: {
      content: [
        {
          id: 445609,
          name: '少年歌行'
        },
        {
          id: 489023,
          name: '少年歌行'
        },
        {
          id: 438000,
          name: '少年歌行海外仙山篇'
        },
        {
          id: 510146,
          name: '少年歌行番外篇之少年事'
        },
        {
          id: 431266,
          name: '少年歌行外传：暗河传'
        },
        {
          id: 430021,
          name: '少年歌行 风花雪月篇'
        },
        {
          id: 528589,
          name: '少年歌行风花雪月篇'
        },
        {
          id: 438035,
          name: '少年歌行 海外仙山篇'
        },
        {
          id: 609496,
          name: '少年歌行 血染天启篇'
        },
        {
          id: 453048,
          name: '少年歌行 风花雪月篇[电影解说]'
        }
      ],
      time: '2025/10/30 15:19:48',
      type: 3,
      act: 'rec'
    },
    state: 1
  })
}

export async function getMovieDetail(id) {
  return wrap({
    msg: null,
    data: {
      id: null,
      title: '少年歌行 - ' + id,
      vol: -2,
      urls: [
        'https://cdn.wlcdn99.com:777/LVTn1wou/index.m3u8',
        'https://s8.fsvod1.com/20230122/xDOBrf7A/index.m3u8',
        'https://v8.dious.cc/20230122/bmZvM3fH/index.m3u8',
        'https://play.xluuss.com/play/9av96jre/index.m3u8'
      ],
      url: 'https://cdn.wlcdn99.com:777/LVTn1wou/index.m3u8',
      asset: 'kk6',
      assets: [
        {
          key: 'kk6',
          name: '线路6',
          urls: [
            {
              tip: '第01集',
              url: 'https://cdn.wlcdn99.com:777/NiVZzRe1/index.m3u8'
            },
            {
              tip: '第02集',
              url: 'https://cdn.wlcdn99.com:777/ty0IHiBF/index.m3u8'
            },
            {
              tip: '第03集',
              url: 'https://cdn.wlcdn99.com:777/TE2vLcIn/index.m3u8'
            },
            {
              tip: '第04集',
              url: 'https://cdn.wlcdn99.com:777/WNO5gvIn/index.m3u8'
            },
            {
              tip: '第05集',
              url: 'https://cdn.wlcdn99.com:777/UpCVYS5b/index.m3u8'
            },
            {
              tip: '第06集',
              url: 'https://cdn.wlcdn99.com:777/XHqmc3Pw/index.m3u8'
            },
            {
              tip: '第07集',
              url: 'https://cdn.wlcdn99.com:777/CTNv2mWl/index.m3u8'
            },
            {
              tip: '第08集',
              url: 'https://cdn.wlcdn99.com:777/oXFktqQy/index.m3u8'
            },
            {
              tip: '第09集',
              url: 'https://cdn.wlcdn99.com:777/X0oK8JSQ/index.m3u8'
            },
            {
              tip: '第10集',
              url: 'https://cdn.wlcdn99.com:777/qxJibpIC/index.m3u8'
            },
            {
              tip: '第11集',
              url: 'https://cdn.wlcdn99.com:777/Kt2SpRj5/index.m3u8'
            },
            {
              tip: '第12集',
              url: 'https://cdn.wlcdn99.com:777/zycMt7aL/index.m3u8'
            },
            {
              tip: '第13集',
              url: 'https://cdn.wlcdn99.com:777/8n9xWhHY/index.m3u8'
            },
            {
              tip: '第14集',
              url: 'https://cdn.wlcdn99.com:777/yuV0Dmic/index.m3u8'
            },
            {
              tip: '第15集',
              url: 'https://cdn.wlcdn99.com:777/TdMuDK7B/index.m3u8'
            },
            {
              tip: '第16集',
              url: 'https://cdn.wlcdn99.com:777/Ylw1cWBK/index.m3u8'
            },
            {
              tip: '第17集',
              url: 'https://cdn.wlcdn99.com:777/rxNMD6y4/index.m3u8'
            },
            {
              tip: '第18集',
              url: 'https://cdn.wlcdn99.com:777/iEb5UlzD/index.m3u8'
            },
            {
              tip: '第19集',
              url: 'https://cdn.wlcdn99.com:777/S2MlUyps/index.m3u8'
            },
            {
              tip: '第20集',
              url: 'https://cdn.wlcdn99.com:777/sY43FnR9/index.m3u8'
            },
            {
              tip: '第21集',
              url: 'https://cdn.wlcdn99.com:777/3jXIYtJA/index.m3u8'
            },
            {
              tip: '第22集',
              url: 'https://cdn.wlcdn99.com:777/AiOlxu2C/index.m3u8'
            },
            {
              tip: '第23集',
              url: 'https://cdn.wlcdn99.com:777/gP1QFMmp/index.m3u8'
            },
            {
              tip: '第24集',
              url: 'https://cdn.wlcdn99.com:777/0BilKqfu/index.m3u8'
            },
            {
              tip: '第25集',
              url: 'https://cdn.wlcdn99.com:777/rfKjHeQP/index.m3u8'
            },
            {
              tip: '第26集',
              url: 'https://cdn.wlcdn99.com:777/1qPnZGJ9/index.m3u8'
            },
            {
              tip: '第27集',
              url: 'https://cdn.wlcdn99.com:777/fqJBWQrh/index.m3u8'
            },
            {
              tip: '第28集',
              url: 'https://cdn.wlcdn99.com:777/FjuOJhKk/index.m3u8'
            },
            {
              tip: '第29集',
              url: 'https://cdn.wlcdn99.com:777/vGVbEkwm/index.m3u8'
            },
            {
              tip: '第30集',
              url: 'https://cdn.wlcdn99.com:777/hN2ofCb4/index.m3u8'
            },
            {
              tip: '第31集',
              url: 'https://cdn.wlcdn99.com:777/HrjFJEZG/index.m3u8'
            },
            {
              tip: '第32集',
              url: 'https://cdn.wlcdn99.com:777/Qi6VPkNz/index.m3u8'
            },
            {
              tip: '第33集',
              url: 'https://cdn.wlcdn99.com:777/dFlmAcaK/index.m3u8'
            },
            {
              tip: '第34集',
              url: 'https://cdn.wlcdn99.com:777/a5BDrS2L/index.m3u8'
            },
            {
              tip: '第35集',
              url: 'https://cdn.wlcdn99.com:777/CInLhlVv/index.m3u8'
            },
            {
              tip: '第36集',
              url: 'https://cdn.wlcdn99.com:777/9MAJRaSo/index.m3u8'
            },
            {
              tip: '第37集',
              url: 'https://cdn.wlcdn99.com:777/5ktWu4lX/index.m3u8'
            },
            {
              tip: '第38集',
              url: 'https://cdn.wlcdn99.com:777/u1pjGF7M/index.m3u8'
            },
            {
              tip: '第39集',
              url: 'https://cdn.wlcdn99.com:777/iD1ckP8O/index.m3u8'
            },
            {
              tip: '第40集',
              url: 'https://cdn.wlcdn99.com:777/LVTn1wou/index.m3u8'
            }
          ]
        },
        {
          key: 'kk2',
          name: '线路2',
          urls: [
            {
              tip: '第01集',
              url: 'https://s8.fsvod1.com/20221226/7p7OBsd7/index.m3u8'
            },
            {
              tip: '第02集',
              url: 'https://s8.fsvod1.com/20221226/mEnAEBVM/index.m3u8'
            },
            {
              tip: '第03集',
              url: 'https://s8.fsvod1.com/20221226/MjbcAxuu/index.m3u8'
            },
            {
              tip: '第04集',
              url: 'https://s8.fsvod1.com/20221226/BqGjaAAr/index.m3u8'
            },
            {
              tip: '第05集',
              url: 'https://s8.fsvod1.com/20221226/ebUbRMwm/index.m3u8'
            },
            {
              tip: '第06集',
              url: 'https://s8.fsvod1.com/20221227/ftMburcb/index.m3u8'
            },
            {
              tip: '第07集',
              url: 'https://s8.fsvod1.com/20221227/ie9hjbiC/index.m3u8'
            },
            {
              tip: '第08集',
              url: 'https://s8.fsvod1.com/20221228/eQUS51KW/index.m3u8'
            },
            {
              tip: '第09集',
              url: 'https://s8.fsvod1.com/20221228/utI0nlgb/index.m3u8'
            },
            {
              tip: '第10集',
              url: 'https://s8.fsvod1.com/20221229/lHgYYLwJ/index.m3u8'
            },
            {
              tip: '第11集',
              url: 'https://s8.fsvod1.com/20221229/XzKJRNXs/index.m3u8'
            },
            {
              tip: '第12集',
              url: 'https://s8.fsvod1.com/20221230/Hf2bEN8u/index.m3u8'
            },
            {
              tip: '第13集',
              url: 'https://s8.fsvod1.com/20230102/PlHeetvk/index.m3u8'
            },
            {
              tip: '第14集',
              url: 'https://s8.fsvod1.com/20230102/fOJNAY8j/index.m3u8'
            },
            {
              tip: '第15集',
              url: 'https://s8.fsvod1.com/20230103/xUndzytv/index.m3u8'
            },
            {
              tip: '第16集',
              url: 'https://s8.fsvod1.com/20230103/wKrh1CCt/index.m3u8'
            },
            {
              tip: '第17集',
              url: 'https://s8.fsvod1.com/20230104/WuNNTMUY/index.m3u8'
            },
            {
              tip: '第18集',
              url: 'https://s8.fsvod1.com/20230104/4QoxHhcX/index.m3u8'
            },
            {
              tip: '第19集',
              url: 'https://s8.fsvod1.com/20230105/1DFG0FLR/index.m3u8'
            },
            {
              tip: '第20集',
              url: 'https://s8.fsvod1.com/20230105/z6nSl8y3/index.m3u8'
            },
            {
              tip: '第21集',
              url: 'https://s8.fsvod1.com/20230106/CenodklZ/index.m3u8'
            },
            {
              tip: '第22集',
              url: 'https://s8.fsvod1.com/20230109/TozZEssj/index.m3u8'
            },
            {
              tip: '第23集',
              url: 'https://s8.fsvod1.com/20230109/CSaRMSa9/index.m3u8'
            },
            {
              tip: '第24集',
              url: 'https://s8.fsvod1.com/20230110/glNCT1lw/index.m3u8'
            },
            {
              tip: '第25集',
              url: 'https://s8.fsvod1.com/20230110/h7QGRHNY/index.m3u8'
            },
            {
              tip: '第26集',
              url: 'https://s8.fsvod1.com/20230111/LoRHwn2g/index.m3u8'
            },
            {
              tip: '第27集',
              url: 'https://s8.fsvod1.com/20230112/1pNaPMQa/index.m3u8'
            },
            {
              tip: '第28集',
              url: 'https://s8.fsvod1.com/20230113/Lp6qcOTr/index.m3u8'
            },
            {
              tip: '第29集',
              url: 'https://s8.fsvod1.com/20230116/R4NXZs2Z/index.m3u8'
            },
            {
              tip: '第30集',
              url: 'https://s8.fsvod1.com/20230116/V8568uL0/index.m3u8'
            },
            {
              tip: '第31集',
              url: 'https://s8.fsvod1.com/20230117/iA0Tg3UL/index.m3u8'
            },
            {
              tip: '第32集',
              url: 'https://s8.fsvod1.com/20230117/6urjKDHc/index.m3u8'
            },
            {
              tip: '第33集',
              url: 'https://s8.fsvod1.com/20230118/Xr170yCo/index.m3u8'
            },
            {
              tip: '第34集',
              url: 'https://s8.fsvod1.com/20230119/iYHGyhbM/index.m3u8'
            },
            {
              tip: '第35集',
              url: 'https://s8.fsvod1.com/20230120/id48HKDI/index.m3u8'
            },
            {
              tip: '第36集',
              url: 'https://s8.fsvod1.com/20230122/CfG0szXI/index.m3u8'
            },
            {
              tip: '第37集',
              url: 'https://s8.fsvod1.com/20230122/ht6M9T0Z/index.m3u8'
            },
            {
              tip: '第38集',
              url: 'https://s8.fsvod1.com/20230122/9H16Dx5L/index.m3u8'
            },
            {
              tip: '第39集',
              url: 'https://s8.fsvod1.com/20230122/8D9tA1XC/index.m3u8'
            },
            {
              tip: '第40集',
              url: 'https://s8.fsvod1.com/20230122/xDOBrf7A/index.m3u8'
            }
          ]
        },
        {
          key: 'kk4',
          name: '线路4',
          urls: [
            {
              tip: '第01集',
              url: 'https://v8.dious.cc/20221226/pZ3U6Q1C/index.m3u8'
            },
            {
              tip: '第02集',
              url: 'https://v8.dious.cc/20221226/nROfDoYb/index.m3u8'
            },
            {
              tip: '第03集',
              url: 'https://v8.dious.cc/20221226/t6Pucdqf/index.m3u8'
            },
            {
              tip: '第04集',
              url: 'https://v8.dious.cc/20221226/004u4vKj/index.m3u8'
            },
            {
              tip: '第05集',
              url: 'https://v8.dious.cc/20221226/47R5PPmJ/index.m3u8'
            },
            {
              tip: '第06集',
              url: 'https://v8.dious.cc/20221227/MUuzQd1B/index.m3u8'
            },
            {
              tip: '第07集',
              url: 'https://v8.dious.cc/20221227/AYuEKaZ9/index.m3u8'
            },
            {
              tip: '第08集',
              url: 'https://v8.dious.cc/20221228/qtc63tVI/index.m3u8'
            },
            {
              tip: '第09集',
              url: 'https://v8.dious.cc/20221228/Cgmfta21/index.m3u8'
            },
            {
              tip: '第10集',
              url: 'https://v8.dious.cc/20221229/MWijat4x/index.m3u8'
            },
            {
              tip: '第11集',
              url: 'https://v8.dious.cc/20221229/uoShylfg/index.m3u8'
            },
            {
              tip: '第12集',
              url: 'https://v8.dious.cc/20221230/EQjOI1BG/index.m3u8'
            },
            {
              tip: '第13集',
              url: 'https://v8.dious.cc/20230102/NXTlhfyS/index.m3u8'
            },
            {
              tip: '第14集',
              url: 'https://v8.dious.cc/20230102/heOAQMdS/index.m3u8'
            },
            {
              tip: '第15集',
              url: 'https://v8.dious.cc/20230103/t7zp3NuD/index.m3u8'
            },
            {
              tip: '第16集',
              url: 'https://v8.dious.cc/20230103/hUtcMlVY/index.m3u8'
            },
            {
              tip: '第17集',
              url: 'https://v8.dious.cc/20230104/J024oxVe/index.m3u8'
            },
            {
              tip: '第18集',
              url: 'https://v8.dious.cc/20230104/amdZkp56/index.m3u8'
            },
            {
              tip: '第19集',
              url: 'https://v8.dious.cc/20230105/ZdlwpWwM/index.m3u8'
            },
            {
              tip: '第20集',
              url: 'https://v8.dious.cc/20230105/fSkX5Dcf/index.m3u8'
            },
            {
              tip: '第21集',
              url: 'https://v8.dious.cc/20230106/1iWcVtmf/index.m3u8'
            },
            {
              tip: '第22集',
              url: 'https://v8.dious.cc/20230109/wAB3ey0b/index.m3u8'
            },
            {
              tip: '第23集',
              url: 'https://v8.dious.cc/20230109/jTr9BWa9/index.m3u8'
            },
            {
              tip: '第24集',
              url: 'https://v8.dious.cc/20230110/WrxwnLiW/index.m3u8'
            },
            {
              tip: '第25集',
              url: 'https://v8.dious.cc/20230110/nZ1EVW7b/index.m3u8'
            },
            {
              tip: '第26集',
              url: 'https://v8.dious.cc/20230111/yluvELfM/index.m3u8'
            },
            {
              tip: '第27集',
              url: 'https://v8.dious.cc/20230112/3EoRaFYx/index.m3u8'
            },
            {
              tip: '第28集',
              url: 'https://v8.dious.cc/20230113/jTrEp25R/index.m3u8'
            },
            {
              tip: '第29集',
              url: 'https://v8.dious.cc/20230116/7PFcGAX6/index.m3u8'
            },
            {
              tip: '第30集',
              url: 'https://v8.dious.cc/20230116/2jvHCfP8/index.m3u8'
            },
            {
              tip: '第31集',
              url: 'https://v8.dious.cc/20230117/EHxMLNhA/index.m3u8'
            },
            {
              tip: '第32集',
              url: 'https://v8.dious.cc/20230117/aOx1Q7ir/index.m3u8'
            },
            {
              tip: '第33集',
              url: 'https://v8.dious.cc/20230118/Qbh5ZdAl/index.m3u8'
            },
            {
              tip: '第34集',
              url: 'https://v8.dious.cc/20230119/zdbyh9l7/index.m3u8'
            },
            {
              tip: '第35集',
              url: 'https://v8.dious.cc/20230120/yao5p1TD/index.m3u8'
            },
            {
              tip: '第36集',
              url: 'https://v8.dious.cc/20230122/q0z11v7C/index.m3u8'
            },
            {
              tip: '第37集',
              url: 'https://v8.dious.cc/20230122/BJzrT0nT/index.m3u8'
            },
            {
              tip: '第38集',
              url: 'https://v8.dious.cc/20230122/r7F5s2b6/index.m3u8'
            },
            {
              tip: '第39集',
              url: 'https://v8.dious.cc/20230122/TaAmpjCA/index.m3u8'
            },
            {
              tip: '第40集',
              url: 'https://v8.dious.cc/20230122/bmZvM3fH/index.m3u8'
            }
          ]
        },
        {
          key: 'kk7',
          name: '线路7',
          urls: [
            {
              tip: '第1集',
              url: 'https://play.xluuss.com/play/oeEKP1vb/index.m3u8'
            },
            {
              tip: '第2集',
              url: 'https://play.xluuss.com/play/1aM79NAd/index.m3u8'
            },
            {
              tip: '第3集',
              url: 'https://play.xluuss.com/play/PdR8Lkqa/index.m3u8'
            },
            {
              tip: '第4集',
              url: 'https://play.xluuss.com/play/QeZZWvJe/index.m3u8'
            },
            {
              tip: '第5集',
              url: 'https://play.xluuss.com/play/7e5AWVBe/index.m3u8'
            },
            {
              tip: '第6集',
              url: 'https://play.xluuss.com/play/Pdyp6Vnb/index.m3u8'
            },
            {
              tip: '第7集',
              url: 'https://play.xluuss.com/play/1aM7ELGd/index.m3u8'
            },
            {
              tip: '第8集',
              url: 'https://play.xluuss.com/play/Qe1VEXma/index.m3u8'
            },
            {
              tip: '第9集',
              url: 'https://play.xluuss.com/play/9b6YGDRa/index.m3u8'
            },
            {
              tip: '第10集',
              url: 'https://play.xluuss.com/play/oeEKWm0b/index.m3u8'
            },
            {
              tip: '第11集',
              url: 'https://play.xluuss.com/play/Pdyp2xPb/index.m3u8'
            },
            {
              tip: '第12集',
              url: 'https://play.xluuss.com/play/PdR8B1Ra/index.m3u8'
            },
            {
              tip: '第13集',
              url: 'https://play.xluuss.com/play/9avmzqne/index.m3u8'
            },
            {
              tip: '第14集',
              url: 'https://play.xluuss.com/play/nel8mQje/index.m3u8'
            },
            {
              tip: '第15集',
              url: 'https://play.xluuss.com/play/PdypyMzb/index.m3u8'
            },
            {
              tip: '第16集',
              url: 'https://play.xluuss.com/play/oeEKpGmb/index.m3u8'
            },
            {
              tip: '第17集',
              url: 'https://play.xluuss.com/play/1aM7n3Od/index.m3u8'
            },
            {
              tip: '第18集',
              url: 'https://play.xluuss.com/play/PdR8vEOa/index.m3u8'
            },
            {
              tip: '第19集',
              url: 'https://play.xluuss.com/play/9avmBM8e/index.m3u8'
            },
            {
              tip: '第20集',
              url: 'https://play.xluuss.com/play/nel8oyMe/index.m3u8'
            },
            {
              tip: '第21集',
              url: 'https://play.xluuss.com/play/1aM7GpBd/index.m3u8'
            },
            {
              tip: '第22集',
              url: 'https://play.xluuss.com/play/oeEKYEmb/index.m3u8'
            },
            {
              tip: '第23集',
              url: 'https://play.xluuss.com/play/1aM7kPPd/index.m3u8'
            },
            {
              tip: '第24集',
              url: 'https://play.xluuss.com/play/PdypZpgb/index.m3u8'
            },
            {
              tip: '第25集',
              url: 'https://play.xluuss.com/play/oeEKJK4b/index.m3u8'
            },
            {
              tip: '第26集',
              url: 'https://play.xluuss.com/play/5eVJ1Pze/index.m3u8'
            },
            {
              tip: '第27集',
              url: 'https://play.xluuss.com/play/RdGQnX3a/index.m3u8'
            },
            {
              tip: '第28集',
              url: 'https://play.xluuss.com/play/0dN59OKb/index.m3u8'
            },
            {
              tip: '第29集',
              url: 'https://play.xluuss.com/play/penNYOEe/index.m3u8'
            },
            {
              tip: '第30集',
              url: 'https://play.xluuss.com/play/nelMvp5a/index.m3u8'
            },
            {
              tip: '第31集',
              url: 'https://play.xluuss.com/play/Xe0XXDLe/index.m3u8'
            },
            {
              tip: '第32集',
              url: 'https://play.xluuss.com/play/oeE661ga/index.m3u8'
            },
            {
              tip: '第33集',
              url: 'https://play.xluuss.com/play/zbqMMG0b/index.m3u8'
            },
            {
              tip: '第34集',
              url: 'https://play.xluuss.com/play/PdR5wBwb/index.m3u8'
            },
            {
              tip: '第35集',
              url: 'https://play.xluuss.com/play/penN834e/index.m3u8'
            },
            {
              tip: '第36集',
              url: 'https://play.xluuss.com/play/YerM6w6d/index.m3u8'
            },
            {
              tip: '第37集',
              url: 'https://play.xluuss.com/play/Xe0XB6Xe/index.m3u8'
            },
            {
              tip: '第38集',
              url: 'https://play.xluuss.com/play/nelMWpla/index.m3u8'
            },
            {
              tip: '第39集',
              url: 'https://play.xluuss.com/play/zbqMW23b/index.m3u8'
            },
            {
              tip: '第40集',
              url: 'https://play.xluuss.com/play/PdyJWmVe/index.m3u8'
            },
            {
              tip: '彩蛋1',
              url: 'https://play.xluuss.com/play/penNWzle/index.m3u8'
            },
            {
              tip: '彩蛋2',
              url: 'https://play.xluuss.com/play/9av96jre/index.m3u8'
            }
          ]
        }
      ]
    },
    state: 1
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
