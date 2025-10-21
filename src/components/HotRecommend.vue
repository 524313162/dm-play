<template>
  <div class="hot-recommend">
    <div class="hot-title">热播推荐</div>
    <div class="hot-list">
      <div v-for="item in list" :key="item.id" class="hot-item" @click="$emit('play', item)">
        <img :src="item.cover" class="hot-cover" />
        <div class="hot-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHotList } from '../unit/api.js'
const list = ref([])
onMounted(async () => {
  list.value = await getHotList()
})
</script>

<style scoped>
.hot-recommend {
  margin: 24px auto;
  max-width: 900px;
}
.hot-title {
  font-size: 18px;
  color: #23ade5;
  margin-bottom: 12px;
}
.hot-list {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.hot-item {
  width: 120px;
  cursor: pointer;
  text-align: center;
}
.hot-cover {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 6px;
}
.hot-name {
  font-size: 15px;
  color: #fff;
}
</style>
