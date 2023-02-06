<template>
  <div class="main-layout-container">
    <header style="-webkit-app-region: drag;">
      <div class="logo-container">
        <img src="@/assets/logo-white.png" alt="">
      </div>
      <div class="action-container">
        <div class="la-icon-button" @click="runtime.minimize">
          <icon-minimize />
        </div>
        <div v-if="runtime.isMaximize.value" class="la-icon-button" @click="runtime.unmaximize">
          <icon-un-maximize />
        </div>
        <div v-if="!runtime.isMaximize.value" class="la-icon-button" @click="runtime.maximize">
          <icon-maximize />
        </div>
        <div class="la-icon-button" @click="runtime.close">
          <icon-close />
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
      <div class="server-signal-container" @click="showServerWindow">
        <div class="diot-success"></div>
        <div>服务器连接正常</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import runtime from "../runtime";
import IconMinimize from "./icons/IconMinimize.vue";
import IconUnMaximize from "./icons/IconUnMaximize.vue";
import IconMaximize from "./icons/IconMaximize.vue";
import IconClose from "./icons/IconClose.vue";

const showServerWindow = function () {
  (window as any).require("electron").ipcRenderer.send("show-server-window");
}
</script>
<style scoped>
  .main-layout-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    overflow: auto;
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