<template>
  <div class="app-container" @dragenter="dragenterFile" @dragover="dragoverFile" @drop="dropFile">
    <RouterView />
    <div class="drop-mask" v-if="isDrop">
      <div class="drop-label">拖拽文件到此上传</div>
    </div>
  </div>

  <template v-for="(cord, index) in cordList" :key="index" :title="cord.title">
    <music-score v-if="cord.contentType === 'image'"
      :music-score-base64="cord.contentResourcesBase64"
      :name="cord.name"
    />
  </template>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { DROP_FILES } from "./services/actionType";
import project from './modules/Project';
import runtime from "./runtime";

const $router = useRouter();
const isDrop = ref(false);
const projectLoading = ref(false);
const cordList = ref<Array<{
  name: string;
  contentType: "image" | "audio";
  contentResourcesBase64: string;
}>>([]);

runtime.addEventListener("change:music-score", (event) => {
  cordList.value.push({
    // width: document.body.offsetWidth / 2,
    // height: image.height * ((document.body.offsetWidth / 2) / image.width),
    // top: document.body.offsetHeight / 6,
    // left: document.body.offsetWidth / 2 - document.body.offsetWidth / 4,
    name: (event as CustomEvent).detail.name,
    contentType: "image",
    contentResourcesBase64: (event as CustomEvent).detail.base64
  });
});

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

* {
  user-select:none;
}
</style>