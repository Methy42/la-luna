import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import history from './modules/History';
import project from './modules/Project';

import './assets/main.css'

const app = createApp(App)

app.use(router);

app.mount('#app')

window.AppContext = app;