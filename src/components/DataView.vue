<script setup lang="ts">
import {reactive, ref} from 'vue'

import Nav from './Nav.vue'
import SideBar from './SideBar.vue'
import ConvDataView from '@/components/conv_dep/ConvDataView.vue'

const curTabId = ref(0)
const tabs = reactive([])

function tabSelected(tabId: number) {
    console.log(tabId)
}
</script>

<template>
  <Nav></Nav>
  <ConvDataView> </ConvDataView>
</template>

<style>

</style>
