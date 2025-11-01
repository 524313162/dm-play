<template>
    <template v-if="reserve && adList.length === 0">
        <div :style="placeholderStyle" class="advertisement-placeholder">
            广告位招租
        </div>
    </template>
    <template v-else-if="isJsonAd">
        <template v-for="(img, idx) in currentAd.data" :key="idx">
            <a :href="img.url" target="_blank" :style="adStyle" class="ad-img-list advertisement-container">
                <img :src="img.cover" :style="{ width: adStyle.width, height: adStyle.height, objectFit: 'cover' }" />
            </a>
        </template>
    </template>
    <template v-else-if="isScriptAd">
        <div :style="adStyle" class="advertisement-container" ref="adScriptContainer"></div>
    </template>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { getAdAsync } from '../mock/ad.js'
import { getRandomAdByWeight, random } from '../unit/utils.js'

const props = defineProps({
    code: { type: [Number, String], required: true },
    name: { type: String, default: '' },
    interval: { type: Array, default: () => [60, 600] },
    switch: { type: Boolean, default: false },
    area: { type: Object, default: () => ({}) },
    reserve: { type: Boolean, default: false },
})

const adList = ref([])
const currentAd = ref(null)
const adScriptContainer = ref(null)
let countdownFun = null

const isJsonAd = computed(() => currentAd.value && currentAd.value.type === 'json' && Array.isArray(currentAd.value.data) && currentAd.value.data.length > 0)
const isScriptAd = computed(() => currentAd.value && currentAd.value.type === 'script' && typeof currentAd.value.script === 'string')

function getStyleValue(val, fallback) {
    if (typeof val === 'string') return val
    if (typeof val === 'number') return val + 'px'
    return fallback
}

const adStyle = computed(() => {
    let sty = { width: '100%', height: '100%' }
    if (currentAd.value?.width !== undefined) sty.width = getStyleValue(currentAd.value.width, sty.width)
    else if (props.area.width !== undefined) sty.width = getStyleValue(props.area.width, sty.width)
    if (currentAd.value?.height !== undefined) sty.height = getStyleValue(currentAd.value.height, sty.height)
    else if (props.area.height !== undefined) sty.height = getStyleValue(props.area.height, sty.height)
    return sty
})

const placeholderStyle = computed(() => {
    let sty = { width: '100%', height: '50px', color: '#888', display: 'flex', justifyContent: 'center', alignItems: 'center' }
    if (props.area.width !== undefined) sty.width = getStyleValue(props.area.width, sty.width)
    if (props.area.height !== undefined) sty.height = getStyleValue(props.area.height, sty.height)
    return sty
})

function startSwitch() {
    if (countdownFun) clearTimeout(countdownFun)
    const doSwitch = () => {
        let candidates = adList.value.filter(a => a.id !== currentAd.value?.id)
        const nextAd = getRandomAdByWeight(candidates)
        if (nextAd) {
            currentAd.value = nextAd
            const interval = random(props.interval[0], props.interval[1])
            countdownFun = setTimeout(doSwitch, interval * 1000)
        } else {
            countdownFun = null
        }
    }
    const interval = random(props.interval[0], props.interval[1])
    countdownFun = setTimeout(doSwitch, interval * 1000)
}

async function fetchAds() {
    if (!props.code) return
    const adRes = await getAdAsync({ id: props.code, name: props.name, platform: 'H5' })
    if (adRes.state === 1 && Array.isArray(adRes.data) && adRes.data.length > 0) {
        adList.value = adRes.data
        const firstAd = getRandomAdByWeight(adList.value)
        if (firstAd) {
            currentAd.value = firstAd
            if (props.switch && adList.value.length > 1) {
                startSwitch()
            }
        } else {
            currentAd.value = null
        }
    } else {
        adList.value = []
        currentAd.value = null
    }
}

function clearScript() {
    if (adScriptContainer.value) adScriptContainer.value.innerHTML = ''
}

function renderScriptAd() {
    if (!isScriptAd.value) return
    nextTick(() => {
        clearScript()
        if (adScriptContainer.value && currentAd.value.script) {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.innerHTML = currentAd.value.script
            adScriptContainer.value.appendChild(script)
        }
    })
}

watch(currentAd, () => {
    if (isScriptAd.value) {
        renderScriptAd()
    } else {
        clearScript()
    }
})

onMounted(() => {
    fetchAds()
    if (isScriptAd.value) renderScriptAd()
})
onBeforeUnmount(() => {
    if (countdownFun) clearTimeout(countdownFun)
    clearScript()
})
watch(() => props.code, fetchAds)
</script>

<style scoped>
.advertisement-placeholder {
    color: #888;
    display: flex;
    align-items: center;
    justify-content: center;
}

.advertisement-placeholder .ad-name {
    font-weight: bold;
    color: #23ade5;
    margin-right: 8px;
}

.advertisement-container,
.ad-img-list {
    background: transparent !important;
}
</style>
