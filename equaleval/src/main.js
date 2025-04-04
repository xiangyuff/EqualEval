import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import "@/assets/less/index.less"
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import '@/api/mock.js'
import api from '@/api/api'
import * as echarts from 'echarts';

document.title = 'equaleval';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$api = api;
app.config.globalProperties.$echarts = echarts;
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');
