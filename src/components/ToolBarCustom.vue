<template>
  <div class="toolbar-custom" :class="{ mobile: isMobile }" v-show="isMobile">
    <div class="toolbar-left-ad">
      <slot name="ad">
        <div class="ad-placeholder">广告位招租</div>
      </slot>
    </div>
    <div class="toolbar-buttons">
      <!-- 固定顺序：机器人 按钮 1 -->
      <div class="toolbar-item robot-toggle" role="button" tabindex="0" @click="onOpenRobot">
        <i class="iconfont icon-duihuajiqiren1"></i>
      </div>
      <!-- 固定顺序：弹幕 按钮 2 -->
      <div class="toolbar-item danmuku-toggle" role="button" tabindex="0" @click="toggleDanmuku">
        <i class="iconfont icon-danmu3"></i>
      </div>
      <!-- 其余自定义按钮放在后面 -->
      <div v-for="btn in props.toolBars" :key="btn.key" class="toolbar-item" role="button" tabindex="0"
        @click="onClick(btn)" @keydown.enter="onClick(btn)">
        <img v-if="btn.icon" :src="btn.icon" class="toolbar-icon" />
        <span v-else class="toolbar-text">{{ btn.title }}</span>
        <span v-if="btn.hots" class="toolbar-hots">{{ btn.hots }}</span>
      </div>
    </div>
    <transition name="danmuku-drawer">
      <div v-show="showDanmuku" class="danmuku-drawer">
        <div class="danmuku-container"></div>
        <div class="danmuku-close" @click="closeDanmuku"><i class="iconfont icon-guanbi"></i></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  toolBars: {
    type: Array,
    default: () => []
  },
  onOpenRobot: {
    type: Function,
    default: null
  }
})

const showDanmuku = ref(false)

function onClick(btn) { if (btn.link) window.open(btn.link) }
function toggleDanmuku() { showDanmuku.value = !showDanmuku.value }
function closeDanmuku() { showDanmuku.value = false }
function onOpenRobot() {
  if (props.onOpenRobot) props.onOpenRobot()
}

const isMobile = computed(() => window.isMobile && window.isMobile())
const mountSelector = computed(() => (isMobile.value ? document.querySelector('.danmuku-container') : undefined))
const toolbarHeight = computed(() => window.system?.toolbarHeight || 60)

defineExpose({ mountSelector, toolbarHeight, onOpenRobot })
</script>

<style scoped>
.toolbar-custom {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.toolbar-custom.mobile {
  height: v-bind(toolbarHeight + 'px');
  position: relative;
  background: #000;
  /* 纯黑背景 */
}

.toolbar-left-ad {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ad-placeholder {
  font-size: 14px;
  color: #666;
  padding-left: 8px;
}

.toolbar-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.04);
  /* 微弱背景 */
  border-radius: 8px;
  color: #ddd;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background .2s, color .2s;
}

.toolbar-item:hover {
  background: rgba(255, 255, 255, 0.08);
  /* 略增强 */
  color: #fff;
}

.toolbar-item:active {
  background: rgba(255, 255, 255, 0.12);
  /* 按压更明显 */
}

.toolbar-icon {
  width: 20px;
  height: 20px;
}

.toolbar-text {
  font-size: 14px;
}

.danmuku-toggle {
  background: rgba(255, 255, 255, 0.06);
  /* 去掉突兀的色块 */
  color: #bdbdbd;
  /* 较淡的文字颜色 */
}

.danmuku-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
  /* 仅 hover 给极轻背景 */
  color: #ffffff;
  /* 悬停仅提亮文字 */
}

.robot-toggle {
  background: transparent;
  color: #bdbdbd;
}

.robot-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.toolbar-hots {
  background: #ff3b00;
  color: #fff;
  border-radius: 8px;
  font-size: 12px;
  padding: 0 6px;
  margin-left: 4px;
}

/* 抽屉 */
.danmuku-drawer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: v-bind(toolbarHeight + 'px');
  background: #101010;
  /* 略亮，区分抽屉 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.6);
  background-color: rgba(48, 48, 48, 0.8);
}

.danmuku-container {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
}

.danmuku-close {
  width: 48px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}

/* 动画 */
.danmuku-drawer-enter-from,
.danmuku-drawer-leave-to {
  transform: translateY(100%);
  filter: brightness(0.7);
  opacity: 1;
  /* 始终不透明 */
}

.danmuku-drawer-enter-active,
.danmuku-drawer-leave-active {
  transition: transform .25s ease, filter .25s ease;
}

.danmuku-drawer-enter-to,
.danmuku-drawer-leave-from {
  transform: translateY(0);
  filter: brightness(1);
  opacity: 1;
}
</style>
