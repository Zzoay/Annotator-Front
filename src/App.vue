<script setup lang="ts">
import ConvDepView from './components/ConvDepView.vue'
</script>

<template>
  <div id="main-panel">
    <ConvDepView> </ConvDepView>
  </div>
  <!-- <div id="panel-btns">
  <button class="btn btn-outline-secondary">
    上一个
  </button>
  <button class="btn btn-outline-secondary">
    确认
  </button>
  <button class="btn btn-outline-secondary">
    下一个
  </button>
  </div> -->
</template>

<style>
body {
    background: #eff8ff;
    height: 100vh;
    width: 100vw;
    font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }

#main-panel{
  position: relative;
  background: #fff;
  padding: 2rem;
  margin: 1rem;
  /* margin: 80px 0px 0px 0px; */
  border-radius: 3px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  width: 100%;
}

#panel-btns{
  position: relative;
  /* background: #fff; */
  padding: 1rem;
  margin: 1rem;
  border-radius: 3px;
  align-items: center;
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08); */
  width: 100%;
}
</style>
