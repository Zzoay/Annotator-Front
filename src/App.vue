<script setup lang="ts">
import ConvDepView from './components/ConvDepView.vue'
</script>

<template>
  <ConvDepView> </ConvDepView>
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

#panel-btns{
  position: relative;
  /* background: #fff; */
  padding: 1rem;
  margin: 1rem;
  border-radius: 3px;
  text-align: center;
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08); */
  width: 100%;
}
</style>
