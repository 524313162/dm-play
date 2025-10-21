<template>
  <div class="channel-menu">
    <div v-for="channel in channels" :key="channel.id" :class="['channel-item', {active: channel.id === active, loading: loadingId === channel.id}]" @click="selectChannel(channel.id)">
      <img v-if="channel.poster" :src="channel.poster" class="channel-poster" />
      <div class="channel-info">
        <div class="channel-name">{{ channel.name }}</div>
        <div v-if="channel.hots" class="channel-hots">热度：{{ channel.hots }}</div>
      </div>
      <span v-if="loadingId === channel.id" class="channel-loading"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  channels: {
    type: Array,
    required: true,
  },
  active: {
    type: [String, Number],
    default: 0,
  },
})
const emit = defineEmits(['change'])
const loadingId = ref(null)
function selectChannel(id) {
  if (id === props.active) return
  loadingId.value = id
  emit('change', id)
  setTimeout(() => { loadingId.value = null }, 800) // 假 loading，实际可由父组件控制
}
</script>

<style scoped>
.channel-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.channel-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  background: #222;
  transition: background 0.2s;
  position: relative;
}
.channel-item.active {
  background: #23ade5;
  color: #fff;
}
.channel-item.loading {
  opacity: 0.7;
}
.channel-poster {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}
.channel-info {
  flex: 1;
}
.channel-name {
  font-size: 16px;
  font-weight: 500;
}
.channel-hots {
  font-size: 12px;
  color: #ff6a00;
}
.channel-loading {
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-top: 2px solid #23ade5;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-left: 8px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media (max-width: 768px) {
  .channel-menu {
    flex-direction: row;
    overflow-x: auto;
    gap: 4px;
  }
  .channel-item {
    min-width: 90px;
    padding: 6px 8px;
    font-size: 14px;
  }
  .channel-poster {
    width: 28px;
    height: 28px;
    margin-right: 6px;
  }
}
</style>
