<template>
  <div v-if="show" class="robot-drawer-mask" @click.self="close">
    <div class="robot-drawer">
      <div class="robot-header">
        <span>DMPlay 机器人求片</span>
        <span class="robot-close" @click="close">×</span>
      </div>
      <div class="robot-body">
        <div v-for="msg in messages" :key="msg.id" class="robot-msg" v-html="msg.html || msg.text"></div>
      </div>
      <div class="robot-footer">
        <input v-model="input" @keyup.enter="send" placeholder="输入影片名..." />
        <button @click="send">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchMovie } from '../unit/api-service.js'
const emit = defineEmits(['close', 'select'])
const input = ref('')
const messages = ref([])
async function send() {
  if (!input.value) return
  const res = await searchMovie(input.value)
  if (res && res.data && Array.isArray(res.data.content)) {
    messages.value.push({ id: Date.now(), html: res.data.content.map(i => `<a href="#" data-url='${i.url}' onclick='window.__robotSelectUrl && window.__robotSelectUrl("${i.url}")'>${i.name}</a>`).join('、') })
  } else {
    messages.value.push({ id: Date.now(), text: '未找到相关影片' })
  }
  input.value = ''
}
function close() {
  emit('close')
}
if (typeof window !== 'undefined') {
  window.__robotSelectUrl = (url) => {
    emit('select', url)
  }
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
  align-items: flex-end;
  justify-content: flex-end;
}

.robot-drawer {
  width: 380px;
  height: 100%;
  background: #232323;
  border-radius: 10px 0 0 10px;
  display: flex;
  flex-direction: column;
}

.robot-header {
  padding: 16px;
  font-size: 18px;
  color: #23ade5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.robot-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  color: #fff;
}

.robot-footer {
  padding: 12px 16px;
  border-top: 1px solid #333;
  display: flex;
  gap: 8px;
}

.robot-footer input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #333;
  color: #fff;
}

.robot-footer button {
  background: #23ade5;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
}

.robot-close {
  cursor: pointer;
  font-size: 22px;
}

@media (max-width: 600px) {
  .robot-drawer {
    width: 100vw;
    border-radius: 10px 10px 0 0;
    height: 60vh;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
  }

  .robot-drawer-mask {
    align-items: flex-end;
    justify-content: center;
  }

  .robot-header {
    font-size: 16px;
    padding: 10px;
  }

  .robot-body {
    padding: 10px;
    font-size: 14px;
  }

  .robot-footer {
    padding: 8px 10px;
    gap: 4px;
  }

  .robot-footer button {
    font-size: 13px;
    padding: 5px 10px;
  }
}
</style>
