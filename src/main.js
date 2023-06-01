import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Clipboard from 'v-clipboard'


const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(Clipboard)

app.mount('#app')
