<script setup lang="ts">
import DepLinkTag from './DepLinkTag.vue'
import DepLinkPolyline from './DepLinkPolyline.vue'
import DepLinkCurve from './DepLinkCurve.vue'
import {LinkType, TabType} from '../types/ConvDepTypes'


defineProps<{ 
    links: Array<Array<LinkType>>,
    tabs: Array<TabType>,
}>()
defineEmits<{
    (e: 'deleteLink', link: LinkType): void
}>()
</script>

<template>
    <div class="link-draw">

    <svg class="line-draw">
        <component 
            :is="link.linkType == 'polyline' ? DepLinkPolyline : DepLinkCurve"
            v-for="link in links.flat()" 
            :key="link.id" 
            :link="link" 
            :link-stroke="tabs.length > 0 ? tabs[link.relType - 1].linkColor : ''"  
        >
        </component>
    </svg>

    <svg class="tag-draw">
        <DepLinkTag
            v-for="link in links.flat()" 
            :key="link.id" 
            :link="link" 
            :link-stroke="tabs.length > 0 ? tabs[link.relType - 1].linkColor : ''" 
            :tag-name="tabs.length > 0 ? tabs[link.relType - 1].name : ''"
            @delete-link="$emit('deleteLink', link)"
        >
        </DepLinkTag>
    </svg>

    </div>
</template>

<style scoped>
  .link-draw .line-draw{
    position: absolute;
    top: 0; 
    left: 0; 
    height: 100%; 
    width: 100%;
    z-index: 0;
  }

  .link-draw .tag-draw{
    position: absolute;
    top: 0; 
    left: 0; 
    height: 100%; 
    width: 100%;
    z-index: 2;
  }
</style>
