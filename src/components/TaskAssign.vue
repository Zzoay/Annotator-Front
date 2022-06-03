<script setup lang="ts">
import {reactive} from 'vue'
import Nav from './Nav.vue'


const cards = reactive([
    {
        id: 1,
        content: "- 0/100",
        to: "/conv_data",
    },
    {
        id: 2,
        content: "- 0/100",
        to: "/home",
    },
])


</script>

<template>

<Nav></Nav>

<div class="main-view">
    <div class = "row">
    <div v-for="card in cards" :key="card.id" class="card" style="width: 18rem;">
        <div class="card-header">
            任务分配
        </div>
        <div class="card-body">
            <h5 class="card-title"><b> 当前进度 </b></h5>
            <p class="card-text">{{card.content}}</p>
            <div class="links">
                <router-link :to="card.to" class="router-link">查看数据</router-link>
                <router-link :to="card.to" class="router-link">开始标注</router-link>
            </div>
        </div>
    </div>
    </div>
</div>

</template>

<style scoped>

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
    height: 30px;   
    overflow: hidden;
    text-overflow: ellipsis;
}

.links {
    display: block;
    text-align: justify;
}

.router-link {
    margin: 5px 15px 0px 5px;
}

</style>