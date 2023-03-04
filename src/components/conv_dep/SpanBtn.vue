<script setup lang="ts">

import {computed} from "vue"
import { ItemType } from "@/types/ConvDepTypes"


const props = defineProps<{ 
    item: ItemType,
    isSelected: boolean,
}>()

const colors = [
    '#F19D57',
    '#7B68EE',
]

// computed
const itemColor = computed(() => {
    // return props.item.id == 0 ? '#F19D57' : ''
    return colors[props.item.id ]
})
</script>

<template>
    <button 
        type="button"
        class="btn btn-outline-secondary" 
        :style="{'color': itemColor}"
        :class="props.isSelected ? 'active' : ''"
        >
        {{item.word}}
    </button>
</template>

<style scoped>
button {
    background-color: #fff;
    padding: 2px 4px;
    margin: 6px;
}

.btn .btn-outline-secondary :hover {
    background-color: #fff;
}
</style>