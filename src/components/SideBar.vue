<script setup lang="ts">
import {reactive, ref} from 'vue'
import {TabType } from '../types/ConvDepTypes'
import {getRelation} from '../api/api'

import bus from '../libs/bus'
import LinkTabs from './LinkTabs.vue'


const curTabId = ref(0)
const tabs: Array<TabType> = reactive([])
function initRelations() {
    getRelation().then((response: any) => {
        let res = response.data
        for (let i = 0; i < res.length; i++) {
            tabs[i] = {id: i, name: res[i]['name'], linkColor: "#" + res[i]['color']}
        }
    })
}

initRelations()

function emitTabSelected(tabId: number) {
    curTabId.value = tabId
    bus.emit('tabSelected', tabId)
}

</script>

<template>
    <div class="sidebar">
    <h6> 标签集 </h6>
    <LinkTabs             
        v-for="tab in tabs" 
        :key="tab.id" 
        :tab="tab"
        :cur-tab-id=curTabId
        :class="curTabId === tab.id ? 'active': ''" 
        @click.stop="emitTabSelected(tab.id)"
        >
        
    </LinkTabs>
    </div>

</template>

<style>
.sidebar {
    position: fixed;
    padding: 15px;
    /* margin: 0px 10px 0px 0px; */
    max-width: 260px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 1px;
}

h6 {
    display: block;
    margin: 0px 0px 5px 3px;
}
</style>