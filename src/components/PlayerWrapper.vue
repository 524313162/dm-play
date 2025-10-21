<template>
  <div class="player-wrapper">
    <LoadingCover />
    <OnlineBadge />
    <NoticeBar v-if="noticeOn && notice" :notice="notice" />
    <component :is="playerComponent" v-bind="playerProps" @get-instance="onGetInstance" />
    <!-- <AdsManager type="start" ad-id="1" /> -->
    <!-- <PauseAdControl ref="pauseAdCtrl" /> -->
    <!-- <CopywritingAuto /> -->
    <!-- <PageAdScript /> -->
    <!-- <ToolBarCustom /> -->
    <AssetPicker v-if="showAsset" :show="showAsset" :assets="assets" :currentUrl="currentUrl" @select="onSelectAsset"
      @close="showAsset = false" />
    <RobotDrawer v-if="showRobot" :show="showRobot" @select="onRobotSelect" @close="showRobot = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import OnlineBadge from './OnlineBadge.vue'
import NoticeBar from './NoticeBar.vue'
// import AdsManager from './AdsManager.vue'
// import PauseAdControl from './PauseAdControl.vue'
// import CopywritingAuto from './CopywritingAuto.vue'
// import PageAdScript from './PageAdScript.vue'
// import ToolBarCustom from './ToolBarCustom.vue'
import LoadingCover from './LoadingCover.vue'
// import AssetPicker from './AssetPicker.vue'
// import RobotDrawer from './RobotDrawer.vue'
import ArtPlayer from './ArtPlayer.vue'
import LivePlayer from './LivePlayer.vue'

import { getConfig } from '../unit/api.js'

const props = defineProps({
  //是否是直播
  isLive: Boolean,
  // 点播参数
  option: Object,
  // 直播参数
  channels: Array,
  defaultChannel: [String, Number],
  // 选集资源
  assets: Array,
  // 其它配置...
})

let config = ref(null);
onMounted(async () => {
  config = await getConfig()
})
const playerComponent = computed(() => props.isLive ? LivePlayer : ArtPlayer)

// 当前播放url/频道
const currentUrl = ref(props.option?.url || '')
const currentChannel = ref(props.defaultChannel || (props.channels && props.channels[0]?.id))
console.log(props.defaultChannel)
// 选集弹窗
const showAsset = ref(false)
function onSelectAsset(url) {
  currentUrl.value = url
  showAsset.value = false
}

// 机器人抽屉
const showRobot = ref(false)
function onRobotSelect(url) {
  if (url) currentUrl.value = url
  showRobot.value = false
}

// 频道切换
function onChannelChange(id) {
  currentChannel.value = id
  const channel = props.channels.find(c => c.id === id)
  if (channel) currentUrl.value = channel.url
}

// 播放器props
const playerProps = computed(() => {
  if (props.isLive) {
    return {
      channels: props.channels,
      defaultChannel: currentChannel.value,
      onChannelChange,
      config: config.value
    }
  } else {
    return {
      option: { ...props.option, url: currentUrl.value, config: config.value },
    }
  }
})

// 事件处理补充
function onGetInstance(art) {
  // 可用于后续扩展
  art.on('ready', () => {
    showMessage(0, '播放器准备就绪')
  });
   //是否能播放
  art.once('video:canplay', () => {
    showMessage(2, '视频开始播放')
  });
  art.on("video:loadeddata", () => {
    showMessage(2, "视频加载中...");
  });
  art.once('video:loadedmetadata', () => {
    showMessage(2, '视频加载...【完成】')
  });  
  art.on("artplayerPluginDanmuku:loaded", (danmus) => {
    showMessage(1, `加载弹幕...【${danmus.length}条】`);
  });
 
  art.once('video:complete', () => {
    console.info('video:complete');
  });
  art.once('video:ended', () => {
    console.info('video:ended');
  });
  art.once('video:waiting', () => {
    console.info('video:waiting');
  });
  art.on('restart', (url) => {
    console.info('restart：当播放器切换地址后并可以播放时触发', url);
  });
  art.on('pause', () => {
    console.info('pause');
  });
  art.on('play', () => {
    console.info('play');
  });
  art.on('destroy', () => {
    console.info('destroy');
  });
  art.on('error', (error, reconnectTime) => {
    console.info(error, reconnectTime);
  });
  art.on('view', (state) => {
    console.info('view', state);
  });
  art.on('seek', (currentTime) => {
    console.info('seek', currentTime);
  });
}
const notice = ref('')
const noticeOn = ref(false)
// ...如需自动拉取 notice，可在此补充...

const showMessage = (idx, res) => {
  console.log(res)
}
</script>