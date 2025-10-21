<template>
  <div v-if="show" class="asset-picker-mask" @click.self="close">
    <div class="asset-picker">
      <div v-for="asset in assets" :key="asset.key" class="asset-group">
        <div class="asset-title">{{ asset.name }}</div>
        <div class="asset-list">
          <button v-for="item in asset.urls" :key="item.url" :class="['asset-btn', {active: item.url === currentUrl}]" @click="select(item.url)">{{ item.tip }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['select', 'close'])
function select(url) {
  emit('select', url)
  emit('close')
}
function close() {
  emit('close')
}
</script>

<style scoped>
.asset-picker-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.asset-picker {
  background: #232323;
  border-radius: 10px;
  padding: 24px 32px;
  min-width: 320px;
  max-width: 90vw;
}
.asset-title {
  font-size: 16px;
  color: #23ade5;
  margin-bottom: 8px;
}
.asset-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.asset-btn {
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 8px;
}
.asset-btn.active {
  background: #23ade5;
  color: #fff;
}
@media (max-width: 600px) {
  .asset-picker {
    min-width: unset;
    width: 96vw;
    padding: 12px 6px;
    border-radius: 8px;
  }
  .asset-title {
    font-size: 15px;
  }
  .asset-btn {
    font-size: 13px;
    padding: 5px 10px;
  }
  .asset-list {
    gap: 6px;
  }
}
</style>
