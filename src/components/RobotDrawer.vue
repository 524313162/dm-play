<template>
  <div v-if="show" class="robot-drawer-mask" @click.self="close">
    <transition name="robot-slide">
      <div class="robot-drawer">
        <div class="robot-header">
          <span class="robot-back" @click="close"><i class="iconfont icon-xiangzuo"></i></span>
          <span>DMPlay 机器人求片</span>
          <span class="robot-close" @click="close"><i class="iconfont icon-guanbi"></i></span>
        </div>
        <div class="robot-body">
          <div v-for="msg in messages" :key="msg.id" class="robot-msg" v-html="msg.html || msg.text"></div>
        </div>
        <div class="robot-footer">
          <input v-model="input" @keyup.enter="send" placeholder="输入影片名..." />
          <button @click="send">发送</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { searchMovie } from '../unit/api-service.js'
const props = defineProps({ show: { type: Boolean, default: false } })
const show = computed(() => props.show)
const emit = defineEmits(['close', 'select'])
const input = ref('')
const messages = ref([])

async function send() {
  if (!input.value) return
  try {
    const res = await searchMovie(input.value)
    if (res && res.data && Array.isArray(res.data.content) && res.data.content.length) {
      messages.value.push({
        id: Date.now(),
        html: res.data.content
          .map(i => `<a href="#" data-url='${i.url}' onclick='window.__robotSelectUrl && window.__robotSelectUrl("${i.url}")'>${i.name}</a>`)
          .join('、')
      })
    } else {
      messages.value.push({ id: Date.now(), text: '未找到相关影片' })
    }
  } catch (e) {
    console.error(e)
    messages.value.push({ id: Date.now(), text: '查询失败，请稍后重试' })
  }
  input.value = ''
}
function close() { emit('close') }
if (typeof window !== 'undefined') {
  window.__robotSelectUrl = (url) => { emit('select', url); emit('close') }
}
</script>

<style scoped>
.robot-drawer-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.robot-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  /* 白色主体背景 */
  color: #000;
  display: flex;
  flex-direction: column;
}

.robot-header {
  position: relative;
  gap: 10px;
  padding: 16px;
  font-size: 18px;
  color: #111;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
  /* 头部略浅灰与主体区分 */
}

.robot-back {
  cursor: pointer;
  color: #333;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.robot-back:hover {
  color: #000;
}

.robot-close {
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.robot-close:hover {
  color: #000;
}

.robot-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  color: #000;
}

.robot-footer {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.robot-footer input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: #f0f0f0;
  color: #000;
}

.robot-footer input:focus {
  outline: 2px solid #c2e0f5;
}

.robot-footer button {
  background: #111;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
  transition: background .2s;
}

.robot-footer button:hover {
  background: #222;
}

.robot-footer button:active {
  background: #000;
}

.robot-slide-enter-from,
.robot-slide-leave-to {
  transform: translateY(100%);
}

.robot-slide-enter-to,
.robot-slide-leave-from {
  transform: translateY(0);
}

.robot-slide-enter-active,
.robot-slide-leave-active {
  transition: transform .35s cubic-bezier(.25, .8, .25, 1);
}

/* 移除原移动端高度限制，统一全屏 */
@media (max-width: 600px) {
  .robot-header {
    font-size: 16px;
    padding: 12px;
  }

  .robot-body {
    padding: 12px;
    font-size: 14px;
  }

  .robot-footer {
    padding: 10px 12px;
    gap: 6px;
  }

  .robot-footer button {
    font-size: 14px;
    padding: 6px 14px;
  }
}
</style>
