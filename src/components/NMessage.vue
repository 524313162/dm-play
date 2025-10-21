<template>
    <!-- 容器仅在至少一行可见时出现 -->
    <div v-if="anyVisible" class="n-message-wrapper">
        <transition-group name="line-fade" tag="div" class="n-message-lines">
            <div v-for="line in lines" :key="line.key" v-show="line.visible" class="n-message-line"
                :class="'n-message-line--' + line.status">
                {{ line.text }}
            </div>
        </transition-group>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
// 三行：player / video / danmaku
const lines = ref([
    { key: 'player', text: '', status: 'loading', visible: false },
    { key: 'video', text: '', status: 'loading', visible: false },
    { key: 'danmaku', text: '', status: 'loading', visible: false }
])
const anyVisible = computed(() => lines.value.some(l => l.visible))
function updateLine(key, { text, status = 'info', visible = true } = {}) {
    const line = lines.value.find(l => l.key === key)
    if (!line) return
    if (text !== undefined) line.text = text
    if (status) line.status = status
    line.visible = visible
}
function hideAll() { lines.value.forEach(l => (l.visible = false)) }
defineExpose({ updateLine, hideAll })
</script>
<style scoped>
.n-message-wrapper {
    position: absolute;
    left: 12px;
    bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
}

.line-fade-enter-active,
.line-fade-leave-active {
    transition: opacity .25s ease;
}

.line-fade-enter-from,
.line-fade-leave-to {
    opacity: 0;
}

.n-message-line {
    min-width: 220px;
    max-width: 360px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    line-height: 1.4;
    color: #fff;
    background: rgba(0, 0, 0, .58);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, .3);
}

.n-message-line--loading {
    background: rgba(40, 40, 40, .65);
}

.n-message-line--success {
    background: rgba(0, 128, 64, .65);
}

.n-message-line--error {
    background: rgba(200, 32, 32, .75);
}

.n-message-line--info {
    background: rgba(0, 0, 0, .58);
}

.n-message-line--danmaku {
    background: rgba(58, 90, 160, .65);
}
</style>
