<template>
    <div ref="$container" style="position:relative;width:100%;height:100%;"></div>
</template>
<script setup>
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip';
import { onBeforeUnmount, onMounted, ref, shallowRef, watch, nextTick } from 'vue'
import { getDanmuList, sendDanmu } from '../mock/index.js'

const props = defineProps({
    option: { type: Object, required: true },
    danmuOn: { type: Boolean, default: true }, // 是否默认显示弹幕
    vodId: { type: [String, Number], default: '' } // 弹幕分组/视频 ID
})
const emit = defineEmits(['getInstance'])

const art = shallowRef(null)
const $container = ref(null)
const danmuOn = ref(props.danmuOn)
const vodId = ref(props.vodId)
watch(() => props.danmuOn, v => (danmuOn.value = v))
watch(() => props.vodId, v => (vodId.value = v))

function transformDanmu(list = []) {
    // 服务器返回格式到插件格式的兼容；假设服务器返回字段 text/time/color/mode
    return list.map(d => ({
        text: d.text || d.content || '',
        time: Number(d.time || d.second || 0),
        color: d.color || '#FFFFFF',
        mode: Number(d.mode || 0)
    })).filter(d => d.text && d.time >= 0)
}

async function loadDanmuku() {
    if (!vodId.value) return []
    try {
        const list = await getDanmuList(vodId.value)
        return transformDanmu(list || [])
    } catch (e) {
        console.error('弹幕加载失败', e)
        return []
    }
}

async function sendDanmuToServer(danmu) {
    try {
        await sendDanmu({
            text: danmu.text,
            color: danmu.color,
            mode: danmu.mode,
            time: Math.floor(art.value?.currentTime || 0),
            vodId: vodId.value
        })
        return true
    } catch (e) {
        console.error('发送弹幕失败', e)
        art.value?.notice?.show?.('弹幕发送失败')
        return false
    }
}

onMounted(() => {
    nextTick(() => {
        art.value = new Artplayer({
            ...props.option,
            container: $container.value,
            setting: true,
            plugins: [
                artplayerPluginHlsControl({
                    quality: { control: true, setting: true, getName: level => `${level.height}P`, title: 'Quality', auto: 'Auto' },
                    audio: { control: true, setting: true, getName: track => track.name, title: 'Audio', auto: 'Auto' }
                }),
                artplayerPluginDocumentPip({
                    width: 480,
                    height: 270,
                    fallbackToVideoPiP: true,
                    placeholder: `Playing in Document Picture-in-Picture`,
                }),
                artplayerPluginDanmuku({
                    // 使用接口加载弹幕
                    danmuku: () => loadDanmuku(),
                    id: vodId.value,
                    autoplay: danmuOn.value,
                    speed: 5,
                    margin: [10, '25%'],
                    opacity: 1,
                    color: '#FFFFFF',
                    mode: 0,
                    modes: [0, 1, 2],
                    fontSize: 25,
                    antiOverlap: true,
                    synchronousPlayback: false,
                    heatmap: true,
                    width: 512,
                    points: [],
                    filter: d => d.text.length <= 200, // 载入前过滤
                    beforeVisible: () => true,
                    visible: true,
                    emitter: true,
                    maxLength: 200,
                    lockTime: 5,
                    theme: 'dark',
                    beforeEmit(danmu) {
                        // 发送前调用后端接口
                        return sendDanmuToServer(danmu)
                    }
                })
            ],
            customType: {
                m3u8(video, url, artInstance) {
                    if (Hls.isSupported()) {
                        if (artInstance.hls) artInstance.hls.destroy()
                        const hls = new Hls()
                        hls.loadSource(url)
                        hls.attachMedia(video)
                        artInstance.hls = hls
                        artInstance.on('destroy', () => hls.destroy())
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url
                    } else {
                        artInstance.notice.show = 'Unsupported playback format: m3u8'
                    }
                }
            }
        })
        emit('getInstance', art.value)
        // URL 切换
        watch(() => props.option.url, (newUrl, oldUrl) => {
            if (art.value && newUrl && newUrl !== oldUrl) art.value.switchUrl(newUrl)
        })
        // 弹幕开关
        watch(danmuOn, val => {
            const plugin = art.value?.plugins?.artplayerPluginDanmuku
            if (plugin) {
                plugin.option.autoplay = val
                plugin.option.visible = val
            }
        })
        // vodId 变化重新加载弹幕
        watch(vodId, async (id, old) => {
            if (id && id !== old) {
                const plugin = art.value?.plugins?.artplayerPluginDanmuku
                if (plugin) {
                    const data = await loadDanmuku()
                    plugin.load(data)
                }
            }
        })
    })
})

onBeforeUnmount(() => { if (art.value) art.value.destroy(false) })

function emitDanmu(text, { color = '#FFFFFF', mode = 0 } = {}) {
    const plugin = art.value?.plugins?.artplayerPluginDanmuku
    if (!plugin) return
    // 先发送到后端，再本地显示（保持与 beforeEmit 逻辑一致）
    sendDanmuToServer({ text, color, mode }).then(ok => {
        if (ok) plugin.emit({ text, color, mode })
    })
}

defineExpose({ emitDanmu, getArt: () => art.value })
</script>