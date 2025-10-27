<template>
  <div class="player-wrapper" :class="{ mobile: isMobile }">
    <LoadingCover ref="loadingRef" />
    <OnlineBadge />
    <NoticeBar v-if="noticeOn && notice" :notice="notice" />
    <NMessage ref="msgRef" />
    <component :is="playerComponent" v-bind="playerProps" @get-instance="onGetInstance" />
  </div>
  <ToolBar ref="toolbarRef"></ToolBar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import OnlineBadge from './OnlineBadge.vue'
import NoticeBar from './NoticeBar.vue'
import LoadingCover from './LoadingCover.vue'
import ArtPlayer from './ArtPlayer.vue'
import LivePlayer from './LivePlayer.vue'
import ToolBar from './ToolBarCustom.vue'
import NMessage from './NMessage.vue'
import { getConfig } from '../mock/index.js'
import { initGlobalSystemConfig } from '../unit/utils.js'

const props = defineProps({
  isLive: { type: Boolean, default: false },
  url: { type: String, default: '' }
})

const config = ref(null)
const msgRef = ref(null)
const loadingRef = ref(null)
const toolbarRef = ref(null)
const isMobile = ref(false)

function detectMobile() {
  isMobile.value = window.innerWidth < 860 || /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent)
}

onMounted(async () => {
  initGlobalSystemConfig()
  detectMobile()
  window.addEventListener('resize', detectMobile)
  msgRef.value?.updateLine('player', { text: '初始化播放器...', status: 'loading' })
  try {
    if (!props.isLive) config.value = await getConfig()
    msgRef.value?.updateLine('player', { text: '播放器准备就绪', status: 'success' })
  } catch (e) {
    msgRef.value?.updateLine('player', { text: '配置加载失败', status: 'error' })
    console.error(e)
  }
})

onBeforeUnmount(() => window.removeEventListener('resize', detectMobile))

const playerComponent = computed(() => (props.isLive ? LivePlayer : ArtPlayer))

const playerProps = computed(() => {
  if (props.isLive) {
    return { url: props.url }
  }
  return {
    option: { url: props.url },
    danmuApi: config.value?.danmuApi || '',
    danmuOn: !!config.value?.danmuOn,
    vodId: '',
    mountSelector: toolbarRef.value?.mountSelector || ''
  }
})

function onGetInstance(art) {
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
    art.play()
  })
}

const notice = ref('')
const noticeOn = ref(false)
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