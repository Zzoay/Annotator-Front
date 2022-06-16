import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'element-plus/dist/index.css'

import '@/assets/css/globalVariable.css'

import router from '@/router/index'
import { store } from '@/store/index'


const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(store)

app.mount('#app')
