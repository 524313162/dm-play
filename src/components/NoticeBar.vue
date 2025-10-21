<template>
  <div v-if="show" class="notice-bar">
    <span class="notice-text">{{ notice }}</span>
    <span class="notice-close" @click="close">×</span>
    <span class="notice-timer">{{ timer }}s</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
const props = defineProps({
  notice: String,
  duration: { type: Number, default: 30 },
})
const show = ref(true)
const timer = ref(props.duration)
let interval = null
function close() {
  show.value = false
}
onMounted(() => {
  interval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) show.value = false
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
watch(() => props.notice, (val) => {
  if (val) {
    show.value = true
    timer.value = props.duration
  }
})
</script>

<style scoped>
.notice-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,0.85);
  color: #fff;
  font-size: 15px;
  padding: 8px 48px 8px 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.notice-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: scroll 12s linear infinite;
}
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-60%); }
}
.notice-close {
  margin-left: 16px;
  cursor: pointer;
  font-size: 20px;
}
.notice-timer {
  margin-left: 12px;
  font-size: 13px;
  color: #ffb300;
}
</style>
