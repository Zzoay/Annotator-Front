<script setup lang="ts">
import { ref } from 'vue'
import { UteranceType } from '../../types/ConvDepTypes'
import { getConv, getConvId } from '@/api/api'

// data ------------>
const header = '对话依存分析'


let convId = ref(0)
const conversation = ref<Array<UteranceType>>([])


async function init() {
    await getConvId().then((response: any) => {
        let res = response.data
        convId.value = res['conv_id']
    })
    await getConv(convId.value).then((response: any) => {
        let res = response.data
        for (let i = 0; i < res.length; i++) {
            conversation.value.push(res[i])
        }
    })
} 
init()

</script>

<template>
    <!-- <h5 class="title"> 对话依存分析  </h5> -->
    <div class="table-view">
    <table class="table table-hover">
        <thead class="thead table-light">
        <tr>
            <th scope="col">索引</th>
            <th scope="col">数据</th>
            <th scope="col">状态</th>
            <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
            <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td><router-link to="" class="router-link">标注</router-link></td>
            </tr>
            <tr>
            <th scope="row">2</th>
            <td class="col-text">Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob</td>
            <td>Thornton</td>
            <td><router-link to="" class="router-link">标注</router-link></td>
            </tr>
            <tr>
            <th scope="row">3</th>
            <td colspan="2">Larry the Bird</td>
            <td ><router-link to="" class="router-link">标注</router-link></td>
            </tr>
        </tbody>
    </table>
    </div>
</template>


<style scoped>
.table-view {
    display: block;
    margin: 20px 10px 2px 10px;
}

.table {
    padding: 2px;
}

.thead {
   vertical-align: bottom;
   border-bottom: 2px solid hsl(0, 0%, 87%);
}

.col-text {
    width: 80%;
    max-width: 1200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.link {
    text-decoration: none;
    color: #09585d;
}

</style>