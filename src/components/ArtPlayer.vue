<template>
    <div ref="$container" style="position:relative;width:100%;height:100%;">
        <DanmakuLayer v-if="danmuOn && danmuApi" :art="art" :danmuApi="danmuApi" :danmuOn="danmuOn" :vodId="vodId" />
    </div>
</template>

<script setup>
import Artplayer from 'artplayer'
import Hls from 'hls.js';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import DanmakuLayer from './DanmakuLayer.vue'
import { getConfig } from '../unit/api.js'

const props = defineProps({
    option: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['getInstance'])

const art = shallowRef(null)
const $container = ref(null)
const danmuApi = ref('')
const danmuOn = ref(false)
const vodId = ref('')

onMounted(async () => {
    const config = await getConfig()
    if (config) {
        danmuApi.value = config.danmuApi
        danmuOn.value = !!config.danmuOn
    }
    art.value = new Artplayer({
        ...props.option,
        container: $container.value,
        setting: true,
        plugins: [
            artplayerPluginHlsControl({
                quality: {
                    // Show qualitys in control
                    control: true,
                    // Show qualitys in setting
                    setting: true,
                    // Get the quality name from level
                    getName: level => `${level.height}P`,
                    // I18n
                    title: 'Quality',
                    auto: 'Auto',
                },
                audio: {
                    // Show audios in control
                    control: true,
                    // Show audios in setting
                    setting: true,
                    // Get the audio name from track
                    getName: track => track.name,
                    // I18n
                    title: 'Audio',
                    auto: 'Auto',
                },
            }),
        ],
        customType: {
            m3u8: function playM3u8(video, url, art) {
                if (Hls.isSupported()) {
                    if (art.hls)
                        art.hls.destroy()
                    const hls = new Hls()
                    hls.loadSource(url)
                    hls.attachMedia(video)
                    art.hls = hls
                    art.on('destroy', () => hls.destroy())
                }
                else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url
                }
                else {
                    art.notice.show = 'Unsupported playback format: m3u8'
                }
            },
        },
    })
    emit('getInstance', art.value)
    watch(() => props.option.url, (newUrl, oldUrl) => {
        if (art.value && newUrl && newUrl !== oldUrl) {
            art.value.switchUrl(newUrl)
        }
    })
})

onBeforeUnmount(() => {
    art.value.destroy(false)
})
</script>