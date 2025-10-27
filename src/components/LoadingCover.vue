<template>
  <div v-if="visible" class="loading-cover">
    <img :src="img" alt="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getLoadingImages } from '../mock/index.js'
const visible = ref(true)
const img = ref('')
let timer = null
let imgs = []
async function nextImg() {
  if (imgs.length) img.value = imgs[Math.floor(Math.random() * imgs.length)]
}
onMounted(async () => {
  imgs = await getLoadingImages()
  nextImg()
  timer = setInterval(nextImg, 5000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
function show() { visible.value = true }
function hide() { visible.value = false }
function toggle(flag) { visible.value = flag }
// 对外暴露控制方法
defineExpose({ show, hide, toggle })
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

.loading-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
