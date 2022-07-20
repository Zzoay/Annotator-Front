<script setup lang="ts">
import { ref, reactive, getCurrentInstance, ComponentInternalInstance} from 'vue'
import { ProcessAssignType } from '../../types/common'
import { ConvType } from '../../types/ConvDepTypes'
import { getConv } from '@/api/api'


const props = defineProps<{ 
    assigns: ProcessAssignType,
    finish_num: number
}>()

let convIds: Array<number> = reactive([])
const convs: Array<ConvType> = reactive([])

async function init() {
    for (let i = 0; i < props.assigns.length; i++) {
        convIds.push(props.assigns[i].item_id)
    }
    for (let i = 0; i < convIds.length; i++) {
        let convId = convIds[i]
        await getConv(convId).then((response: any) => {
            // 默认是分句的, 这里直接拍平
            let conv: Array<string> = []
            for (let j = 0; j < response.length; j++) {
                // 这里的item指的是词语
                let items = response[j].items
                // 省略 ROOT
                for (let k = 1; k < items.length; k++) {
                    conv.push(items[k].word)
                }      
            }
            convs.push({
                'id': i,
                'content': conv.join(' ')
            })
        })
    }
} 
init()

// 分别对应状态码0,1,2. 1暂时保留
const status = reactive(['未标注', '正在标注', '已标注'])

const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
// const assigns = reactive(JSON.parse(window.sessionStorage.assigns))
// const finish_num = ref(JSON.parse(window.sessionStorage.finish_num))

async function routeTo(name, index) {
    window.sessionStorage.assign_index = index
    // @ts-ignore
    await proxy.$router.push({
        name: name,
        params: {
            // @ts-ignore
            'finish_num': JSON.stringify(props.finish_num), 
            'assigns': JSON.stringify(props.assigns),
            'assign_index': index
        }
    })
}

</script>

<template>
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