<template>
  <div class="live-player-wrapper">
    <div v-if="isPC" class="channel-menu-left">
      <ChannelMenu :channels="channels" :active="activeChannel" @change="onChannelChange" />
    </div>
    <div class="live-player-main">
      <div ref="containerRef" />
      <div v-if="!isPC" class="channel-menu-bottom">
        <ChannelMenu :channels="channels" :active="activeChannel" @change="onChannelChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import ChannelMenu from './ChannelMenu.vue'

const props = defineProps({
  channels: {
    type: Array,
    required: true,
  },
  defaultChannel: {
    type: [String, Number],
    default: 0,
  },
})

const emit = defineEmits(['getInstance', 'channelChange'])
const activeChannel = ref(props.defaultChannel)
const art = ref(null)
const containerRef = ref(null)

const isPC = computed(() => window.innerWidth > 768)

function getCurrentChannel() {
  return props.channels.find(c => c.id === activeChannel.value) || props.channels[0]
}

function onChannelChange(id) {
  activeChannel.value = id
  emit('channelChange', id)
  playLive(getCurrentChannel().url)
}

function playLive(url) {
  if (!art.value) return
  art.value.setUrl(url)
}

onMounted(() => {
  const channel = getCurrentChannel()
  art.value = new Artplayer({
    container: containerRef.value,
    url: channel.url,
    isLive: true,
    autoplay: true,
    poster: channel.poster || '',
    title: channel.name,
    customType: {
      m3u8: function (video, url, art) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy()
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          art.hls = hls
          art.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          art.notice.show = 'Unsupported playback format: m3u8'
        }
      },
    },
    // 可扩展弹幕、广告等插件
  })
  emit('getInstance', art.value)
})

watch(() => props.defaultChannel, (newId, oldId) => {
  if (newId !== oldId) {
    const channel = props.channels.find(c => c.id === newId)
    if (channel && art.value) {
      art.value.setUrl(channel.url)
    }
  }
})

onBeforeUnmount(() => {
  art.value?.destroy(false)
})
</script>

<style scoped>
.live-player-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.channel-menu-left {
  width: 220px;
  min-width: 180px;
  background: #181818;
  border-right: 1px solid #222;
  padding: 8px 0;
}
.live-player-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.channel-menu-bottom {
  width: 100%;
  background: #181818;
  border-top: 1px solid #222;
  padding: 8px 0;
}
@media (max-width: 768px) {
  .live-player-wrapper {
    flex-direction: column;
  }
  .channel-menu-left {
    display: none;
  }
  .channel-menu-bottom {
    display: block;
  }
}
</style>
