<template>
  <div v-if="showAd" class="ads-mask" v-html="adScript"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getAd } from '../unit/api.js'
const props = defineProps({
  show: Boolean,
  adId: { type: [String, Number], default: 2 },
})
const showAd = ref(false)
const adScript = ref('')
watch(() => props.show, async (val) => {
  if (val) {
    const ad = await getAd(props.adId)
    if (ad && Math.random() * 100 < (ad.Weight || 100)) {
      adScript.value = ad.Script
      showAd.value = true
      setTimeout(() => { showAd.value = false }, 5000)
    }
  }
})
</script>

<style scoped>
.ads-mask {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 99;
  pointer-events: auto;
}
</style>
