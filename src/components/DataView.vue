<script setup lang="ts">
import {reactive, ref, getCurrentInstance, ComponentInternalInstance} from 'vue'

import Nav from './Nav.vue'
import ConvDataView from '@/components/conv_dep/ConvDataView.vue'


const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
// @ts-ignore
// const assigns = JSON.parse(proxy.$route.params.assigns)
const assigns = reactive(JSON.parse(window.sessionStorage.assigns))
const finish_num = ref(0)
for (let i = 0; i < assigns.length; i++) {
    if (assigns[i].status === 2) finish_num.value += 1
}

async function routeTo(name) {
    window.sessionStorage.removeItem('assign_index')
    // @ts-ignore
    await proxy.$router.push({
        name: name,
        params: {
            'finish_num': JSON.stringify(finish_num.value), 
            'assigns': JSON.stringify(assigns)
        }
    })
}

</script>

<template>
  <Nav page-now="/data"></Nav>
  <div class="box">
    <div class="title"><b>任务：</b>对话依存分析 </div>
    <div class="statics">已标注/总计：{{finish_num}}/{{assigns.length}}</div>

    <router-link to="" class="btn btn-outline-primary" id="start_annot" @click.native="routeTo('annot')">开始标注</router-link>

  </div>
  <ConvDataView :assigns="assigns" :finish_num="finish_num"> </ConvDataView>
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
