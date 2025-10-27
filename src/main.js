import { createApp } from 'vue'
import App from './App.vue'
import { initGlobalDeviceFlag, initGlobalSystemConfig } from './unit/utils.js'

initGlobalSystemConfig()
initGlobalDeviceFlag()

createApp(App).mount('#app')
