<script setup lang="ts">
import {onBeforeMount, onMounted, getCurrentInstance, reactive, ref, ComponentInternalInstance, onBeforeUnmount, watch} from 'vue'
import SpanBtn from './SpanBtn.vue'
import DepLinkDraw from './DepLinkDraw.vue'
import Dialog from './Dialog.vue'
import Message from './Message.vue'
import { UteranceType, LinkType, TabType, RelshipType } from '../../types/ConvDepTypes'
import {getRelation, getConv, updateConvTagged, getConvId, getRelationship, postRelationship, deleteRelationship} from '@/api/api'
import bus from '@/libs/bus'

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
    <div class="box">
        <div class="title">任务：对话依存分析 </div>
        <div class="statics">已标注/总计：1/550</div>
    </div>
    <div class="table-view">
    <table class="table table-hover">
        <thead class="thead table-light">
        <tr>
            <th scope="col">索引</th>
            <th scope="col">文本</th>
            <th scope="col">状态</th>
            <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
            <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            </tr>
            <tr>
            <th scope="row">2</th>
            <td class="col-text">Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob JacobJacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            </tr>
            <tr>
            <th scope="row">3</th>
            <td colspan="2">Larry the Bird</td>
            <td>@twitter</td>
            </tr>
        </tbody>
    </table>
    </div>
</template>


<style>
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
</style>