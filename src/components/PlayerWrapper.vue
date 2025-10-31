<template>
  <div class="player-wrapper" :class="{ mobile: isMobile }">
    <LoadingCover ref="loadingRef" />
    <NoticeBar v-if="notice" :notice="notice" />
    <NMessage ref="msgRef" />
    <component :is="playerComponent" v-bind="playerProps" @get-instance="onGetInstance" />
  </div>
  <ToolBar ref="toolbarRef" :toolBars="toolBars" :onOpenRobot="openRobot"></ToolBar>
  <RobotDrawer :show="robotVisible" @close="onRobotClose" @select="onRobotSelect" />
  <AssetPicker ref="assetPickerRef" :assets="assetList" :active="assetActive" @selectAsset="selectAsset"
    @selectVol="selectVol" @close="closeAssetPicker" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NoticeBar from './NoticeBar.vue'
import LoadingCover from './LoadingCover.vue'
import ArtPlayer from './ArtPlayer.vue'
import LivePlayer from './LivePlayer.vue'
import ToolBar from './ToolBarCustom.vue'
import NMessage from './NMessage.vue'
import RobotDrawer from './RobotDrawer.vue'
import AssetPicker from './AssetPicker.vue'
import { getConfig, getOnlineCount, getMovieDetail } from '../mock/index.js'
import { initGlobalSystemConfig, getMd5 } from '../unit/utils.js'

const props = defineProps({
  isLive: { type: Boolean, default: false },
  url: { type: String, default: '' }
})
const notice = ref('')
const config = ref(null)
const toolBars = ref([])
const msgRef = ref(null)
const loadingRef = ref(null)
const toolbarRef = ref(null)
const robotVisible = ref(false)
let assetActive = ref({ asset: '', vol: 1 })
let assetList = ref([])
let artInstance = null
let wasPlaying = false
let isMobile = window.isMobile()
const assetPickerRef = ref(null)

// 初始化, 加载配置
onMounted(async () => {
  initGlobalSystemConfig()
  msgRef.value?.updateLine('player', { text: '初始化播放器...', status: 'loading' })
  try {
    config.value = (await getConfig()).data || {}
    notice.value = config.value?.notice || ''
    msgRef.value?.updateLine('player', { text: '播放器准备就绪', status: 'success' })
  } catch (e) {
    msgRef.value?.updateLine('player', { text: '配置加载失败', status: 'error' })
    console.error(e)
  }
})

const playerComponent = computed(() => (props.isLive ? LivePlayer : ArtPlayer))

// 自定义菜单
const customControls = computed(() => {
  if (isMobile) return []
  return [{
    position: 'right',
    html: "<i class='iconfont icon-duihuajiqiren1'></i>",
    tooltip: '影片查找',
    style: { color: '#fff' },
    click: function () {
      if (artInstance) {
        openRobot()
      }
    }
  }]
})

const playerProps = computed(() => {
  if (props.isLive) {
    return { url: props.url }
  }
  return {
    option: { url: props.url },
    danmuApi: config.value?.danmuApi || '',
    danmuOn: !!config.value?.danmuOn,
    vodId: props.url ? getMd5(props.url) : '',
    mountSelector: toolbarRef.value?.mountSelector,
    customControls: customControls.value,
    onlineFunc: async () => {
      return await getOnlineCount()
    }
  }
})

function onGetInstance(art) {
  artInstance = art
  loadingRef.value?.show()
  art.on('video:loadeddata', () => {
    msgRef.value?.updateLine('video', { text: '视频数据加载中...', status: 'loading' })
  })
  art.on('video:waiting', () => {
    msgRef.value?.updateLine('video', { text: '视频缓冲...', status: 'loading', visible: true })
  })
  art.on('video:loadedmetadata', () => {
    msgRef.value?.updateLine('video', { text: '视频加载 [成功] .', status: 'success' })
    setTimeout(ifPlay, 1000);
  })
  art.on('artplayerPluginDanmuku:load', () => {
    msgRef.value?.updateLine('danmaku', { text: '弹幕加载...', status: 'loading' })
  })
  art.on('artplayerPluginDanmuku:loaded', () => {
    msgRef.value?.updateLine('danmaku', { text: '弹幕加载 [成功] .', status: 'success' })
  })
  art.on('artplayerPluginDanmuku:error', () => {
    msgRef.value?.updateLine('danmaku', { text: '弹幕加载 [错误] .', status: 'success' })
  })
  art.on('restart', () => {
    msgRef.value?.updateLine('video', { text: '视频重新开始 .', status: 'loading', visible: true })
  })
  art.on('error', (err) => {
    msgRef.value?.updateLine('video', { text: '视频加载 [错误] .', status: 'error', visible: true })
    console.error(err)
  })
  art.on('play', () => {
    loadingRef.value?.hide()
    msgRef.value?.hideAll()
  })
}

//打开机器人
function openRobot() {
  robotVisible.value = true
  if (artInstance) {
    wasPlaying = artInstance.playing
    if (wasPlaying) artInstance.pause()
  }
}

// 机器人显示
function onRobotClose() {
  robotVisible.value = false
  if (artInstance && wasPlaying) {
    artInstance.play()
  }
}

// 机器人选中视频
function onRobotSelect(item) {
  if (item && artInstance) {
    getMovieDetail(item.id).then(res => {
      robotVisible.value = false
      const data = res.data || {}
      const assets = data.assets || []
      const asset = data.asset || ''
      assetList.value = assets
      let resource = assets.find(r => r.asset === asset) || assets[0]
      let vol = item.vol
      if (!vol || vol < 1) vol = 1
      assetActive.value = { asset, vol }
      if (!resource || !resource.urls || resource.urls.length < vol) vol = 1
      // 切换播放
      if (resource && resource.urls && resource.urls[vol - 1]) {
        artInstance.switchUrl(resource.urls[vol - 1].url)
      } else {
        console.log('没有找到相应的资源')
      }
      updateAssetPickerBtn()
    })
  }
}

// 播放如果未播放
function ifPlay() {
  if (artInstance && !artInstance.wasPlaying) {
    artInstance.play()
  }
}

function updateAssetPickerBtn() {
  // PC端
  if (!window.isMobile() && artInstance) {
    const exists = artInstance.controls['asset-picker-btn']
    if (assetList.value && assetList.value.length > 1) {
      if (!exists) {
        artInstance.controls.add({
          name: 'asset-picker-btn',
          html: "<div style=\"width:80px;text-align:center\"><i class='iconfont icon-xuanji2'></i></div>",
          position: 'right',
          tooltip: '选集',
          style: { color: '#fff' },
          click: openAssetPicker
        })
      }
    } else {
      if (exists) artInstance.controls.remove('asset-picker-btn')
    }
  }
  // 移动端
  else {
    const idx = toolBars.value.findIndex(i => i.key === 'asset-picker-btn')
    if (assetList.value && assetList.value.length > 1) {
      if (idx === -1) {
        toolBars.value.push({
          key: 'asset-picker-btn',
          title: '选集',
          icon: 'icon-xuanji2',
          onClick: openAssetPicker
        })
      }
    } else {
      if (idx !== -1) toolBars.value.splice(idx, 1)
    }
  }
}

// 资源控制面板切换资源
function selectAsset(asset) {
  assetActive.value.asset = asset
}
// 资源控制面板切换集数
function selectVol({ asset, vol, url }) {
  assetActive.value = { asset, vol }
  if (artInstance && url) {
    artInstance.switchUrl(url)
  }
}

// 打开选集弹窗，传递初始参数
function openAssetPicker() {
  assetPickerRef.value && assetPickerRef.value.open()
}
function closeAssetPicker() {
  assetPickerRef.value && assetPickerRef.value.close()
}

const toolbarHeight = computed(() => window.system?.toolbarHeight || 60)
</script>

<style scoped>
.player-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.player-wrapper.mobile {
  height: calc(100% - v-bind(toolbarHeight + 'px'));
  /* 移动端减去 toolbar 高度 */
}
</style>