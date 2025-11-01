// mock/ad.js
export async function getAdAsync({ id, name = '', platform = 'H5' }) {
  // 模拟不同广告位返回不同广告集合
  const allAds = {
    1: [
      {
        id: 101,
        type: 'script',
        script: "console.log('广告1展示');",
        width: 320,
        height: 100
      },
      {
        id: 102,
        type: 'script',
        script: "console.log('广告2展示');",
        width: 320,
        height: 100
      }
    ],
    2: [
      {
        id: 201,
        type: 'json',
        data: [
          {
            cover: 'https://via.placeholder.com/300x250?text=广告A',
            url: 'https://www.example.com/a'
          },
          {
            cover: 'https://via.placeholder.com/300x250?text=广告B',
            url: 'https://www.example.com/b'
          }
        ],
        width: 300,
        height: 250
      }
    ]
  }
  const ads = allAds[id] || []
  if (ads.length > 0) {
    return {
      msg: `${name || '广告位'}(${id})获取成功，平台：${platform}`,
      state: 1,
      data: ads
    }
  } else {
    return {
      msg: `${name || '广告位'}(${id})无广告，平台：${platform}`,
      state: 0,
      data: []
    }
  }
}
