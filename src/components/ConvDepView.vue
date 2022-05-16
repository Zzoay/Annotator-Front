<script setup lang="ts">
import {onBeforeMount, onMounted, getCurrentInstance, reactive, ref, ComponentInternalInstance, onBeforeUnmount, watch} from 'vue'
import LinkTabs from './LinkTabs.vue'
import SpanBtn from './SpanBtn.vue'
import DepLinkDraw from './DepLinkDraw.vue'
import Dialog from './Dialog.vue'
import Message from './Message.vue'
import { UteranceType, LinkType, TabType, RelshipType } from '../types/ConvDepTypes'
import {getRelation, getConv, updateConvTagged, getConvId, getRelationship, postRelationship, deleteRelationship} from '../api/api'
import bus from '../libs/bus'



// data ------------>
const header = '对话依存分析'

let curTabId = ref(0)
const tabs: Array<TabType> = reactive([])
function initRelations() {
    getRelation().then((response: any) => {
        let res = response.data
        for (let i = 0; i < res.length; i++) {
            tabs[i] = {id: i, name: res[i]['name'], linkColor: "#" + res[i]['color']}
        }
    })
}

let convId = ref(0)
const conversation = ref<Array<UteranceType>>([])
// const conversation:Array<UteranceType> = reactive([])
function saveConvTagged() {
    updateConvTagged(convId.value, true)
}

const relships = ref<Array<RelshipType>>([]) 
function initRelships() {
    getRelationship(convId.value).then((response: any) => {
        let res = response.data
        for (let i = 0; i < res.length; i++) {
            relships.value[i] = res[i]
        }
    })
}

async function init() {
    await initRelations()
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
    initRelships()
} 
init()

let selectedId = ref("")
let start: number[] = []
let end: number[] = []
let links = ref<Array<Array<LinkType>>>([[]])  // 默认第0层为上下连接
let linkNums = 0 // 连接的数量，包括删除的，用以保证连接id的唯一性
const levelHigh = 25  // 单层高度

// 得到每个词的位置信息
const targets = ref([])
let tmp = []
const utrDom = (el) => {
    if (!el) return 
    let childs = el.childNodes
    for (let i = 0; i < childs.length; i++){
        if (childs[i].nodeName == '#text') {
            continue
        }
        // @ts-ignore 
        tmp.push([childs[i].offsetLeft, childs[i].offsetTop])
    }
    // @ts-ignore 
    targets.value.push(tmp)
    tmp = []
}

// 初始化关系连接
let relFlag = true
watch(relships, (newValue, oldValue) => {
    if (relFlag) {
        for (let i = 0; i < relships.value.length; i ++) {
            let headSplit = relships.value[i]['head'].split('-')
            let headUtr = Number(headSplit[0])
            let headWord = Number(headSplit[1])
            let tailSplit = relships.value[i]['tail'].split('-')
            let tailUtr = Number(tailSplit[0])
            let tailWord = Number(tailSplit[1])

            // -1是因为targets从0开始，而我们默认的句子和词语的下标从1开始
            let start = targets.value[headUtr - 1][headWord - 1] 
            let end = targets.value[tailUtr - 1][tailWord - 1]
            
            // 判断是句内还是跨句
            if (headUtr == tailUtr)
                // 关系数组从0开始，而我们默认的句子和词语的下标从1开始，这里未对齐，而在DepLinkDraw中，通过-1对齐了
                schedule(start, end, relships.value[i]['head'], relships.value[i]['tail'], start[1], 1, relships.value[i]['relation']) 
            else
                linkDiffHigh(start, end, relships.value[i]['head'], relships.value[i]['tail'], relships.value[i]['relation'])
        } 
        relFlag = false  
    }
}, {deep:true}  // 开启深度检测
)

const showModal = ref(false)  // 是否显示弹窗
const dialogBody = ref('操作')  // 弹窗的显示文字
const nextPrev = ref(false)  // 是否为上一个/下一个按钮，用于操作弹窗的具体行为

const saved = ref(true)  // 是否已经保存，默认是，一旦有操作后（比如添加连接或删除连接），就变成false
const doAction = ref(false)  // 是否运行操作，默认为否，需要弹窗后确认才会变成true
const action = ref()  // 操作函数（保存/删除）
const actionArgs = ref()  // 操作函数的参数

const linkSelectedId = ref(-1)  // 被选中的连接的ID

const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
console.log('getCurrentInstance()中的proxy:', proxy)


// 全局键盘事件
document.addEventListener("keydown", function(e) {
    // S
    if (e.key == "s") {
        saveLinks()
    }
    // C
    else if (e.key == "c") {
        cancelLinks()
    }
    // Enter
    else if (e.key == "Enter") {
    }
})

// 启用监听
bus.on('tabSelected', tabSelected)
// <----------------


// hooks -------->
onBeforeMount(() => {
    window.onbeforeunload = function (e) {
        e = e || window.event
 
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
            e.returnValue = '关闭提示'
        }
        
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '关闭提示'
    }
})
onMounted(() => {
    
})
onBeforeUnmount(() => {
    window.onbeforeunload = null
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
    saved.value = false
    linkSelectedId.value = -1
    // 对span进行连接
    if (selectedId.value != "") {
        end = [target.offsetLeft, target.offsetTop]
        // let start = this.start
        // let end = this.end
        let highOffset = target.offsetTop
        
        // 同一高度的span进行连接，为防止重合，需要进行全局的调度
        if (start[1] == end[1]) {
            schedule(start, end, selectedId.value, utrId + '-' + itemId, highOffset)
        }
        // 不同高度的span进行连接
        else {
            console.log("不同高度的span进行连接")
            linkDiffHigh(start, end, selectedId.value, utrId + '-' + itemId)
        }
    }
    else {
        selectedId.value = utrId + '-' + itemId
        start = [target.offsetLeft, target.offsetTop]
    }
}

// curLevel表示应当加入的层数，默认加入第0层；orient表示方向，1为向上，-1向下
function schedule(start: number[], end: number[], startId: string, endId: string, highOffset: number, curLevel = 1, relType = curTabId.value + 1, down = false){    
    let preLevel = curLevel 
    if (down){
        preLevel += 1  // 判断删除元素后下降的情况
    }
    // 层级添加‘连接’逻辑
    for (let i = curLevel; i < links.value.length; i++) {
        let level = links.value[i]
        // 计算当前元素属于第几层
        for (let j = 0; j < level.length; j++) {
            let curr = level[j]
            // 如果待加入元素和当前元素的节点在不同层面（即二者为不同的话语），则不需要对比
            if (start[1] != curr.start[1]) {
                continue
            }

            // 设待加入的元素起点和终点x坐标为x1, x2；当前元素起点和终点x坐标为c1, c2
            // 为了方便判断，恒有 x1 < x2 和 c1 < c2
            let x1 = start[0] < end[0] ? start[0] : end[0]
            let x2 = start[0] < end[0] ? end[0] : start[0]
            let c1 = curr.start[0] < curr.end[0] ? curr.start[0] : curr.end[0]
            let c2 = curr.start[0] < curr.end[0] ? curr.end[0] : curr.start[0]
            // 1. x1 < x2 <= c1 < c2 或 c1 < c2 <= x1 < x2，即无交叉，待加入元素和当前层元素继续对比
            if (x2 <= c1 || c2 <= x1) {
                console.log("情况1:无交叉，待加入元素和当前层元素继续对比")
            }
            // 2. c1 <= x1 < x2 <= c2，即当前元素应包裹加入的元素 => 当前元素上升到上一层并和该层元素对比，待加入元素和当前层元素继续对比
            else if (c1 <= x1 && x2 <= c2) {
                console.log("情况2:当前元素应包裹加入的元素")
                // 先删除后添加
                level.splice(j, 1)
                schedule(curr.start, curr.end, curr.startId, curr.endId, curr.highOffset, i + 1, curr.relType)
            }
            // 3. x1 <= c1 < c2 <= x2，即加入的元素应包裹当前元素 => 待加入元素元素上升到上一层并和该层元素对比
            else if (x1 <= c1 && c2 <= x2) {
                console.log("情况3:加入的元素应包裹当前元素")
                curLevel += 1
                break
            }
            // 4. x1 < c1 < x2 < c2 或 c1 < x1 < c2 < x2，即交叉且非包裹关系，长度较长的上升到上一层
            else{
                console.log("情况4:交叉且非包裹关系，长度较长的上升到上一层")
                if (x2 - x1 >= c2 - c1) {  // 待加入元素更长
                    curLevel += 1
                    break
                }
                else{  // 当前元素更长
                    level.splice(j, 1)
                    schedule(curr.start, curr.end, curr.startId, curr.endId, curr.highOffset, i + 1, curr.relType)
                }
            }
        }
        if (curLevel == i) {  // 待加入元素符合当前层数要求
            highOffset -= levelHigh * (curLevel - preLevel + 1)
            let item = {
                id: linkNums++, 
                coordinates: calCrdns(start, end, highOffset, curLevel),
                start: start,
                end: end,
                startId: startId,
                endId: endId,
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
            startId: startId,
            endId: endId,
            highOffset: highOffset,
            relType: relType,
            linkType: 'polyline',
            level: curLevel
        }
        links.value.push([item])
    }
    selectedId.value = ""
    start = []
    end = []
}

function linkDiffHigh(start:number[], end: number[], startId: string, endId: string, relType = curTabId.value + 1) {
    let item = {
        id: linkNums++,
        start: start,
        end: end,
        startId: startId,
        endId: endId,
        coordinates: '',
        highOffset: -1,
        relType: relType,
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
    saved.value = false
    if (link.level == 0){  // 第0层规定是竖向的连接元素,删除后不用进行动态调整
        links.value[0].splice(links.value[0].indexOf(link), 1)
        return
    }
    let deleted = false
    for (let i = 0; i < links.value.length; i++) {
        for (let j = 0; j < links.value[i].length; j++) {
            if (links.value[i][j].start[1] != link.start[1]) 
                continue
            // 如果删除了连接，则到上一层寻找连接元素进行动态的调整
            if (deleted){
                let curr = links.value[i][j]
                let highOffset = curr.highOffset + levelHigh  // 先降低一层
                links.value[i].splice(j, 1)
                schedule(curr.start, curr.end, curr.startId, curr.endId, highOffset, i - 1, curr.relType, true)
            }
            // 否则寻找应删除的连接元素
            else if (link === links.value[i][j]) {
                links.value[i].splice(j, 1)
                deleted = true
                break
            }
        }
    }
}


function selectLink(link) {
    linkSelectedId.value = link.id
    cancelSelected() // 取消选中span
}

function globalClick() {
    linkSelectedId.value = -1  // 取消选择连接
    cancelSelected() // 取消选中span
}

function tabSelected(tabId) {
    curTabId.value = tabId
    // 如果连接被选择
    if (linkSelectedId.value != -1) {
        let cnt = 0
        for (let i = 0; i < links.value.length; i++) {
            for (let j = 0; j < links.value[i].length; j++) {
                // 找到对应的连接
                if (linkSelectedId.value == links.value[i][j].id && links.value[i][j].relType != tabId + 1)
                    links.value[i][j].relType = tabId + 1
                cnt ++
            }
        }
        // 设保存状态为false
        saved.value = false
        linkSelectedId.value = -1
    }
}


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function updateConv(shift: number) {
    if (!saved.value) {
        showModal.value = true
        nextPrev.value = true
        dialogBody.value = "当前可能未保存，继续"
    }
    
    // 未保存则弹窗确认
    if (saved.value || doAction.value) {
        convId.value = convId.value + shift

        let res = [{}]
        await getConv(convId.value).then((response: any) => {
            res = response.data
            if (res.length == 0) {
                alert("已经没有更多数据了")
                convId.value = convId.value - shift 
            }
        })

        if (res.length == 0) return

        // 清空连接
        await cleanLinks()
        relships.value = []

        function assignConv() {
            // @ts-ignore 
            conversation.value = res
        }
        await assignConv()

        // 更新连接
        relFlag = true
        await initRelships()

        linkSelectedId.value = -1
        targets.value = []
        saved.value = true
        doAction.value = false
    }

    action.value = updateConv
    actionArgs.value = shift
}

function cleanLinks() {
    links.value = []
    links.value.push([])
    linkNums = 0 
    doAction.value = false
}

async function cancelLinks() {
    if (saved.value) return

    // 弹窗确认
    showModal.value = true
    dialogBody.value = "取消标注，还原状态"
    if (doAction.value) {   
        // 清空连接
        cleanLinks()
        relships.value = []
        
        // 设置延时，保证清空完成后再更新
        await sleep(10)

        // 更新连接
        relFlag = true
        await initRelships()

        saved.value = true
        doAction.value = false
    }
    action.value = cancelLinks
}

async function saveLinks() {
    // 保存数据的操作相对安全，不需要弹窗确认
    if (saved.value) return
    // 先删除
    for (let i = 0; i < relships.value.length; i++) {
        await deleteRelationship(relships.value[i].id)
    }
    relships.value = []

    // 后添加
    let tmp = {}
    for (let i = 0; i < links.value.flat().length; i++) {
        tmp = {
            conv: convId.value,
            head: links.value.flat()[i].startId,
            tail: links.value.flat()[i].endId,
            relation: links.value.flat()[i].relType,
        }
        await postRelationship(tmp)
    }
    initRelships()

    saveConvTagged()
    saved.value = true

    showMessage("保存成功") 
}

const showSaveMessage = ref(false)
const massage = ref('')

function showMessage(message) {
    showSaveMessage.value = true
    massage.value = message
    setTimeout(() => {
      showSaveMessage.value = false
    }, 800)
}

function hideMessage() {
    showSaveMessage.value = false
}

function cofirmAction(func, args = null) {  // ? 如何传递数组参数，类似于Python的*args
    if (args != null) {
        func(args)
    }
    else {
        func()
    }
    hideModal()
}

function hideModal() {
    showModal.value = false 
    nextPrev.value = false
    dialogBody.value = "操作"
}
// <--------------

</script>

<template>
    <div class="main-panel"  @click="globalClick" @select-link="selectLink">
        <h3>{{ header }}</h3>

        <!-- <LinkTabs             
            v-for="tab in tabs" 
            :key="tab.id" 
            :tab="tab"
            :cur-tab-id=curTabId
            :class="curTabId === tab.id ? 'active': ''" 
            @click.stop="tabSelected(tab.id)">
            
        </LinkTabs> -->
        
        <div class="words-view">

        <div :class="'utterance ' + utterance.id" v-for="utterance in conversation" :key="utterance.id" :ref="utrDom">

        <SpanBtn v-for="item in utterance.items" :key="item.id" :item="item" ref="words"
            :is-selected="utterance.id + '-' + item.id === selectedId"
            @click.stop="selectAndLink(utterance.id, item.id, $event.target)" @keyup.esc="cancelSelected">
        </SpanBtn>

        </div>

        <DepLinkDraw :links=links @delete-link="deleteLink" @select-link="selectLink" :tabs="tabs" :linkSelectedId="linkSelectedId"></DepLinkDraw>

        </div>
    </div>

    <div class="bottom-ctrls">
        <button class="btn btn-outline-primary" @click="updateConv(-1)">上一个</button>
        <button class="btn btn-outline-danger" @click="cancelLinks">取消</button>
        <button class="btn btn-outline-success" @click="saveLinks">保存</button>
        <button class="btn btn-outline-primary" @click="updateConv(+1)">下一个</button>
    </div>

    <Dialog :showModal="showModal" :nextPrev="nextPrev" @hide-modal="hideModal" @doAction="doAction=true; cofirmAction(action, actionArgs);"> 
        <template #title>确认</template>
        确认<strong>&ensp;{{dialogBody}}&ensp;</strong>吗？
    </Dialog>

    <Message :showMessage="showSaveMessage" @hide-message="hideMessage"> 
        <template #title>消息</template>
        {{massage}}
    </Message>

</template>

<style scoped lang="css">
 .main-panel {
    position: relative;
    background: #fff;
    padding: 5px;
    margin: 20px 0px 0px 0px;
    width: auto;
  }
  
  h1 {
      margin: 0px 0px 20px 0px;
  }
  .words-view{
    position: relative;
    display: block;
    align-items: stretch;
    list-style: none;
    margin: 0px 0px 20px 0px;
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

  .bottom-ctrls {
    text-align: center;
    margin: 20px 0px 20px 0px;
    padding: 20px 0px 20px 0px;
  }

  .bottom-ctrls > button{
    box-shadow: none;
    margin: 0px 25px;
  }

</style>
