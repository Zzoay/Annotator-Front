<script setup lang="ts">
import { ref, reactive, getCurrentInstance, ComponentInternalInstance} from 'vue'
import { UteranceType } from '../../types/ConvDepTypes'
import { getConv, getConvId } from '@/api/api'


const header = '对话依存分析'

const props = defineProps<{ 
    // TODO: 类型定义
    assigns: Array<Object>,
    finish_num: number
}>()

let convIds = reactive([])
// TODO: 类型定义
const convs = reactive([])

async function init() {
    for (let i = 0; i < props.assigns.length; i++) {
        // @ts-ignore
        if (props.assigns[i].status === 0) {
            // @ts-ignore
            convIds.push(props.assigns[i].item_id)
        }
    }
    for (let i = 0; i < convIds.length; i++) {
        let convId = convIds[i]
        await getConv(convId).then((response: any) => {
            // 默认是分句的, 这里直接拍平
            let conv = []
            for (let j = 0; j < response.length; j++) {
                // 这里的item指的是词语
                let items = response[j].items
                for (let k = 0; k < items.length; k++) {
                    // @ts-ignore
                    conv.push(items[k].word)
                }      
            }
            convs.push({
                // @ts-ignore
                'id': i,
                // @ts-ignore
                'content': conv.join(' ')
            })
        })
    }
} 
init()

// 分别对应状态码0,1,2. 1暂时保留
const status = reactive(['未标注', '正在标注', '已标注'])


const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
// @ts-ignore
const assigns = JSON.parse(proxy.$route.params.assigns)
// @ts-ignore
const finish_num = JSON.parse(proxy.$route.params.finish_num)
async function routeTo(name, index) {
    // @ts-ignore
    await proxy.$router.push({
        name: name,
        params: {
            // @ts-ignore
            'finish_num': JSON.stringify(finish_num), 
            'assigns': JSON.stringify(assigns),
            'assign_index': index
        }
    })
}

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
            <tr v-for="(conv, index) in convs" :key="conv.id">
                <th scope="row">{{assigns[index].id}}</th>
                <td class="col-text">{{conv.content}}</td>
                <td>{{status[assigns[index].status]}}</td>
                <td><router-link to="" class="router-link" @click="routeTo('annot', index)">标注</router-link></td>
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
    width: 82%;
    max-width: 1200px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    word-wrap: break-word;
    white-space: nowrap;
}

.link {
    text-decoration: none;
    color: #09585d;
}

</style>