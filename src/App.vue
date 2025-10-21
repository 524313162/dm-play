<template>
  <div style="width:100%;height:100%;position:absolute;top:0;left:0;">
    <PlayerWrapper
      :option="vodOption"
      :channels="channels"
      :defaultChannel="defaultChannel"
      :assets="assets"
      />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PlayerWrapper from './components/PlayerWrapper.vue'
import { getQueryParams } from './unit/utils.js'

const channels = [
  { id: 1, name: 'CCTV-1', url: 'https://live.example.com/cctv1.m3u8', poster: '', hots: 1234 },
  { id: 2, name: 'CCTV-5', url: 'https://live.example.com/cctv5.m3u8', poster: '', hots: 888 },
  { id: 3, name: '湖南卫视', url: 'https://live.example.com/hunan.m3u8', poster: '', hots: 666 },
]
const assets = ref([]) // 可根据实际API获取
const params = getQueryParams()
const vodOption = computed(() => ({
  isLive: params.live === '1',
  url: params.url || 'https://cdn.wlcdn99.com:777/20220417/SETX8TEo/index.m3u8',
}))
</script>
<style>
@import url('/src/assets/styles.css');
</style>