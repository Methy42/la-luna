import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import history from './services/modules/History';
import project from './services/modules/Project';

import './assets/main.css'

const app = createApp(App)

app.use(router);
app.use(project);

app.mount('#app')

window.AppContext = app;