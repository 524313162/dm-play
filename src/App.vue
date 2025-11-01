<template>
  <div style="width:100%;height:100%;position:absolute;top:0;left:0;">
    <SearchPage v-if="!url && !vod" @playUrl="onPlayUrl" @showRobot="onShowRobot" />
    <PlayerWrapper v-else :isLive="isLive" :url="url" :vod="vod" />
    <RobotDrawer ref="robotDrawerRef" :show="showRobotDialog" @close="showRobotDialog = false"
      @select="onRobotSelect" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import PlayerWrapper from './components/PlayerWrapper.vue'
import SearchPage from './components/SearchPage.vue'
import RobotDrawer from './components/RobotDrawer.vue'
import { getQueryParams } from './unit/utils.js'

const params = getQueryParams()
const url = ref(params.url || '')
const vod = ref(params.vod || '')
const isLive = ref(params.live === '1')
const showRobotDialog = ref(false)
const robotDrawerRef = ref(null)

function onPlayUrl({ e, data }) {
  if (e === 'url') {
    url.value = data
    showRobotDialog.value = false
  } else if (e === 'id') {
    vod.value = data
    // 进入播放器
  }
}
function onShowRobot(keyword) {
  showRobotDialog.value = true
  nextTick(() => {
    robotDrawerRef.value?.sendNow(keyword)
  })
}
function onRobotSelect(item) {
  if (item.url) {
    url.value = item.url
  } else if (item.id) {
    vod.value = item.id
  }
  showRobotDialog.value = false
}
</script>
<style>
@import url('/src/assets/styles.css');
@import url('/src/assets/fonts/iconfont.css');

html,
body,
#app {
  font-family: Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif;
}
</style>