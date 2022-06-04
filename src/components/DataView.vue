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
  <Nav page-now="/data"></Nav>
    <div class="box">
        <div class="title"><b>任务：</b>对话依存分析 </div>
        <div class="statics">已标注/总计：0/550</div>

        <router-link
                to="/annot"
                custom
                v-slot="{ navigate }">
                <div class="btn btn-outline-primary" id="start_annot" @click="navigate"> 开始标注 </div>
        </router-link>

    </div>
  <ConvDataView> </ConvDataView>
</template>

<style scoped>
.box {
    display: block;
    width: 100%;
    height: 100%;
    padding: 28px 30px 35px 30px;
    /* margin: 10px 0px 0px 10px; */
}
 
.title {
    float: left;
    font-size: 18px;
}

.statics {
    float: right;
    margin-right: 20px;
    font-size: 18px;
}

#start_annot {
    float: right;
    margin-right: 45px;  
    padding: 1px;
    font-size: 17px;
    color: #356dc9;
}

#start_annot:hover {
    /* color: #144dab; */
    color: #fff;
}
</style>
