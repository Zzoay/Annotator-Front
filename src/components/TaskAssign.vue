<script setup lang="ts">
import {ref, reactive, getCurrentInstance, ComponentInternalInstance} from 'vue'
import { AssignType } from '@/types/common'
import {getProcess, getProcessAssign} from '@/api/api'
import Nav from './Nav.vue'

const userInfo = JSON.parse(window.sessionStorage.userInfo)

const processIds: Array<number> = reactive([])
const processAssigns: Array<AssignType> = reactive([])
const finishs: Array<number> = reactive([])
async function init() {
    await getProcess(userInfo.id).then((response: any) => {
        for (let i = 0; i < response.length; i++) {
            processIds.push(response[i].id)
        }
    })

    for (let i = 0; i < processIds.length; i++) {
        let oneProcess = []
        let finishNum = 0
        await getProcessAssign(processIds[i]).then((response: any) => {
            for (let j = 0; j < response.length; j++) {
                // @ts-ignore
                oneProcess.push(response[j])
                if (response[j].status === 2) finishNum += 1  // 状态码2表示完成
            }
        })
        processAssigns.push({
            'id': i,
            'processAssign': oneProcess
        })
        finishs.push(finishNum)
    }
}
init()

const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
async function routeTo(name, index) {
    window.sessionStorage.finish_num = JSON.stringify(finishs[index])
    window.sessionStorage.assigns = JSON.stringify(processAssigns[index].processAssign)
    window.sessionStorage.removeItem('assign_index')
    // @ts-ignore
    await proxy.$router.push({
        name: name,
        params: {
            'finish_num': JSON.stringify(finishs[index]), 
            'assigns': JSON.stringify(processAssigns[index].processAssign)
        }
    })
}
</script>

<template>

<Nav page-now="/task_assign"></Nav>

<div class="main-view">
    <div class = "row">
    <div v-for="(assign, index) in processAssigns" :key="assign.id" class="card" style="width: 18rem;">
        <div class="card-header">
            任务分配
        </div>
        <div class="card-body">
            <h5 class="card-title"><b> 当前进度 </b></h5>
            <p class="card-text">- {{finishs[index]}} / {{assign.processAssign.length}}</p>
            <div class="links">
                <router-link to="/data" class="router-link" @click.native="routeTo('data', index)">查看数据</router-link>
                <router-link to="/annot" class="router-link" @click.native="routeTo('annot', index)">开始标注</router-link>
            </div>
        </div>
    </div>
    </div>
</div>

</template>

<style scoped>

.main-view {
    display: block;
    margin: 10px;
    padding: 2px 0px 0px 10px;
}

.card {
    margin: 10px 15px 10px 10px;
    padding: 5px;
}

.card-text {
    width: 100%;
    height: 30px;   
    overflow: hidden;
    text-overflow: ellipsis;
}

.links {
    display: block;
    text-align: justify;
}

.router-link {
    margin: 5px 15px 0px 5px;
}

</style>