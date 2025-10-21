<template>
  <div class="danmaku-send">
    <input v-model="text" :placeholder="tip" @keyup.enter="sendDanmu" />
    <button @click="sendDanmu">发送弹幕</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendDanmu } from '../unit/api.js'
const props = defineProps({
  vodId: String,
  tip: { type: String, default: '请输入弹幕...' },
  color: { type: String, default: '#FFFFFF' },
  mode: { type: Number, default: 0 },
})
const text = ref('')
async function sendDanmu() {
  if (!text.value.trim()) return
  await sendDanmu({
    text: text.value,
    mode: props.mode,
    color: props.color,
    vodId: props.vodId,
    time: 0,
  })
  text.value = ''
}
</script>

<style scoped>
.danmaku-send {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}
.danmaku-send input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #333;
  color: #fff;
}
.danmaku-send button {
  background: #23ade5;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
}
</style>
