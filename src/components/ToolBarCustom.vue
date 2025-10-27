<template>
  <div class="toolbar-custom" :class="{ mobile: isMobile }" v-if="isMobile">
    <div class="toolbar-left-ad">
      <!-- 广告位，可根据 config 动态插入 -->
      <slot name="ad"></slot>
    </div>
    <div class="toolbar-buttons">
      <button v-for="btn in toolBars" :key="btn.key" @click="onClick(btn)">
        <img v-if="btn.icon" :src="btn.icon" class="toolbar-icon" />
        <span v-else>{{ btn.title }}</span>
        <span v-if="btn.hots" class="toolbar-hots">{{ btn.hots }}</span>
      </button>
      <button class="danmuku-toggle" @click="toggleDanmuku">弹幕</button>
    </div>
    <transition name="danmuku-drawer">
      <div v-if="showDanmuku" class="danmuku-drawer">
        <div class="danmuku-container"></div>
        <div class="danmuku-close" @click="closeDanmuku">关闭</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getConfig } from '../unit/api-service.js'

const toolBars = ref([])
const showDanmuku = ref(false)

onMounted(async () => {
  const config = await getConfig()
  if (config && config.ad && Array.isArray(config.ad.toolBars)) {
    toolBars.value = config.ad.toolBars
  }
})

function onClick(btn) { if (btn.link) window.open(btn.link) }
function toggleDanmuku() { showDanmuku.value = !showDanmuku.value }
function closeDanmuku() { showDanmuku.value = false }

const isMobile = computed(() => window.isMobile && window.isMobile())
const mountSelector = computed(() => (isMobile.value ? '' : ''))
const toolbarHeight = computed(() => window.system?.toolbarHeight || 60)

defineExpose({ mountSelector, toolbarHeight })
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
}

.toolbar-left-ad {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.toolbar-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-buttons button {
  background: #232323;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.danmuku-toggle {
  background: #23ade5;
  color: #fff;
  font-weight: 600;
}

.toolbar-icon {
  width: 20px;
  height: 20px;
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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
}

.danmuku-container {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
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
  opacity: 0;
}

.danmuku-drawer-enter-active,
.danmuku-drawer-leave-active {
  transition: all .25s ease;
}

.danmuku-drawer-enter-to,
.danmuku-drawer-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
