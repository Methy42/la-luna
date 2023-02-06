<template>
  <div class="cord-container" :style="{
    top: `${ top }px`,
    left: `${ left }px`,
    width: `${ width }px`,
    height: `${ height }px`
  }">
    <div class="cord-header" style="-webkit-app-region: none;">
      <div class="cord-title" @mousedown="mousedownOnHeader">{{ title }}</div>
      <div class="cord-actions">
        <icon-close />
      </div>
    </div>
    <div class="cord-main">
      <slot name="default"></slot>
    </div>
    <div class="top-line" @mousedown="setResizeType('top')" style="-webkit-app-region: none;"></div>
    <div class="bottom-line" @mousedown="setResizeType('bottom')" style="-webkit-app-region: none;"></div>
    <div class="left-line" @mousedown="setResizeType('left')" style="-webkit-app-region: none;"></div>
    <div class="right-line" @mousedown="setResizeType('right')" style="-webkit-app-region: none;"></div>
    <div class="top-left-diot" @mousedown="setResizeType('top-left')" style="-webkit-app-region: none;"></div>
    <div class="top-right-diot" @mousedown="setResizeType('top-right')" style="-webkit-app-region: none;"></div>
    <div class="bottom-left-diot" @mousedown="setResizeType('bottom-left')" style="-webkit-app-region: none;"></div>
    <div class="bottom-right-diot" @mousedown="setResizeType('bottom-right')" style="-webkit-app-region: none;"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import runtime from "../runtime";
import IconClose from "./icons/IconClose.vue";

const props = defineProps({
  width: {
    type: Number,
    min: 100
  },
  height: {
    type: Number,
    min: 100
  },
  top: Number,
  left: Number,
  title: String
});

const emits = defineEmits(["resize", "resized"]);

onMounted(() => {
  watchEffect(() => {
    top.value = props.top || 0;
    left.value = props.left || 0;
    width.value = props.width || 100;
    height.value = props.height || 100;
    emits("resize");
  });
});


const title = ref(props.title || "title");

const top = ref(props.top || 0);
const left = ref(props.left || 0);

const width = ref(props.width || 100);
const height = ref(props.height || 100);

const canDrop = ref(false);
type tResizeType = "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | null;
const resizeType = ref<tResizeType>(null);

runtime.addEventListener("mouseup", () => {
  canDrop.value = false;
  if (resizeType) emits("resized");
  setResizeType(null);
});

const mousedownOnHeader = () => {
  console.log("mousedownOnHeader");
  canDrop.value = true;
}

onmousemove = (event) => {
  if (canDrop.value) {
    top.value += event.movementY;
    left.value += event.movementX;
  } else if (resizeType.value) {
    if (resizeType.value === "top") {
      top.value += event.movementY;
      height.value -= event.movementY;
    } else if (resizeType.value === "bottom") {
      height.value += event.movementY;
    } else if (resizeType.value === "left") {
      left.value += event.movementX;
      width.value -= event.movementX;
    } else if (resizeType.value === "right") {
      width.value += event.movementX;
    } else if (resizeType.value === "top-left") {
      top.value += event.movementY;
      left.value += event.movementX;

      width.value -= event.movementX;
      height.value -= event.movementY;
    } else if (resizeType.value === "top-right") {
      top.value += event.movementY;

      width.value += event.movementX;
      height.value -= event.movementY;
    } else if (resizeType.value === "bottom-left") {
      left.value += event.movementX;

      width.value -= event.movementX;
      height.value += event.movementY;
    } else if (resizeType.value === "bottom-right") {
      width.value += event.movementX;
      height.value += event.movementY;
    }

    width.value < 100 && (width.value = 100);
    height.value < 100 && (height.value = 100);

    emits("resize");
  }
}

const setResizeType = (newType: tResizeType) => {
  resizeType.value = newType;
}
</script>
<style scoped>
.cord-container {
  border: 1px solid #333333;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.75);
  position: absolute;
}

.cord-header {
  height: 28px;
  display: flex;
  flex-shrink: 0;
}
.cord-title {
  color: #ffffff;
  font-size: 14px;
  line-height: 28px;
  padding-left: 5px;
  flex-grow: 1;
}
.cord-actions {
  font-size: 14px;
  width: 28px;
  flex-shrink: 0;
  line-height: 28px;
  text-align: right;
  padding-right: 5px;
}

.cord-container .top-line {
  position: absolute;
  top: 0px;
  left: 5px;
  right: 5px;
  height: 1px;
  cursor: ns-resize;
}
.cord-container .bottom-line {
  position: absolute;
  bottom: 0px;
  left: 5px;
  right: 5px;
  height: 1px;
  cursor: ns-resize;
}
.cord-container .left-line {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0px;
  width: 1px;
  cursor: ew-resize;
}
.cord-container .right-line {
  position: absolute;
  top: 5px;
  bottom: 5px;
  right: 0px;
  width: 1px;
  cursor: ew-resize;
}

.cord-container .top-left-diot {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 5px;
  height: 5px;
  cursor: nwse-resize;
}
.cord-container .top-right-diot {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 5px;
  height: 5px;
  cursor: nesw-resize;
}
.cord-container .bottom-left-diot {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 5px;
  height: 5px;
  cursor: nesw-resize;
}
.cord-container .bottom-right-diot {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 5px;
  height: 5px;
  cursor: nwse-resize;
}

.cord-main {
  flex-grow: 1;
}
</style>