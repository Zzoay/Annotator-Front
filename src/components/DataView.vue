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
    <div class="box">
        <div class="title">任务：对话依存分析 </div>
        <div class="statics">已标注/总计：1/550</div>
    </div>
  <ConvDataView> </ConvDataView>
</template>

<style scoped>
.box {
    display: block;
    width: 100%;
    height: 100%;
    padding: 30px;
    /* margin: 10px 0px 0px 10px; */
}
 
.title {
    float: left;
}

.statics {
    float: right;
    margin-right: 20px;
}
</style>
