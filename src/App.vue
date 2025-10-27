<template>
  <div style="width:100%;height:100%;position:absolute;top:0;left:0;">
    <PlayerWrapper :isLive="vodOption.isLive" :url="vodOption.url" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerWrapper from './components/PlayerWrapper.vue'
import { getQueryParams } from './unit/utils.js'

const params = getQueryParams()
const vodOption = computed(() => ({
  isLive: params.live === '1',
  url: params.url || 'https://cdn.wlcdn99.com:777/20220417/SETX8TEo/index.m3u8',
}))
</script>
<style>
@import url('/src/assets/styles.css');
@import url('/src/assets/fonts/iconfont.css')
</style>