<script setup>
import { onMounted } from 'vue'
import { getConfig } from '../unit/api.js'

onMounted(async () => {
  const config = await getConfig()
  if (config && Array.isArray(config.copywriting) && config.copywriting.length) {
    const text = config.copywriting[Math.floor(Math.random() * config.copywriting.length)]
    if (text) {
      try {
        await navigator.clipboard.writeText(text)
      } catch (e) {
        // 忽略剪贴板异常
      }
    }
  }
})
</script>
