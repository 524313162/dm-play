<template>
  <div ref="danmakuContainer" style="width:100%;height:100%;position:absolute;top:0;left:0;pointer-events:none;z-index:12;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
const props = defineProps({
  art: Object,
  danmuApi: String,
  danmuOn: Boolean,
  vodId: String,
})
const danmakuContainer = ref(null)

onMounted(() => {
  if (props.art && props.danmuOn && props.danmuApi) {
    props.art.plugins.add(
      artplayerPluginDanmuku({
        danmuku: props.danmuApi + '?id=' + (props.vodId || ''),
        speed: 5,
        opacity: 0.7,
        fontSize: 24,
        color: '#fff',
        // ...可扩展更多配置
      })
    )
  }
})
</script>
