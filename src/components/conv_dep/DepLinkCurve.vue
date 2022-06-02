<script setup lang="ts">

import {LinkType} from "@/types/ConvDepTypes"


defineProps<{ 
    link: LinkType,
    linkStroke: string
}>()
</script>

<template>
    <g :id="'link-line-' + link.id">
    <marker :id="'arrow' + link.id" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
        <path d="M0,0 L0,6 L9,3 Z" :fill="linkStroke" />
    </marker>

    <path
        stroke-width="3"
        fill="none"
        :marker-end="'url(#arrow' + link.id +')'"
        :stroke="linkStroke"
        :d="link.coordinates" 
    />
    </g>
</template>