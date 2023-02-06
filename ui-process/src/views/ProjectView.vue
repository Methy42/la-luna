<template>
  <div class="page-container">
    <div class="music-score-container">
      <music-score />
    </div>
    <!-- <div class="music-container">
      <div class="la-button">选择乐曲</div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import MusicScore from "../components/MusicScore.vue";
import runtime from "../runtime";

runtime.addEventListener("change:music-score", (event) => {
  console.log("change:music-score", event);
});
</script>

<style scoped>
  .page-container {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  }

  .music-score-container {
    width: 60%;
    padding-left: 40px;
  }

  .music-container {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>