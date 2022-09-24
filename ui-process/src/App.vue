<template>
  <div class="app-container" @dragenter="dragenterFile" @dragover="dragoverFile" @drop="dropFile">
    <RouterView />
    <div class="drop-mask" v-if="isDrop">
      <div class="drop-label">拖拽文件到此上传</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { DROP_FILES } from "./services/actionType";
import project from './services/modules/Project';

const isDrop = ref(false);
const projectLoading = ref(false);

function dragenterFile (payload: DragEvent) {
  payload.preventDefault();
  console.log("dragenter file", payload.dataTransfer?.files);
  isDrop.value = true;
}
function dragoverFile (payload: DragEvent) {
  payload.preventDefault();
}
function dropFile (payload: DragEvent) {
  payload.preventDefault();
  const files = payload.dataTransfer?.files;
  console.log("drop file", payload.dataTransfer?.files);
  isDrop.value = false;
  
  if (files) {
    projectLoading.value = true;
    project[DROP_FILES](files);
  }
  
}
</script>
<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
}
.drop-mask {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.drop-label {
  color: #FFFFFF;
  font-size: 28px;
}
</style>