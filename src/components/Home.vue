<script setup lang="ts">
import {reactive} from 'vue'
import Nav from './Nav.vue'
import SideBar from './SideBar.vue'

const img_srcs = [
    "https://mixkit.imgix.net/art/preview/mixkit-two-flamingos-standing-in-the-water-438-square-medium.png?q=80&auto=format%2Ccompress",
    "https://mixkit.imgix.net/art/preview/mixkit-jungle-animals-collage-featuring-a-jaguar-caiman-and-eagle-436-square-medium.png?q=80&auto=format%2Ccompress",
]


const cards = reactive([
    {
        id: 1,
        title: "对话依存分析",
        content: "本任务旨在对对话级别的文本数据进行语义依存标注，包括对头尾词语和其中关系标签的标注。",
        img_src: img_srcs[0],
        to: "/conv_annot",
    },
    {
        id: 2,
        title: "任务待定",
        content: "内容待定",
        img_src: img_srcs[1],
        to: "/home",
    },
])


</script>

<template>

<Nav></Nav>

<div class="main-view">
    <div class = "row">
    <div v-for="card in cards" :key="card.id" class="card" style="width: 18rem;">
        <img class="card-img-top" :src="card.img_src" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title"><b> {{card.title}} </b></h5>
            <p class="card-text">{{card.content}}</p>
            <router-link :to="card.to" class="card-link">进入</router-link>
        </div>
    </div>
    </div>
</div>

</template>

<style>

.main-view {
    display: block;
    margin: 10px;
    padding: 2px 0px 0px 10px;
}

.card {
    margin: 10px 15px 10px 10px;
    padding: 5px;
}

.card-text {
    width: 100%;
    height: 80px;   
    overflow: hidden;
    text-overflow: ellipsis;

}

</style>