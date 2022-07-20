<script setup lang="ts">

import {ref, computed} from "vue"
import {LinkType} from "@/types/ConvDepTypes"


const props = defineProps<{ 
    link: LinkType,
    linkStroke: string,
    tagName: string
}>()

defineEmits<{
    (e: 'deleteLink'): void
}>()

// data
const tagHover = ref(false)

// computed
const mid = computed(() => {
    let mid = props.link.coordinates.split(' ')[1].split(',')
    return [Number(mid[0].slice(1)), Number(mid[1])]
})

const deg = computed(() => {
    return Math.atan((props.link.start[1] - mid.value[1]) / (props.link.start[0] - mid.value[0])) * 180 / Math.PI
})

const signX = computed(() => {
    // 计算X方向,当旋转角度和箭头在竖向上方向不一致时(即逆时针+向上箭头,顺时针+向下箭头),X方向为正
    return deg.value * (props.link.start[1] - mid.value[1]) < 0 ? 1 : -1
})

const length = computed(() => {
    return Math.sqrt(Math.pow((props.link.start[1] - mid.value[1]), 2) + Math.pow((props.link.start[0] - mid.value[0]), 2))
})

const transform = computed(() => {
    if (props.link.linkType == 'polyline') return
    // 进行X轴方向缩放,X值越大,距离越远
    let translateX = signX.value * length.value / 1.6 - 10
    // 进行Y轴方向缩放,Y值越大,距离越近
    let translateY =  deg.value > 0 ? 10 * (60 / length.value) : -14 * (60 / length.value)
    return 'rotate(' + deg.value + ') ' + "translate(" + translateX + ',' + translateY + ')'
})

const rectX = computed(() => {
    if (props.link.linkType == 'polyline') return (props.link.start[0] + props.link.end[0]) / 2 + 4
    return props.link.start[0]
})

const rectY = computed(() => {
    if (props.link.linkType == 'polyline') return props.link.highOffset - 7.5
    return props.link.start[1]
})

const textX = computed(() => {
    if (props.link.linkType == 'polyline') return (props.link.start[0] + props.link.end[0]) / 2 + 18
    return props.link.start[0] + 18
})

const textY = computed(() => {
    if (props.link.linkType == 'polyline') return props.link.highOffset + 2
    return props.link.start[1] + 13
})

const cancelCircleX = computed(() => {
    if (props.link.linkType == 'polyline') return (props.link.start[0] + props.link.end[0]) / 2 + 30
    return props.link.start[0] + 36
})

const cancelCircleY = computed(() => {
    if (props.link.linkType == 'polyline') return props.link.highOffset - 6
    return props.link.start[1] + 2
})

const cancelX = computed(() => {
    if (props.link.linkType == 'polyline') return (props.link.start[0] + props.link.end[0]) / 2 + 34
    return props.link.start[0] + 38
})

const cancelY = computed(() => {
    if (props.link.linkType == 'polyline') return props.link.highOffset - 4
    return props.link.start[1] + 2
})
</script>

<template>
    <g 
        :id="'link-tag-' + link.id" 
        :transform=transform 
        style="transform-box: fill-box; transform-origin: center;" 
        @mouseover="tagHover = true"
        @mouseout="tagHover = false"
        >
    
        <rect
            rx="3" ry="3" 
            width="28" height="14"
            style="position: absolute; z-index: 5"
            cursor="pointer"
            :x=rectX 
            :y=rectY 
            :fill=linkStroke
        />

        <text 
            text-anchor="middle" 
            fill="#fff"
            font-size="8px"
            cursor="pointer"
            style="position: absolute; z-index: 5"
            :x=textX 
            :y=textY 
        >
            {{tagName}}
        </text>

        <circle 
            r="8px"
            opacity="0"
            cursor="pointer"
            :cx=cancelCircleX 
            :cy=cancelCircleY 
            @click.stop="$emit('deleteLink')"
        />

        <text 
            text-anchor="middle" 
            font-size="9px"
            cursor="pointer"
            :x=cancelX 
            :y=cancelY 
            :fill="tagHover ? linkStroke: 'none'"
            @click.stop="$emit('deleteLink')"
        >
            x
        </text>
    </g>
</template>