<template>
  <cord :title="props.name" :top="cordSize.top" :left="cordSize.left" :width="cordSize.width" :height="cordSize.height">
    <div ref="container" class="music-score-canvas-container">
    </div>
  </cord>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import runtime from '../runtime';
import WorkCanvas from '../services/WorkCanvas';
import Cord from './Cord.vue';

const props = defineProps({
  musicScoreBase64: String,
  name: String
});

let workCanvas: WorkCanvas | null = null;

const cordSize = reactive({
  width: ref(0),
  height: ref(0),
  top: ref(0),
  left: ref(0)
});

const container = ref<HTMLDivElement | null>(null);
const musicScoreImage = new Image();

onMounted(() => {
  workCanvas = new WorkCanvas();
  container.value && container.value.appendChild(workCanvas);
  musicScoreImage.src = props.musicScoreBase64 || "";
  
  musicScoreImage.onload = () => {
    cordSize.width = document.body.offsetWidth / 2,
    cordSize.height = musicScoreImage.height * ((document.body.offsetWidth / 2) / musicScoreImage.width),
    cordSize.top = document.body.offsetHeight / 6,
    cordSize.left = document.body.offsetWidth / 2 - document.body.offsetWidth / 4,
    
    nextTick(() => {
      workCanvas?.initSize();
    });
    workCanvas?.addEventListener("renderer", (event) => {
      workCanvas?.context?.drawImage(
        musicScoreImage,
        0, 0, musicScoreImage.width, musicScoreImage.width * ((workCanvas?.height || 1) / (workCanvas?.width || 1)),
        0, 0, (workCanvas?.width || 1) / 2, (workCanvas?.height || 1) / 2
      );
    });
  }
});

// musicScoreImage.onload = () => {
//   runtime.addEventListener("work-canvas:renderer", (event) => {
//     const canvas = ((event as any).detail as HTMLCanvasElement);
//     const canvasContext = canvas.getContext("2d");

//     canvasContext?.drawImage(
//       musicScoreImage,
//       0, 0, musicScoreImage.width, musicScoreImage.width * ((canvas.height || 1) / (canvas.width || 1)),
//       0, 0, (canvas.width || 1) / 2, (canvas.height || 1) / 2
//     );
//   });
// }

</script>
<style>
  .music-score-canvas-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .music-score-canvas-container canvas {
    transform:scale(0.5,0.5);
    transform-origin: 0 0;
  }
</style>