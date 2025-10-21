<template>
  <PauseAds :show="showAd" />
</template>

<script setup>
import { ref } from 'vue'
import PauseAds from './PauseAds.vue'
const showAd = ref(false)
// function triggerPauseAd() {
//   showAd.value = true
//   setTimeout(() => { showAd.value = false }, 5000)
// }
</script>
