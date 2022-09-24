<template>
  <div class="page-container">
    <div class="left-container">
      <div class="la-button">选择乐谱</div>
      <div class="width-15px"></div>
      <div class="la-button">打开项目</div>
    </div>
    <div class="right-container">
      <div class="la-title">历史工程</div>
      <div class="history-container">
        <div class="project-container">
          <div class="project-info">
            <div class="name">工程一</div>
            <div class="time">2022-09-18 20:20:20</div>
          </div>
          <div class="height-15px"></div>
          <div class="project-path">
            <span>D:\projects\工程一</span>
          </div>
        </div>
        <div class="la-split-line"></div>
        <div class="project-container">
          <div class="project-info">
            <div class="name">工程一</div>
            <div class="time">2022-09-18 20:20:20</div>
          </div>
          <div class="height-15px"></div>
          <div class="project-path">
            <span>D:\projects\工程一</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .page-container {
    height: 100%;
  }

  .left-container {
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .right-container {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .right-container .la-title {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    flex-shrink: 0;
  }

  .history-container {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    flex-grow: 1;
    overflow: auto;
  }

  .project-container {
    display: flex;
    flex-direction: column;
  }

  .project-info {
    display: flex;
    justify-content: space-between;
  }
</style>