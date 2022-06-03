<script setup lang="ts">
import AnnotView from './components/AnnotView.vue'
import DataView from './components/DataView.vue'
import Home from './components/Home.vue';

import { useRoute } from 'vue-router'

const route = useRoute();
</script>

<template>
  <Home v-if="route.name === 'home'" />
  <DataView v-if="route.name === 'conv_data'"></DataView>
  <AnnotView v-if="route.name === 'conv_annot'"></AnnotView>
</template>

<style>
body {
    background: #eff8fff9;
    height: 100vh;
    width: 100vw;
    font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    /* display: flex;
    justify-content: center; 
    align-items: center; */
    margin: 0;
    padding: 0;
  }

</style>
