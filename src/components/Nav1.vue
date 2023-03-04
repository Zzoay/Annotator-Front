<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0" class="logo">
        <router-link
        :to="pages[pageNow] != -1 ? '/home' : '/login'"
        custom
        v-slot="{ navigate }">
        <div class="icon" @click="navigate"> 
        <img src="/cube.svg" width="50" height="50" alt="" />
        </div>
    </router-link>
    </el-menu-item>

    <el-menu-item index="1" class="logo">
        <router-link
        :to="pages[pageNow] != -1 ? '/home' : '/login'"
        custom
        v-slot="{ navigate }">
        <div class="title" @click="navigate"> 
            标注平台
        </div>
        </router-link>
    </el-menu-item>
 
        <el-menu-item v-if="pages[pageNow] != 0 && pages[pageNow] != -1">
            <router-link
                to="/home"
                custom
                v-slot="{ navigate }">
                <a class="nav-link" href="" @click="navigate"> 主页 </a>
            </router-link>
        </el-menu-item>

        <el-menu-item v-if="pages[pageNow] > 1">
            <a class="nav-link disabled" href="#"> > </a>
        </el-menu-item>

        <el-menu-item v-if="pages[pageNow] > 1">
            <router-link
                to="/task_assign"
                custom
                v-slot="{ navigate }">
                <a class="nav-link" href="" @click="navigate"> 任务 </a>
            </router-link>
        </el-menu-item>

        <el-menu-item v-if="pages[pageNow] > 2" >
            <a class="nav-link disabled" href="#"> > </a>
        </el-menu-item>
        
        <el-menu-item v-if="pages[pageNow] > 2">
            <router-link
                to="/data"
                custom
                v-slot="{ navigate }">
                <a class="nav-link" href="" @click="navigate"> 数据 </a>
            </router-link>
        </el-menu-item>
    <!-- <el-menu-item index="2">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
            <el-breadcrumb-item
            ><a href="/">promotion management</a></el-breadcrumb-item
            >
            <el-breadcrumb-item>promotion list</el-breadcrumb-item>
            <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
        </el-breadcrumb>
    </el-menu-item> -->

    <div class="flex-grow" />
    <!-- <el-menu-item index="1">Processing Center</el-menu-item> -->
    <el-sub-menu class="user" index="3">
      <template #title>用户</template>
      <el-menu-item index="3-1">退出</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'

const props = defineProps<{ 
    pageNow: string,
}>()

const pages = ref({
    '/login': -1,
    '/home': 0,
    '/task_assign': 1,
    '/data': 2,
    '/annot': 3,
})

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}


</script>

<style>
.el-menu-item:hover{  
  /* outline: 0 !important;   */
  color: none !important;  
}  

.title {
    font-size: 20px;
}

.user {
    font-size: 20px;
}

.flex-grow {
  flex-grow: 1;
}

</style>