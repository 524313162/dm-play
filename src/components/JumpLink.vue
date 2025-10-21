<script setup>
import { onMounted } from 'vue'
import { getConfig } from '../unit/api.js'
onMounted(async () => {
  const config = await getConfig()
  if (config && Array.isArray(config.ad.jumpLink) && config.ad.jumpLink.length) {
    const link = config.ad.jumpLink[Math.floor(Math.random() * config.ad.jumpLink.length)]
    if (link) window.location.href = link
  }
})
</script>
