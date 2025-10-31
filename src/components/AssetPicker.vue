<template>
  <transition v-if="props.show" :name="isMobile ? 'asset-fade' : 'asset-slide-up'">
    <div class="asset-picker-mask" @click.self="close">
      <div class="asset-picker" :class="{ mobile: isMobile }">
        <!-- PC端 tab -->
        <template v-if="!isMobile">
          <div class="asset-tabs" style="position:relative;">
            <div v-for="asset in assets" :key="asset.key" class="asset-tab"
              :class="{ active: asset.key === active.asset }" v-on:click="selectTab(asset.key)">{{ asset.name }}</div>
            <span class="asset-pc-close" @click="close">×</span>
          </div>
          <div class="asset-tab-content">
            <div class="asset-vol-list-wrapper">
              <button class="asset-scroll-btn left" v-on:click="scrollVolList('left')"><i
                  class="iconfont icon-xiangzuo"></i></button>
              <div class="asset-vol-list" ref="volList">
                <button v-for="(vol, idx) in (currentAsset.urls || [])" :key="vol.url"
                  :class="['asset-btn', { active: active.vol === idx + 1 }]" v-on:click="selectVol"
                  v-bind:data-idx="idx">{{ vol.tip }}</button>
              </div>
              <button class="asset-scroll-btn right" v-on:click="scrollVolList('right')"><i
                  class="iconfont icon-xiangyou"></i></button>
            </div>
          </div>
        </template>
        <!-- 移动端全屏模式 -->
        <template v-else>
          <div class="asset-mobile-full">
            <div class="asset-mobile-header">
              <div class="asset-mobile-tabs">
                <div v-for="asset in assets" :key="asset.key" class="asset-mobile-tab"
                  :class="{ active: asset.key === active.asset }" v-on:click="selectTab(asset.key)">{{ asset.name }}
                </div>
              </div>
              <span class="asset-mobile-close" v-on:click="close">×</span>
            </div>
            <div class="asset-mobile-body">
              <div class="asset-vol-list asset-vol-list-mobile">
                <button v-for="(vol, idx) in (currentAsset.urls || [])" :key="vol.url"
                  :class="['asset-btn', { active: active.vol === idx + 1 }]" v-on:click="selectVol"
                  v-bind:data-idx="idx">{{ vol.tip }}</button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
const props = defineProps({
  assets: Array,
  active: Object,
  show: Boolean
})
const emit = defineEmits(['selectAsset', 'selectVol', 'onClose'])
const isMobile = window.isMobile()
const volList = ref(null)

const currentAsset = computed(() => {
  return props.assets.find(a => a.key === props.active.asset) || props.assets[0] || { urls: [] }
})

function scrollVolList(direction) {
  const el = volList.value
  if (!el) return
  const pageWidth = el.clientWidth
  if (direction === 'left') {
    el.scrollBy({ left: -pageWidth, behavior: 'smooth' })
  } else {
    el.scrollBy({ left: pageWidth, behavior: 'smooth' })
  }
}

// PC端横滑选集，切tab自动滚动到当前集，代码幽默易懂
function scrollToActiveVol() {
  if (isMobile) return // 移动端你别管
  nextTick(() => {
    const el = volList.value // 选集大滑槽
    if (!el) return // 没滑槽就溜了
    const btns = el.querySelectorAll('.asset-btn') // 所有小按钮
    const idx = (props.active.vol || 1) - 1 // 当前集的下标
    if (btns && btns[idx]) {
      const btn = btns[idx] // 目标按钮
      // 让目标按钮滚到中间，像主角一样C位出道，带平滑动画
      el.scrollTo({
        left: btn.offsetLeft - el.clientWidth / 2 + btn.clientWidth / 2,
        behavior: 'smooth'
      })
    }
  })
}

// 只要资源tab变了，自动C位当前集
watch(() => props.active.asset, () => {
  scrollToActiveVol()
})

function selectTab(key) {
  emit('selectAsset', key)
  scrollToActiveVol() // 切tab也要C位
}

function selectVol(e) {
  const idx = Number(e.currentTarget.dataset.idx)
  const vol = idx + 1
  const asset = currentAsset.value.key
  const url = currentAsset.value.urls && currentAsset.value.urls[idx] ? currentAsset.value.urls[idx].url : ''
  close()
  emit('selectVol', { asset, vol, url })
}

function close() {
  emit('onClose', false)
}


</script>

<style scoped>
.asset-picker-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  /*backdrop-filter: blur(16px) brightness(1.15) saturate(1.2);*/
  /*-webkit-backdrop-filter: blur(16px) brightness(1.15) saturate(1.2);*/
  transition: background 0.3s;
}

.asset-picker {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  padding: 0 0 60px 0;
  min-width: 320px;
  max-width: 98vw;
  width: 100vw;
  margin: 0;
  position: relative;
  animation: asset-fade-in .35s cubic-bezier(.25, .8, .25, 1);
  min-height: 180px;
  max-height: 48vh;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

@keyframes asset-fade-in {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.asset-slide-up-enter-active,
.asset-slide-up-leave-active {
  transition: opacity .35s, transform .35s cubic-bezier(.25, .8, .25, 1);
}

.asset-slide-up-enter-from,
.asset-slide-up-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.asset-picker.mobile {
  width: 100vw;
  max-width: 100vw;
  border-radius: 0;
  padding: 0;
  background: #fff;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.asset-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #ececec;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
  padding: 0 8px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: none;
}

.asset-mobile-tabs {
  display: flex;
  flex: 1;
  overflow-x: auto;
  gap: 8px;
  padding: 0 0 0 8px;
  align-items: center;
  height: 48px;
}

.asset-mobile-tab {
  padding: 6px 14px;
  color: #444;
  font-size: 15px;
  border-radius: 6px 6px 0 0;
  background: transparent;
  cursor: pointer;
  opacity: 0.95;
  transition: color .2s, background .2s, box-shadow .2s;
  white-space: nowrap;
  font-weight: 500;
  border: none;
  box-shadow: none;
}

.asset-mobile-tab.active {
  color: #222;
  background: #ececec;
  box-shadow: none;
  opacity: 1;
  font-weight: 600;
}

.asset-mobile-close {
  font-size: 28px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 4px;
  transition: color .2s;
  line-height: 1;
}

.asset-mobile-close:hover {
  color: #23ade5;
}

.asset-mobile-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 8px 20px 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.asset-vol-list-mobile {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 10px;
  justify-items: center;
  align-items: center;
  padding: 10px;
}

.asset-vol-list-mobile .asset-btn {
  min-width: 60px;
  /* max-width: 90px; 移除最大宽度限制 */
  width: 100%;
  padding: 6px 0;
  margin: 0;
  font-size: 14px;
  border-radius: 5px;
  background: #f0f0f0;
  color: #444;
  font-weight: 400;
  box-shadow: none;
  text-align: center;
  border: none;
  transition: color .2s, background .2s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.asset-vol-list-mobile .asset-btn.active {
  color: #23ade5;
  background: #f0f0f0;
  font-weight: 600;
}

.asset-vol-list-mobile .asset-btn.free {
  color: #444;
  background: #f0f0f0;
  font-weight: 500;
  border-radius: 5px;
  padding: 6px 16px;
  margin: 0 6px;
}

.asset-picker:not(.mobile) .asset-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 44px;
  background: transparent;
  overflow-x: auto;
  white-space: nowrap;
}

.asset-picker:not(.mobile) .asset-tab {
  padding: 6px 18px;
  color: #fff;
  font-size: 15px;
  border-radius: 6px 6px 0 0;
  background: transparent;
  cursor: pointer;
  opacity: 0.95;
  transition: color .2s, background .2s, box-shadow .2s;
  white-space: nowrap;
  border: none;
  box-shadow: none;
}

.asset-picker:not(.mobile) .asset-tab.active {
  color: #fff;
  background: rgba(0, 0, 0, 0.18);
  box-shadow: none;
  opacity: 1;
  position: relative;
  overflow: hidden;
}

.asset-picker:not(.mobile) .asset-tab.active::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, #23ade5 0%, rgba(35, 173, 229, 0.12) 60%, transparent 100%);
  transform: translate(-50%, -50%) scale(0.7);
  opacity: 0.5;
  pointer-events: none;
  animation: ripple-fade 0.7s cubic-bezier(.4, 0, .2, 1);
  z-index: 0;
}

.asset-picker:not(.mobile) .asset-tab-content {
  padding: 18px 16px 0 16px;
  background: transparent;
}

.asset-picker:not(.mobile) .asset-vol-list-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-picker:not(.mobile) .asset-scroll-btn {
  background: none;
  border: none;
  color: #bbb;
  font-size: 20px;
  cursor: pointer;
  padding: 0 6px;
  transition: color .2s;
}

.asset-picker:not(.mobile) .asset-scroll-btn:hover {
  color: #23ade5;
}

.asset-picker:not(.mobile) .asset-vol-list {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
  flex: 1;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.asset-picker:not(.mobile) .asset-vol-list::-webkit-scrollbar {
  display: none;
}

.asset-picker:not(.mobile) .asset-btn {
  min-width: 60px;
  width: 60px;
  padding: 6px 0;
  margin: 0;
  font-size: 14px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 400;
  box-shadow: none;
  text-align: center;
  border: none;
  transition: color .2s, background .2s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.asset-picker:not(.mobile) .asset-btn.active {
  color: #23ade5;
  background: rgba(0, 0, 0, 0.18);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.asset-picker:not(.mobile) .asset-btn.active::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, #23ade5 0%, rgba(35, 173, 229, 0.12) 60%, transparent 100%);
  transform: translate(-50%, -50%) scale(0.7);
  opacity: 0.5;
  pointer-events: none;
  animation: ripple-fade 0.7s cubic-bezier(.4, 0, .2, 1);
  z-index: 0;
}

@keyframes ripple-fade {
  0% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(0.3);
  }

  60% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.05);
  }

  100% {
    opacity: 0.0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@media (max-width: 600px) {
  .asset-picker {
    min-width: unset;
    width: 100vw;
    padding: 0;
    border-radius: 0;
    min-height: 100vh;
    max-height: 100vh;
    height: 100vh;
    box-shadow: none;
  }
}

.asset-fade-enter-active,
.asset-fade-leave-active {
  transition: opacity .25s;
}

.asset-fade-enter-from,
.asset-fade-leave-to {
  opacity: 0;
}

.asset-slide-up-enter-active,
.asset-slide-up-leave-active {
  transition: transform .35s cubic-bezier(.25, .8, .25, 1), opacity .25s;
}

.asset-slide-up-enter-from,
.asset-slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.asset-pc-close {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  margin-left: 10px;
  transition: color .2s;
  line-height: 1;
}

.asset-pc-close:hover {
  color: #23ade5;
}
</style>
