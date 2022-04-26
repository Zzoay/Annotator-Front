<script setup lang="ts">

import {computed} from 'vue'
import { TabType } from '../types/ConvDepTypes'


const props = defineProps<{ 
    tab: TabType,
    curTab: TabType
}>()

// computed
const bgColor = computed(() => {
    return props.curTab.id == props.tab.id ? props.tab.linkColor : '#fff'
})

const color = computed(() => {
    return props.curTab.id == props.tab.id ? '#fff' : props.tab.linkColor
})
</script>

<template>
    <button 
        class="btn btn-outline-secondary" 
        :style="{'box-shadow': 'none', 'color':color, 'border-color': tab.linkColor, 'background-color': bgColor}"
    >
    {{tab.name}}
    </button>
</template>

<style scoped>
button {
    background-color: #fff;
    padding: 4px 6px;
    margin: 8px;
}

.btn.btn-outline-secondary:hover {
    background-color: #fff;
}
</style>