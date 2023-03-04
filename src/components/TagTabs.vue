<script setup lang="ts">

import {computed} from 'vue'
import { TabType } from '@/types/ConvDepTypes'


const props = defineProps<{ 
    tab: TabType,
    curTabId: Number,
}>()

// computed
const bgColor = computed(() => {
    return props.curTabId == props.tab.id ? props.tab.linkColor : '#fff'
})

const color = computed(() => {
    return props.curTabId == props.tab.id ? '#fff' : props.tab.linkColor
})

</script>

<template>
    <button 
        class="btn"
        :style="{'box-shadow': 'none', 'color':color, 'border-color': tab.linkColor, 'background-color': bgColor}"
    >
    {{tab.name}}
    </button>
</template>

<style scoped>
.btn {
    font-size: x-small;
    background-color: #fff;
    padding: 1px 3px !important;
    margin: 3px !important;
}

.btn.btn-outline-secondary:hover {
    background-color: #fff;
}
</style>