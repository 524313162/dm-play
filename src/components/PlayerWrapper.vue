<template>
  <div class="player-wrapper" :class="{ mobile: isMobile }">
    <LoadingCover ref="loadingRef" />
    <NoticeBar v-if="notice" :notice="notice" />
    <NMessage ref="msgRef" />
    <component :is="playerComponent" v-bind="playerProps" @get-instance="onGetInstance" />
  </div>
  <ToolBar ref="toolbarRef" :toolBars="toolBars" :onOpenRobot="openRobot"></ToolBar>
  <RobotDrawer :show="robotVisible" @close="onRobotClose" @select="onRobotSelect" />
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
import { getConfig, getOnlineCount } from '../mock/index.js'
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
const isMobile = ref(false)
const robotVisible = ref(false)
let artInstance = null
let wasPlaying = false


// 初始化, 加载配置
onMounted(async () => {
  initGlobalSystemConfig()
  msgRef.value?.updateLine('player', { text: '初始化播放器...', status: 'loading' })
  try {
    config.value = (await getConfig()).data || {}
    toolBars.value = config.value?.toolBars || config.value?.ad?.toolBars || []
    console.log(config.value)
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
  if (isMobile.value) return []
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
    loadingRef.value?.show()
    msgRef.value?.updateLine('video', { text: '视频数据加载中...', status: 'loading' })
  })
  art.on('video:waiting', () => {
    loadingRef.value?.show()
    msgRef.value?.updateLine('video', { text: '视频缓冲...', status: 'loading', visible: true })
  })
  art.on('video:loadedmetadata', () => {
    msgRef.value?.updateLine('video', { text: '视频加载 [成功] .', status: 'success' })
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
    loadingRef.value?.show()
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
  robotVisible.value = false
  if (item && artInstance) {
    // 这里需要通过item.id 去获取视频详情,并返回视频地址
  }
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