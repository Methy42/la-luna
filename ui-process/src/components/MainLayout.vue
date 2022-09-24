<template>
  <div class="main-layout-container">
    <header style="-webkit-app-region: drag;">
      <div class="logo-container">
        <img src="@/assets/logo-white.png" alt="">
      </div>
      <div class="action-container">
        <div class="la-icon-button" @click="minimize">
          <svg t="1663503745418" class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3807"><path d="M929.8 528.1H93.5c-15.5 0-28-12.5-28-28s12.5-28 28-28h836.3c15.5 0 28 12.5 28 28s-12.5 28-28 28z" fill="" p-id="3808"></path></svg>
        </div>
        <div v-if="isMaximize" class="la-icon-button" @click="unmaximize">
          <svg t="1663503543997" class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2194" data-spm-anchor-id="a313x.7781069.0.i0"><path d="M812.2 65H351.6c-78.3 0-142.5 61.1-147.7 138.1-77 5.1-138.1 69.4-138.1 147.7v460.6c0 81.6 66.4 148 148 148h460.6c78.3 0 142.5-61.1 147.7-138.1 77-5.1 138.1-69.4 138.1-147.7V213c0-81.6-66.4-148-148-148z m-45.8 746.3c0 50.7-41.3 92-92 92H213.8c-50.7 0-92-41.3-92-92V350.7c0-50.7 41.3-92 92-92h460.6c50.7 0 92 41.3 92 92v460.6z m137.8-137.7c0 47.3-35.8 86.3-81.8 91.4V350.7c0-81.6-66.4-148-148-148H260.2c5.1-45.9 44.2-81.8 91.4-81.8h460.6c50.7 0 92 41.3 92 92v460.7z" fill="" p-id="2195"></path></svg>
        </div>
        <div v-if="!isMaximize" class="la-icon-button" @click="maximize">
          <svg t="1663503807184" class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1683" data-spm-anchor-id="a313x.7781069.0.i0"><path d="M812.3 959.4H213.7c-81.6 0-148-66.4-148-148V212.9c0-81.6 66.4-148 148-148h598.5c81.6 0 148 66.4 148 148v598.5C960.3 893 893.9 959.4 812.3 959.4zM213.7 120.9c-50.7 0-92 41.3-92 92v598.5c0 50.7 41.3 92 92 92h598.5c50.7 0 92-41.3 92-92V212.9c0-50.7-41.3-92-92-92H213.7z" fill="" p-id="1684"></path></svg>
        </div>
        <div class="la-icon-button" @click="close">
          <svg t="1663503678336" class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3099"><path d="M546.942134 511.818772l327.456957-326.128977c9.617355-9.577423 9.648071-25.135361 0.070648-34.751692-9.577423-9.617355-25.137409-9.647048-34.750668-0.070648L512.119795 477.137729 184.520518 150.868479c-9.616331-9.577423-25.176316-9.545683-34.751692 0.070648-9.577423 9.616331-9.545683 25.174268 0.070648 34.751692l327.457981 326.127953-327.457981 326.128978c-9.616331 9.577423-9.647048 25.135361-0.070648 34.751692a24.496456 24.496456 0 0 0 17.41117 7.231702 24.500552 24.500552 0 0 0 17.340522-7.162078L512.119795 546.499816l327.599276 326.26925a24.492361 24.492361 0 0 0 17.340522 7.162078 24.5026 24.5026 0 0 0 17.41117-7.231702c9.577423-9.617355 9.545683-25.175292-0.070648-34.751692L546.942134 511.818772z" p-id="3100"></path></svg>
        </div>
      </div>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <div class="manufacturer-info-container">
        <span>@2022 by JINLI</span>
      </div>
      <div class="server-signal-container">
        <div class="diot-success"></div>
        <div>服务器连接正常</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

  const isMaximize = ref(false);

  (window as any).require("electron").ipcRenderer.send("main-window-is-maximize");

  (window as any).require("electron").ipcRenderer.on("main-window-is-maximize.cb", (event: any, result: boolean) => {
    console.log("main-window-is-maximize.cb", result);
    isMaximize.value = result;
  });

  function close() {
    (window as any).require("electron").ipcRenderer.send("main-window-close");
  }

  function maximize() {
    (window as any).require("electron").ipcRenderer.send("main-window-maximize");
  }

  function unmaximize() {
    (window as any).require("electron").ipcRenderer.send("main-window-unmaximize");
  }

  function minimize() {
    (window as any).require("electron").ipcRenderer.send("main-window-minimize");
  }
</script>
<style scoped>
  .main-layout-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    width: 100%;
    height: 120px;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
  }

  .logo-container {
    height: 120px;
  }

  .logo-container img {
    height: 100%;
  }

  .action-container {
    height: 100%;
    display: flex;
  }

  .action-container .la-icon-button {
    margin-top: 15px;
    margin-right: 15px;
  }

  main {
    flex-grow: 1;
  }

  footer {
    flex-shrink: 0;
    padding: 15px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .manufacturer-info-container {
    margin-right: 15px;
  }

  .server-signal-container {
    display: flex;
    align-items: center;
  }

  .server-signal-container .diot-success {
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-radius: 5px;
    background-color: green;
  }
</style>