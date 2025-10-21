<template>
  <div class="toolbar-custom">
    <button v-for="btn in toolBars" :key="btn.key" @click="onClick(btn)">
      <img v-if="btn.icon" :src="btn.icon" class="toolbar-icon" />
      <span v-else>{{ btn.title }}</span>
      <span v-if="btn.hots" class="toolbar-hots">{{ btn.hots }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getConfig } from '../unit/api.js'
const toolBars = ref([])
onMounted(async () => {
  const config = await getConfig()
  if (config && config.ad && Array.isArray(config.ad.toolBars)) {
    toolBars.value = config.ad.toolBars
  }
})
function onClick(btn) {
  if (btn.link) window.open(btn.link)
}
</script>

<style scoped>
.toolbar-custom {
  display: flex;
  gap: 12px;
  align-items: center;
}
.toolbar-custom button {
  background: #232323;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}
.toolbar-icon {
  width: 20px;
  height: 20px;
}
.toolbar-hots {
  background: #ff3b00;
  color: #fff;
  border-radius: 8px;
  font-size: 12px;
  padding: 0 6px;
  margin-left: 4px;
}
</style>
