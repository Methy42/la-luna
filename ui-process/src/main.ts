import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import runtime from './runtime';

import './assets/main.css'
import WorkCanvas from './services/WorkCanvas';

customElements.define("work-canvas", WorkCanvas, {extends:'canvas'});

const app = createApp(App)

app.use(router);
app.use(runtime);

app.mount('#app')

window.AppContext = app;