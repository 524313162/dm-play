<template>
    <div ref="$container" style="position:relative;width:100%;height:100%;"></div>
</template>
<script setup>
import Artplayer from 'artplayer'
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch, nextTick } from 'vue'
import { getDanmuList, sendDanmu } from '../mock/index.js'
import { createPlayerOption, createHlsControlOption, createDocumentPipOption, createDanmukuOption, createCustomType } from '../unit/app-config.js'

const props = defineProps({ option: { type: Object, required: true }, danmuOn: { type: Boolean, default: true }, vodId: { type: [String, Number], default: '' }, mountSelector: { type: String, default: '' } })
const emit = defineEmits(['getInstance'])

const art = shallowRef(null)
const $container = ref(null)
const danmuOn = ref(props.danmuOn)
const vodId = ref(props.vodId)
watch(() => props.danmuOn, v => (danmuOn.value = v))
watch(() => props.vodId, v => (vodId.value = v))

function transformDanmu(list = []) {
    return list.map(d => ({ text: d.text || d.content || '', time: Number(d.time || d.second || 0), color: d.color || '#FFFFFF', mode: Number(d.mode || 0) })).filter(d => d.text && d.time >= 0)
}
async function loadDanmuku() { if (!vodId.value) return []; try { const list = await getDanmuList(vodId.value); return transformDanmu(list || []) } catch (e) { console.error('弹幕加载失败', e); return [] } }
async function sendDanmuToServer(danmu) { try { await sendDanmu({ text: danmu.text, color: danmu.color, mode: danmu.mode, time: Math.floor(art.value?.currentTime || 0), vodId: vodId.value }); return true } catch (e) { console.error('发送弹幕失败', e); art.value?.notice?.show?.('弹幕发送失败'); return false } }

onMounted(() => {
    nextTick(() => {
        art.value = new Artplayer({
            ...createPlayerOption({ url: props.option.url }),
            container: $container.value,
            plugins: [
                artplayerPluginHlsControl(createHlsControlOption()),
                artplayerPluginDocumentPip(createDocumentPipOption()),
                artplayerPluginDanmuku(createDanmukuOption({ danmuOn: danmuOn.value, vodId: vodId.value, loadDanmuku, sendDanmuToServer, mountSelector: props.mountSelector }))
            ],
            customType: createCustomType()
        })
        emit('getInstance', art.value)
        watch(() => props.option.url, (newUrl, oldUrl) => { if (art.value && newUrl && newUrl !== oldUrl) art.value.switchUrl(newUrl) })
        watch(danmuOn, val => { const plugin = art.value?.plugins?.artplayerPluginDanmuku; if (plugin) { plugin.option.autoplay = val; plugin.option.visible = val } })
        watch(vodId, async (id, old) => { if (id && id !== old) { const plugin = art.value?.plugins?.artplayerPluginDanmuku; if (plugin) plugin.load(await loadDanmuku()) } })
    })
})

onBeforeUnmount(() => { if (art.value) art.value.destroy(false) })

function emitDanmu(text, { color = '#FFFFFF', mode = 0 } = {}) {
    const plugin = art.value?.plugins?.artplayerPluginDanmuku
    if (!plugin) return
    sendDanmuToServer({ text, color, mode }).then(ok => { if (ok) plugin.emit({ text, color, mode }) })
}

defineExpose({ emitDanmu, getArt: () => art.value })
</script>