// @ts-ignore 
<script setup lang="ts">
import {onBeforeMount, reactive, ref} from 'vue'
import LinkTabs from './LinkTabs.vue'
import SpanBtn from './SpanBtn.vue'
import DepLinkDraw from './DepLinkDraw.vue'
import { ItemType, UteranceType, LinkType } from '../types/ConvDepTypes'
import {getConv, getConvIds} from '../api/api'


// data ------------>
const header = '对话依存分析'

// TODO: 从后端添加(动态或静态)
const tabs = [
    { id: 0, name: '当事', linkColor: '#F1C757' },
    { id: 1, name: '施事', linkColor: '#6BB06C' },
    { id: 2, name: '受事', linkColor: '#57AAF1' },
    { id: 3, name: '涉事', linkColor: '#8F6BB0' },
]
const curTab = ref(tabs[0])

const convIds: Array<Number> = reactive([])
const convId = ref(0)
const convs: Array<UteranceType> = reactive([])

async function init() {
    await getConvIds().then((response: any) => {
        let res = response.data
        for (let i = 0; i < res.length; i++) {
            convIds.push(res[i]['conv_id'])
        }
    })

    convId.value = Number(convIds[0])

    await getConv(convId.value).then((response: any) => {
        let res = response.data
        for (let i = 0; i < res.length; i++) {
            convs[i] = res[i]
            }
        }
        )
} 

let selectedId = ref("")
let start: number[] = []
let end: number[] = []
let links = ref<Array<Array<LinkType>>>([[]])  // 默认第0层为上下连接
let linkNums = 0 // 连接的数量，包括删除的，用以保证连接id的唯一性
const levelHigh = 25  // 单层高度
// <----------------


// hooks -------->
onBeforeMount(() =>{
    init()
})
// <-------


// methods -------------->
function calCrdns(start: number[], end: number[], highOffset: number, curLevel: number) {
    // 防止连接重合，需要进行动态的横向偏移
    let offset = 15 - 5 * (curLevel + 1)
    if (start[0] > end[0]){  // 默认右向连接，如果左向则offset取反
        offset = - offset
    }
    // +20是预估的默认值，offset为0时，连接的起点和终点大致上在中间位置
    let startStr = (start[0] + 20 + offset).toString() + ',' + (start[1]).toString()
    let mid1 = (start[0] + 20 + offset).toString() + ',' + highOffset.toString()
    let mid2 = (end[0] + 20 - offset).toString() + ',' + highOffset.toString()
    let endStr = (end[0] + 20 - offset).toString() + ',' + (end[1] - 10).toString()
    return startStr + ' ' + mid1 + ' ' + mid2 + ' ' + endStr
}

function selectAndLink(utrId: number, itemId: number, target: any) {  // 事实上是TargetEvent,但此处会报错：没有offsetLeft和offsetTop
    // 对span进行连接
    if (selectedId.value != "") {
        end = [target.offsetLeft, target.offsetTop]
        // let start = this.start
        // let end = this.end
        let highOffset = target.offsetTop
        
        // 同一高度的span进行连接，为防止重合，需要进行全局的调度
        if (start[1] == end[1]) {
            schedule(start, end, highOffset)
        }
        // 不同高度的span进行连接
        else {
            console.log("不同高度的span进行连接")
            linkDiffHigh(start, end)
        }
    }
    else {
        selectedId.value = utrId + '-' + itemId
        start = [target.offsetLeft, target.offsetTop]
    }
}

function schedule(start: number[], end: number[], highOffset: number, curLevel = 1, relType: number = curTab.value.id, down = false){    // curLevel表示应当加入的层数，默认加入第0层；orient表示方向，1为向上，-1向下
    let preLevel = curLevel 
    if (down){
        preLevel += 1  // 判断删除元素后下降的情况
    }
    // 层级添加‘连接’逻辑
    for (let i = curLevel; i < links.value.length; i++) {
        let level = links.value[i]
        console.log(level)
        // 计算当前元素属于第几层
        for (let j = 0; j < level.length; j++){
            let curr = level[j]
            // 如果待加入元素和当前元素的节点在不同层面（即二者为不同的话语），则不需要对比
            if (start[1] != curr.start[1]){
                continue
            }

            // 设待加入的元素起点和终点x坐标为x1, x2；当前元素起点和终点x坐标为c1, c2
            // 为了方便判断，恒有 x1 < x2 和 c1 < c2
            let x1 = start[0] < end[0] ? start[0] : end[0]
            let x2 = start[0] < end[0] ? end[0] : start[0]
            let c1 = curr.start[0] < curr.end[0] ? curr.start[0] : curr.end[0]
            let c2 = curr.start[0] < curr.end[0] ? curr.end[0] : curr.start[0]
            // 1. x1 < x2 <= c1 < c2 或 c1 < c2 <= x1 < x2，即无交叉，待加入元素和当前层元素继续对比
            if (x2 <= c1 || c2 <= x1){
                console.log("情况1:无交叉，待加入元素和当前层元素继续对比")
            }
            // 2. c1 <= x1 < x2 <= c2，即当前元素应包裹加入的元素 => 当前元素上升到上一层并和该层元素对比，待加入元素和当前层元素继续对比
            else if (c1 <= x1 && x2 <= c2){
                console.log("情况2:当前元素应包裹加入的元素")
                // 先删除后添加
                level.splice(j, 1)
                schedule(curr.start, curr.end, curr.highOffset, i + 1, curr.relType)
            }
            // 3. x1 <= c1 < c2 <= x2，即加入的元素应包裹当前元素 => 待加入元素元素上升到上一层并和该层元素对比
            else if (x1 <= c1 && c2 <= x2){
                console.log("情况3:加入的元素应包裹当前元素")
                curLevel += 1
                break
            }
            // 4. x1 < c1 < x2 < c2 或 c1 < x1 < c2 < x2，即交叉且非包裹关系，长度较长的上升到上一层
            else{
                console.log("情况4:交叉且非包裹关系，长度较长的上升到上一层")
                if (x2 - x1 >= c2 - c1){  // 待加入元素更长
                    curLevel += 1
                    break
                }
                else{  // 当前元素更长
                    level.splice(j, 1)
                    schedule(curr.start, curr.end, curr.highOffset, i + 1, curr.relType)
                }
            }
        }
        if(curLevel == i){  // 待加入元素符合当前层数要求
            highOffset -= levelHigh * (curLevel - preLevel + 1)
            let item = {
                id: linkNums++, 
                coordinates: calCrdns(start, end, highOffset, curLevel),
                start: start,
                end: end,
                highOffset: highOffset,
                relType: relType,
                linkType: 'polyline',
                level: curLevel
            }
            level.push(item)
            break
        }
    }
    // 如果元素应放置层大于当前最高层，则新增一层
    if (curLevel == links.value.length) {
        highOffset -= levelHigh * (curLevel - preLevel + 1)
        let item = {
            id: linkNums++,
            coordinates: calCrdns(start, end, highOffset, curLevel),
            start: start,
            end: end,
            highOffset: highOffset,
            relType: relType,
            linkType: 'polyline',
            level: curLevel
        }
        links.value.push([item])
    }
    // console.log(this.links)
    selectedId.value = ""
    start = []
    end = []
}

function linkDiffHigh(start:number[], end: number[]) {
    let item = {
        id: linkNums++,
        start: start,
        end: end,
        coordinates: '',
        highOffset: -1,
        relType: curTab.value.id,
        linkType: 'curve',
        level: 0
    }
    // 向上连接
    if (start[1] > end[1]) {
        console.log("向上连接")
        item.start = [start[0] + 20, start[1]]
        item.end = [end[0] + 20, end[1] + 42]
        let startStr = item.start[0].toString() + ',' + item.start[1].toString()
        let mid = ((start[0] + end[0]) / 2).toString() + ',' + ((start[1] + end[1]) / 2).toString()
        let endStr = item.end[0].toString() + ',' + item.end[1].toString()
        item.coordinates = 'M' + startStr + ' Q' + mid + ' ' + endStr
    }
    // 向下连接
    else {
        console.log("向下连接")
        item.start = [start[0] + 20, start[1] + 40]
        item.end = [end[0] + 20, end[1] - 8]
        let startStr = item.start[0].toString() + ',' + item.start[1].toString()
        let mid = ((start[0] + end[0]) / 2).toString() + ',' + ((start[1] + end[1]) / 2).toString()
        let endStr = item.end[0].toString() + ',' + item.end[1].toString()
        item.coordinates = 'M' + startStr + ' Q' + mid + ' ' + endStr 
    }
    links.value[0].push(item)
    selectedId.value = ""
    start = []
    end = []
}

function cancelSelected() {
    selectedId.value = ""
    start = []
}

function deleteLink(link: LinkType) {
    if (link.level == 0){  // 第0层规定是竖向的连接元素,删除后不用进行动态调整
        links.value[0].splice(links.value[0].indexOf(link), 1)
        return
    }
    let deleted = false
    for (let i = 0; i < links.value.length; i++) {
        for (let j = 0; j < links.value[i].length; j++) {
            // 如果删除了元素，则到上一层寻找元素进行动态的调整
            if (deleted){
                let curr = links.value[i][j]
                let highOffset = curr.highOffset + levelHigh  // 先降低一层
                links.value[i].splice(j, 1)
                schedule(curr.start, curr.end, highOffset, i - 1, curr.relType, true)
            }
            // 否则寻找删除的元素
            else if (link === links.value[i][j]) {
                links.value[i].splice(j, 1)
                deleted = true
                break
            }
        }
    }
}
// <--------------

</script>

<template>
    <h1>{{ header }}</h1>

    <LinkTabs             
        v-for="tab in tabs" 
        :key="tab.id" 
        :tab="tab"
        :cur-tab=curTab
        :class="curTab.id === tab.id ? 'active': ''" 
        @click="curTab = tab">
        
    </LinkTabs>
    
    <div class="words-view">

      <div :class="'utterance ' + utterance.id" v-for="utterance in convs" :key="utterance.id">

      <SpanBtn v-for="item in utterance.items" :key="item.id" :item="item" :is-selected="utterance.id + '-' + item.id === selectedId"
        @click="selectAndLink(utterance.id, item.id, $event.target)" @keyup.esc="cancelSelected">
      </SpanBtn>

      </div>

      <DepLinkDraw :links=links @delete-link="deleteLink" :tabs="tabs"></DepLinkDraw>

    </div>

</template>

<style scoped>
  h1 {
      margin: 0px 0px 20px 0px;
  }
  .words-view{
    position: relative;
    display: block;
    align-items: stretch;
    list-style: none;
    margin: 20px 0px 20px 0px;
    padding: 20px 0px 20px 0px;
    width: 1000px;
    min-height: 400px;
  }

  .words-view .utterance{
    /* position: relative; */
    display: block;
    align-items: stretch;
  }

  .words-view .link-draw .line-draw{
    position: absolute;
    top: 0; 
    left: 0; 
    height: 100%; 
    width: 100%;
    z-index: 0;
  }

  .words-view .link-draw .tag-draw{
    position: absolute;
    top: 0; 
    left: 0; 
    height: 100%; 
    width: 100%;
    z-index: 2;
  }

  .words-view .utterance > button{
    /* border: none; */
    box-shadow: none;
    position: relative;
    margin: 150px 20px 20px;
    padding: 6px 8px;
    z-index: 10;
  }
</style>
