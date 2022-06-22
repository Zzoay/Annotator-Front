<script setup lang="ts">

import {computed} from "vue"
import { ItemType } from "@/types/ConvDepTypes"


const props = defineProps<{ 
    item: ItemType,
    isSelected: boolean,
}>()

// computed
const itemColor = computed(() => {
    return props.item.id == 0 ? '#F19D57' : ''
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
    padding: 4px 6px;
    margin: 8px;
}

.btn .btn-outline-secondary :hover {
    background-color: #fff;
}
</style>