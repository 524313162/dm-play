<template>
  <div v-if="visible" class="loading-cover">
    <div class="img-stack">
      <img v-if="previousImg" :key="'prev-' + previousIndex" :src="previousImg" alt="loading" class="loading-img"
        :class="'prev' + (fading ? ' fading' : '')" />
      <img v-if="currentImg" :key="'cur-' + currentIndex" :src="currentImg" alt="loading" class="loading-img"
        :class="'cur' + (active ? ' active' : '')" />
      <div v-if="!currentImg" class="loading-placeholder">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { getLoadingImages } from '../mock/index.js'
const visible = ref(true)
const currentImg = ref('')
const previousImg = ref('')
let imgs = []
let currentIndex = 0
let previousIndex = -1
let playing = true
let cycleTimer = null
let fadeTimer = null
let prefetchTimer = null
const active = ref(false) // 当前是否处于已激活显示（opacity:1）
const fading = ref(false) // 上一张是否正在淡出
const transitioning = ref(false)

const DISPLAY_DURATION = 6000 // 单张完整展示时间（含淡入后静止）
const FADE_DURATION = 1000 // 淡入淡出时长 ms

function clearTimers() { clearTimeout(cycleTimer); clearTimeout(fadeTimer); clearTimeout(prefetchTimer) }
function preload(list) { list.forEach(src => { const im = new Image(); im.src = src }) }
function preloadAndDecode(src) {
  return new Promise(resolve => {
    const im = new Image()
    im.onload = () => { if (im.decode) { im.decode().catch(() => { }).finally(() => resolve(src)) } else resolve(src) }
    im.onerror = () => resolve(src)
    im.src = src
  })
}
function nextIndex() { return imgs.length ? (currentIndex + 1) % imgs.length : 0 }

async function runCycle() {
  if (!playing || transitioning.value || imgs.length === 0) return
  if (imgs.length === 1) { // 单图只重复缩放效果
    restartKenBurns()
    scheduleNextCycle()
    return
  }
  const idx = nextIndex()
  const target = imgs[idx]
  if (!target) { scheduleNextCycle(); return }
  transitioning.value = true
  // 预解码下一张，避免切换时黑闪或卡顿
  const decoded = await preloadAndDecode(target)
  previousImg.value = currentImg.value
  previousIndex = currentIndex
  currentImg.value = decoded
  currentIndex = idx
  fading.value = true
  active.value = false
  // 等待下一帧再触发 CSS transition
  await nextTick()
  requestAnimationFrame(() => { active.value = true })
  // 在淡入期间旧图也开始淡出（通过类控制）
  fadeTimer = setTimeout(() => {
    previousImg.value = ''
    fading.value = false
    transitioning.value = false
    scheduleNextCycle()
  }, FADE_DURATION + 30)
}

function scheduleNextCycle() {
  clearTimeout(cycleTimer)
  if (!playing) return
  cycleTimer = setTimeout(runCycle, DISPLAY_DURATION)
  // 提前预取下一张（在显示后期，减少下一次等待）
  clearTimeout(prefetchTimer)
  if (imgs.length > 1) {
    prefetchTimer = setTimeout(() => {
      const idx = nextIndex(); const src = imgs[idx]; if (src) preloadAndDecode(src)
    }, DISPLAY_DURATION - FADE_DURATION - 300)
  }
}

function restartKenBurns() {
  // 强制刷新当前图的 key 以重启 transform 过渡（通过改变索引触发）
  previousImg.value = ''
  active.value = true
}

function init() {
  if (!imgs.length) return
  currentImg.value = imgs[0]
  currentIndex = 0
  active.value = true
  scheduleNextCycle()
}

function pause() { playing = false; clearTimers() }
function resume() { if (!playing) { playing = true; scheduleNextCycle() } }
function show() { visible.value = true }
function hide() { visible.value = false }
function toggle(flag) { visible.value = flag }

onMounted(async () => {
  try {
    const list = await getLoadingImages()
    if (Array.isArray(list)) imgs = list.filter(Boolean)
    preload(imgs)
    init()
  } catch (e) { console.warn('load loading images failed', e) }
})

onBeforeUnmount(() => clearTimers())

defineExpose({ show, hide, toggle, pause, resume })
</script>

<style scoped>
.loading-cover {
  position: absolute;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  overflow: hidden;
}

.img-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  opacity: 0;
  transform: scale(1);
  transition: opacity var(--fade, 1s) ease, transform 6s linear;
  will-change: opacity, transform;
}

.loading-img.cur.active {
  opacity: 1;
  transform: scale(1.05);
}

.loading-img.prev {
  opacity: 1;
}

.loading-img.prev.fading {
  opacity: 0;
}

.base-img {
  opacity: 1;
  transform: scale(1.05);
}

.loading-placeholder {
  color: #888;
  font-size: 14px;
  letter-spacing: 1px;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .4);
}

.loading-cover:before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, .25));
  pointer-events: none;
}
</style>
