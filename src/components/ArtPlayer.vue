<template>
    <div ref="$container" style="position:relative;width:100%;height:100%;">
        <!-- <DanmakuLayer v-if="danmuOn && danmuApi" :art="art" :danmuApi="danmuApi" :danmuOn="danmuOn" :vodId="vodId" /> -->
    </div>
</template>

<script setup>
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

// 外部传入，不在内部请求配置
const props = defineProps({
    option: { type: Object, required: true },
    danmuApi: { type: String, default: '' },
    danmuOn: { type: Boolean, default: false },
    vodId: { type: [String, Number], default: '' }
})
const emit = defineEmits(['getInstance'])

const art = shallowRef(null)
const $container = ref(null)
const danmuApi = ref(props.danmuApi)
const danmuOn = ref(props.danmuOn)
const vodId = ref(props.vodId)

watch(() => props.danmuApi, v => (danmuApi.value = v))
watch(() => props.danmuOn, v => (danmuOn.value = v))
watch(() => props.vodId, v => (vodId.value = v))

onMounted(() => {
    art.value = new Artplayer({
        ...props.option,
        container: $container.value,
        setting: true,
        plugins: [
            artplayerPluginHlsControl({
                quality: { control: true, setting: true, getName: level => `${level.height}P`, title: 'Quality', auto: 'Auto' },
                audio: { control: true, setting: true, getName: track => track.name, title: 'Audio', auto: 'Auto' }
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
    // 监听外部 url 变化
    watch(
        () => props.option.url,
        (newUrl, oldUrl) => {
            if (art.value && newUrl && newUrl !== oldUrl) art.value.switchUrl(newUrl)
        }
    )
})

onBeforeUnmount(() => {
    if (art.value) art.value.destroy(false)
})
</script>