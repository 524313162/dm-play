<template>
  <div v-if="showAd" class="ads-mask">
    <div class="ads-content" v-html="adScript"></div>
    <button class="ads-close" @click="closeAd">×</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getAd } from '../unit/api.js'
const props = defineProps({
  type: { type: String, default: 'start' }, // start/pause/page
  adId: { type: [String, Number], default: 1 },
})
const showAd = ref(false)
const adScript = ref('')
let timer = null
async function fetchAd() {
  const ad = await getAd(props.adId)
  if (ad && Math.random() * 100 < (ad.Weight || 100)) {
    adScript.value = sanitizeAd(ad.Script)
    showAd.value = true
    timer = setTimeout(() => { showAd.value = false }, 5000)
  }
}
function closeAd() {
  showAd.value = false
  clearTimeout(timer)
}
function sanitizeAd(html) {
  // 仅允许基本标签，去除 script 事件等危险内容
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
}
onMounted(() => {
  if (props.type === 'start') fetchAd()
})
onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.ads-mask {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 99;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ads-content {
  background: #fff;
  border-radius: 8px;
  padding: 18px 32px;
  min-width: 220px;
  max-width: 90vw;
  position: relative;
}
.ads-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 20px;
  cursor: pointer;
  z-index: 2;
}
</style>
