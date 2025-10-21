<template>
  <div v-if="show" class="loading-cover">
    <img :src="img" alt="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getLoadingImages } from '../unit/api.js'
const show = ref(true)
const img = ref('')
let timer = null
let imgs = []
async function nextImg() {
  if (!imgs.length) return
  img.value = imgs[Math.floor(Math.random() * imgs.length)]
}
onMounted(async () => {
  imgs = await getLoadingImages()
  nextImg()
  timer = setInterval(nextImg, 5000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.loading-cover {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  overflow: hidden;
}

.loading-cover img {
  object-fit:fill;
  /* 保持宽高比缩放 */
  object-position: center;
  /* 图片居中显示 */
  width: 100%;
  /* 横向图片限制宽度 */
  margin: auto;
  /* 关键：实现双向居中 */
}
</style>
