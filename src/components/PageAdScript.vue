<script setup>
import { onMounted } from 'vue'
import { getConfig } from '../unit/api.js'
function safeEval(js) {
  // 仅允许白名单函数，或用 Function 沙箱限制全局
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('window', 'document', 'console', js)
    fn(undefined, undefined, console)
  } catch (e) {
    // 忽略脚本异常
  }
}
onMounted(async () => {
  const config = await getConfig()
  if (config && config.ad && config.ad.pageAd) {
    safeEval(config.ad.pageAd)
  }
})
</script>
