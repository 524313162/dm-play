<template>
  <div v-if="show" class="notice-bar">
    <div class="notice-content" ref="wrapEl">
      <div :key="animKey" ref="textEl" class="notice-text" :class="{ scrolling }"
        :style="{ '--marquee-duration': marqueeDuration + 's', '--from': fromX, '--to': toX }">{{ notice }}</div>
    </div>
    <button class="notice-close" @click="manualClose" aria-label="关闭">×</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
const props = defineProps({ notice: String })

const show = ref(true)
const scrolling = ref(false)
const marqueeDuration = ref(12)
const fromX = ref('0px')
const toX = ref('0px')
const manualClosed = ref(false)
const animKey = ref(0)

const textEl = ref(null)
const wrapEl = ref(null)

let scrollTimeout = null
let reopenTimeout = null

function clearTimers() {
  clearTimeout(scrollTimeout)
  clearTimeout(reopenTimeout)
}

function computeScroll() {
  const textWidth = textEl.value?.scrollWidth || 0
  const wrapWidth = wrapEl.value?.offsetWidth || 0
  if (!textWidth || !wrapWidth) return false
  fromX.value = wrapWidth + 'px'
  toX.value = -textWidth + 'px'
  const distance = textWidth + wrapWidth
  const speed = 120 // px/s
  const dur = distance / speed
  marqueeDuration.value = Math.max(3, Math.min(dur, 40))
  return textWidth > wrapWidth
}

function cycle() {
  if (manualClosed.value) return
  clearTimers()
  show.value = true
  scrolling.value = false
  nextTick(() => {
    const needScroll = computeScroll()
    if (needScroll) {
      animKey.value++
      scrolling.value = true
      scrollTimeout = setTimeout(() => autoClose(), marqueeDuration.value * 1000)
    } else {
      // 无需滚动直接关闭并等待下一次
      autoClose()
    }
  })
}

function autoClose() {
  if (manualClosed.value) return
  clearTimers()
  show.value = false
  scrolling.value = false
  reopenTimeout = setTimeout(() => cycle(), 60000)
}

function manualClose() {
  manualClosed.value = true
  clearTimers()
  show.value = false
  scrolling.value = false
}

function handleResize() { if (show.value && !manualClosed.value) cycle() }

onMounted(() => {
  cycle()
  window.addEventListener('resize', handleResize)
  // 动画结束兜底关闭
  textEl.value?.addEventListener('animationend', () => { if (scrolling.value) autoClose() })
})

onBeforeUnmount(() => {
  clearTimers()
  window.removeEventListener('resize', handleResize)
})

watch(() => props.notice, (val) => { if (!val || manualClosed.value) return; cycle() })
</script>

<style scoped>
.notice-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-size: 15px;
  padding: 6px 12px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
}

.notice-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 22px;
  display: flex;
  align-items: center;
}

.notice-text {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  will-change: transform;
}

.notice-text.scrolling {
  animation: marquee var(--marquee-duration) linear forwards;
}

@keyframes marquee {
  from {
    transform: translate(var(--from), -50%);
  }

  to {
    transform: translate(var(--to), -50%);
  }
}

.notice-close {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #eee;
  font-size: 20px;
  line-height: 1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .2s, transform .15s;
}

.notice-close:hover {
  color: #fff;
}

.notice-close:active {
  color: #ddd;
  transform: scale(.9);
}

@media (max-width: 640px) {
  .notice-bar {
    font-size: 14px;
    padding: 6px 10px;
    gap: 8px;
  }

  .notice-close {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }

  .notice-content {
    height: 20px;
  }
}
</style>
