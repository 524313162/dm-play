<template>
    <div class="search-page">
        <div class="search-title">{{ now }}</div>
        <div class="search-main">
            <div class="search-box">
                <input v-model="keyword" @keyup.enter="onSearch" class="search-input" :placeholder="placeholder" />
                <button class="search-btn" @click="onSearch">
                    <i class="iconfont icon-duihuajiqiren1"></i>
                </button>
            </div>
            <div class="search-hot">
                <div class="hot-title">热门推荐</div>
                <div class="hot-list">
                    <button v-for="item in hotList" :key="item.id" class="hot-item" @click="onHot(item)">
                        <i class="iconfont icon-fire" style="color:#ff7e29;margin-right:6px;"></i>{{ item.name }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
const emit = defineEmits(['playUrl', 'showRobot'])
const keyword = ref('')
const now = ref('')
const placeholder = '请输入视频名称、链接，支持 .m3u8/mp4/flv'
const hotList = ref([
    { name: '长安三万里', id: '001' },
    { name: '孤注一掷', id: '002' },
    { name: '消失的她', id: '003' },
    { name: '流浪地球2', id: '004' },
    { name: '满江红', id: '005' },
    { name: '封神第一部', id: '006' },
    { name: '八角笼中', id: '007' },
    { name: '热烈', id: '008' },
    { name: '人生路不熟', id: '009' },
    { name: '速度与激情10', id: '010' }
])
function updateTime() {
    const d = new Date()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    const s = String(d.getSeconds()).padStart(2, '0')
    now.value = `${h}:${m}:${s}`
}
onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
})
function isUrl(str) {
    const val = str.trim()
    // 支持主流视频直链、m3u8、mp4、flv、avi、mov、wmv、rmvb、mkv、ts、webm、rtmp、ftp、magnet、ed2k、thunder、acestream、bilibili、alivideo、aliyun、pan.baidu、youtube、tencent、iqiyi、youku、sohu、mgtv、pptv、letv、xigua、m1905、wasu、tv.sohu
    return /^(https?:\/\/|rtmp:\/\/|ftp:\/\/|magnet:\/\/|ed2k:\/\/|thunder:\/\/|acestream:\/\/|bilibili:\/\/|alivideo:\/\/|aliyun:\/\/|pan\.baidu\.com\/|youtube\.com\/|tencent\.com\/|iqiyi\.com\/|youku\.com\/|sohu\.com\/|mgtv\.com\/|pptv\.com\/|letv\.com\/|xigua\.com\/|m1905\.com\/|wasu\.cn\/|tv\.sohu\.com\/).+/i.test(val)
        || /\.(m3u8|mp4|flv|avi|mov|wmv|rmvb|mkv|ts|webm)(\?.*)?$/i.test(val)
}
function onSearch() {
    const val = keyword.value.trim()
    if (val && isUrl(val)) {
        // 直接跳转播放，emit事件让父组件处理
        emit('playUrl', { e: 'url', data: val })
    } else {
        // 弹出机器人对话框
        emit('showRobot', val)
    }
}
function onHot(item) {
    emit('playUrl', { e: 'id', data: item.id })
}
</script>

<style scoped>
.search-page {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    color: #fff;
    background: radial-gradient(ellipse at center, #0a2e38 0, #000 70%);
    z-index: 1;
    box-sizing: border-box;
}

.search-title {
    font-size: 2rem;
    font-weight: 500;
    color: #fff;
    margin-bottom: 32px;
    letter-spacing: 1px;
    text-align: center;
}

.search-main {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-box {
    display: flex;
    width: 100%;
    margin-bottom: 30px;
    border-radius: 5px;
    overflow: hidden;
    background: #f7fbfd;
    box-shadow: 0 2px 12px 0 rgba(35, 173, 229, 0.08);
}

.search-input {
    flex: 1;
    padding: 16px 20px;
    font-size: 14px;
    border: none;
    outline: none;
    background: transparent;
    color: #111;
    border-radius: 0;
    transition: box-shadow .2s, background .2s;
}

.search-input::placeholder {
    color: #888;
    opacity: 1;
}

.search-input:focus {
    box-shadow: 0 0 0 2px #23ade5;
    background: #fff;
}

.search-btn {
    padding: 0 28px;
    font-size: 22px;
    background: #f7fbfd;
    color: #111;
    border: none;
    border-radius: 0 12px 12px 0;
    cursor: pointer;
    transition: background .2s, box-shadow .2s;
    display: flex;
    align-items: center;
    font-weight: 600;
    box-shadow: none;
    height: 100%;
}

.search-btn:hover {
    background: #e3f0ff;
    color: #999;
}

.search-btn .iconfont {
    font-size: 26px;
    color: #999;
    margin-right: 0;
}

.search-hot {
    width: 100%;
    margin-top: 10px;
}

.hot-title {
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    font-weight: 500;
    letter-spacing: 1px;
}

.hot-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-start;
}

.hot-item {
    background: none;
    color: #fff;
    border: none;
    border-radius: 0;
    padding: 4px 10px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: color .2s;
    font-weight: 400;
    box-shadow: none;
    display: flex;
    align-items: center;
}

.hot-item:hover {
    color: #23ade5;
    background: none;
    box-shadow: none;
}

@media (max-width: 600px) {
    .search-main {
        max-width: 99vw;
        padding: 0 2vw;
    }

    .search-title {
        font-size: 2rem;
        margin-bottom: 18px;
    }

    .search-box {
        margin-bottom: 18px;
        border-radius: 8px;
    }

    .search-input,
    .search-btn {
        font-size: 14px;
        padding: 12px 15px;
    }

    .hot-item {
        font-size: 14px;
        padding: 5px 10px;
    }
}
</style>