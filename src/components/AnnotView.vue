<script setup lang="ts">
import {reactive, ref} from 'vue'

import Nav from './Nav.vue'
import SideBar from './SideBar.vue'
import ConvDepView from '@/components/conv_dep/ConvDepView.vue'

const curTabId = ref(0)
const tabs = reactive([])

function tabSelected(tabId: number) {
    console.log(tabId)
}
</script>

<template>
  <Nav></Nav>
  <div class="row">
    <div class="col">
        <SideBar> </SideBar>
    </div>
    <div class="col-10">
        <ConvDepView> </ConvDepView>
    </div>
  </div>
</template>

<style>

</style>
