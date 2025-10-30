<template>
  <div v-if="show" class="robot-drawer-mask" @click.self="close">
    <transition :name="transitionName">
      <div class="robot-drawer" :class="{ mobile: isMobile }">
        <div class="robot-header">
          <span class="robot-back" @click="close"><i class="iconfont icon-xiangzuo"></i></span>
          <span>DMPlay 机器人求片</span>
          <span class="robot-close" @click="close"><i class="iconfont icon-guanbi"></i></span>
        </div>
        <div class="robot-body">
          <div v-if="!messages.length" class="robot-empty">输入影片名开始对话，例如：钢铁侠</div>
          <transition-group v-else name="chat-msg" tag="div" class="chat-list">
            <div v-for="msg in messages" :key="msg.id" class="chat-row" :class="msg.role">
              <div class="avatar">
                <i class="iconfont" :class="msg.role === 'bot' ? 'icon-duihuajiqiren1' : 'icon-xiaolian'"></i>
              </div>
              <div class="bubble" :class="msg.role">
                <template v-if="msg.films && msg.films.length">
                  <strong class="bubble-title">机器人：</strong>
                  <div class="film-lines">
                    <div v-for="film in msg.films" :key="film.id" class="film-item" @click="selectFilm(film)">{{
                      film.name }}</div>
                  </div>
                </template>
                <template v-else>{{ msg.text }}</template>
              </div>
            </div>
          </transition-group>
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
import { ref, computed, nextTick, onMounted } from 'vue'
import { searchMovie } from '../mock/index.js'
const props = defineProps({ show: { type: Boolean, default: false } })
const show = computed(() => props.show)
const emit = defineEmits(['close', 'select'])
const input = ref('')
const messages = ref([])

const isMobile = computed(() => window.innerWidth < 860 || /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent))
const transitionName = computed(() => isMobile.value ? 'robot-fade' : 'robot-drawer-right')

const STORAGE_KEY = 'robot_chat_history'
const MAX_HISTORY = 20

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) {
      messages.value = arr.map(m => ({
        id: Date.now() + Math.random(), // 重新生成 id 防止冲突
        role: m.role,
        text: m.text,
        films: Array.isArray(m.films) ? m.films : undefined
      }))
    }
  } catch (e) {
    console.warn('load history failed', e)
  }
}

function saveHistory() {
  try {
    const plain = messages.value.map(m => ({ role: m.role, text: m.text, films: m.films }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain.slice(-MAX_HISTORY)))
  } catch (e) {
    console.warn('save history failed', e)
  }
}

function pushMessage(msg) {
  messages.value.push({ id: Date.now() + Math.random(), ...msg })
  // 保留最后 MAX_HISTORY 条
  if (messages.value.length > MAX_HISTORY) {
    messages.value.splice(0, messages.value.length - MAX_HISTORY)
  }
  saveHistory()
  nextTick(() => {
    const body = document.querySelector('.robot-body')
    if (body) body.scrollTop = body.scrollHeight
  })
}

function selectFilm(film) {
  emit('select', { id: film.id, name: film.name })
  emit('close')
}

async function send() {
  const keyword = input.value.trim()
  if (!keyword) return
  pushMessage({ role: 'user', text: keyword })
  input.value = ''
  try {
    const res = await searchMovie(keyword)
    const list = res && Array.isArray(res.list) ? res.list : []
    if (list.length) {
      pushMessage({ role: 'bot', films: list.map(i => ({ id: i.id, name: i.name })) })
    } else {
      pushMessage({ role: 'bot', text: '未找到相关影片' })
    }
  } catch (e) {
    console.error(e)
    pushMessage({ role: 'bot', text: '查询失败，请稍后重试' })
  }
}
function close() { emit('close') }

onMounted(() => loadHistory())
</script>

<style scoped>
/* PC端右侧滑入滑出动画 */
.robot-drawer-right-enter-from,
.robot-drawer-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.robot-drawer-right-enter-to,
.robot-drawer-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.robot-drawer-right-enter-active,
.robot-drawer-right-leave-active {
  transition: transform .35s cubic-bezier(.25, .8, .25, 1), opacity .25s;
}

/* 移动端淡入淡出动画 */
.robot-fade-enter-from,
.robot-fade-leave-to {
  opacity: 0;
}

.robot-fade-enter-to,
.robot-fade-leave-from {
  opacity: 1;
}

.robot-fade-enter-active,
.robot-fade-leave-active {
  transition: opacity .25s;
}

.robot-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: 100vw;
  max-width: 500px;
  height: 100vh;
  background: #ffffff;
  color: #000;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.12);
}

.robot-drawer.mobile {
  left: 0;
  right: 0;
  width: 100vw;
  max-width: 100vw;
  box-shadow: none;
}

/* 聊天列表样式 */
.chat-list {
  display: flex;
  flex-direction: column;
  padding: 4px 0 12px;
}

.chat-row {
  display: flex;
  margin: 14px 0;
  padding: 0 8px;
}

.chat-row.user {
  flex-direction: row-reverse;
}

.chat-row.user .avatar {
  margin-left: 12px;
  margin-right: 0;
  background: #23ade5;
  color: #fff;
}

.chat-row.bot .avatar {
  margin-right: 12px;
  background: #eee;
  color: #555;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
}

.bubble {
  position: relative;
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 10px;
  line-height: 1.55;
  font-size: 15px;
  word-break: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .06);
}

.bubble.user {
  background: #23ade5;
  color: #fff;
}

.bubble.bot {
  background: #f5f5f5;
  color: #222;
}

/* 气泡三角 */
.bubble.user:after,
.bubble.bot:after {
  content: "";
  position: absolute;
  top: 14px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.bubble.bot:after {
  left: -12px;
  border-right-color: #f5f5f5;
}

.bubble.user:after {
  right: -12px;
  border-left-color: #23ade5;
}

.bubble-title {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.film-lines {
  display: block;
}

.film-item {
  cursor: pointer;
  padding: 4px 0;
  line-height: 1.4;
}

.film-item:hover {
  text-decoration: underline;
}

/* 单条消息过渡 */
.chat-msg-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.chat-msg-enter-active {
  transition: all .2s ease;
}

.chat-msg-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.chat-msg-leave-active {
  transition: all .2s ease;
}

.chat-msg-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 隐藏旧样式类 */
.robot-msg,
.robot-msg.user,
.robot-msg.bot {
  display: none;
}

.robot-drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  z-index: 200;
  display: flex;
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
  padding: 8px 0;
  overflow-y: auto;
  color: #000;
}

.robot-empty {
  color: #666;
  font-size: 14px;
  padding: 12px 16px;
}

.robot-footer {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.robot-footer input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #d9d9d9;
  background: #f7f7f7;
  color: #000;
  font-size: 14px;
}

.robot-footer input:focus {
  outline: 2px solid #c2e0f5;
}

.robot-footer button {
  background: #23ade5;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background .2s;
}

.robot-footer button:hover {
  background: #2fb6ec;
}

.robot-footer button:active {
  background: #1693c2;
}

@media (max-width: 600px) {
  .robot-header {
    font-size: 16px;
    padding: 12px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .bubble {
    font-size: 14px;
    padding: 8px 12px;
  }

  .robot-footer {
    padding: 10px 12px;
  }

  .robot-footer button {
    font-size: 13px;
    padding: 8px 16px;
  }
}
</style>
