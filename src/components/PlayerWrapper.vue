<template>
  <div class="player-wrapper">
    <LoadingCover />
    <OnlineBadge />
    <NoticeBar v-if="noticeOn && notice" :notice="notice" />
    <NMessage ref="msgRef" />
    <component :is="playerComponent" v-bind="playerProps" @get-instance="onGetInstance" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import OnlineBadge from './OnlineBadge.vue'
import NoticeBar from './NoticeBar.vue'
import LoadingCover from './LoadingCover.vue'
import ArtPlayer from './ArtPlayer.vue'
import LivePlayer from './LivePlayer.vue'
import NMessage from './NMessage.vue'
import { getConfig } from '../mock/index.js'

// 只接收与父组件一致的两个参数
const props = defineProps({
  isLive: { type: Boolean, default: false },
  url: { type: String, default: '' }
})

const config = ref(null)
const msgRef = ref(null)

onMounted(async () => {
  msgRef.value?.updateLine('player', { text: '初始化播放器...', status: 'loading' })
  try {
    // 非直播才需要拉配置（直播暂时不使用弹幕）
    if (!props.isLive) config.value = await getConfig()
    msgRef.value?.updateLine('player', { text: '播放器准备就绪', status: 'success' })
  } catch (e) {
    msgRef.value?.updateLine('player', { text: '配置加载失败', status: 'error' })
    console.error(e)
  }
})

const playerComponent = computed(() => (props.isLive ? LivePlayer : ArtPlayer))

// 传递给真实播放器的 props
const playerProps = computed(() => {
  if (props.isLive) {
    return { url: props.url }
  }
  return {
    option: { url: props.url },
    danmuApi: config.value?.danmuApi || '',
    danmuOn: !!config.value?.danmuOn,
    vodId: ''
  }
})

function onGetInstance(art) {
  art.on('error', (err) => { msgRef.value?.updateLine('video', { text: '视频加载错误', status: 'error', visible: true }); console.error(err) })
  art.on('video:loadeddata', () => { msgRef.value?.updateLine('video', { text: '视频数据加载中...', status: 'loading' }) })
  art.on('video:loadedmetadata', () => { msgRef.value?.updateLine('video', { text: '视频元数据加载成功', status: 'success' }) })
  art.on('artplayerPluginDanmuku:load', () => { msgRef.value?.updateLine('danmaku', { text: '弹幕加载中...', status: 'loading' }) })
  art.on('artplayerPluginDanmuku:loaded', () => { msgRef.value?.updateLine('danmaku', { text: '弹幕加载成功', status: 'success' }) })
  art.on('play', () => { msgRef.value?.hideAll() })
}

const notice = ref('')
const noticeOn = ref(false)
</script>

<style scoped>
.player-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>