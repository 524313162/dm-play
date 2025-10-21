<template>
  <div class="online-badge" v-if="online !== null">
    <span>在线人数：{{ online }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getOnlineCount } from '../mock/index.js'

const online = ref(0)
let timer = null

async function fetchOnline() {
  try {
    online.value = (await getOnlineCount()) || 0
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchOnline()
  timer = setInterval(fetchOnline, 20000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.online-badge {
  position: absolute;
  left: 20px;
  bottom: 40px;
  background: rgba(0, 0, 0, 0.10);
  color: #ffffff1f;
  font-size: 14px;
  border-radius: 12px;
  padding: 4px 14px;
  pointer-events: none;
  z-index: 10;
  user-select: none;
}
</style>
