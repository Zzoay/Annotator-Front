<script setup lang="ts">
import {reactive, ref, getCurrentInstance, ComponentInternalInstance} from 'vue'
import { SET_USER, CLEAR_USER } from "../store";


const props = defineProps<{ 
    pageNow: string,
        // TODO: 类型定义
    assigns?: Array<Object>,
    finish_num?: number
}>()

const pages = ref({
    '/login': -1,
    '/home': 0,
    '/task_assign': 1,
    '/data': 2,
    '/annot': 3,
})

const { proxy } = (getCurrentInstance() as ComponentInternalInstance)

function handleLogout() {
    // @ts-ignore
    proxy.$store.commit(CLEAR_USER)
    window.sessionStorage.userInfo = ""
    // @ts-ignore
    proxy.$router.push({
        path: "/login",
    })
}

// @ts-ignore
const assigns = props.assigns
// @ts-ignore
const finish_num = props.finish_num
async function routeTo(name) {
    // @ts-ignore
    await proxy.$router.push({
        name: name,
        params: {
            'finish_num': JSON.stringify(finish_num), 
            'assigns': JSON.stringify(assigns)
        }
    })
}

</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light navbar-fixed-top">

    <router-link
        :to="pages[pageNow] != -1 ? '/home' : '/login'"
        custom
        v-slot="{ navigate }">
        <div class="icon" @click="navigate"> 
        <img src="/cube.svg" width="40" height="40" alt="" />
        </div>
    </router-link>
    
    <router-link
        :to="pages[pageNow] != -1 ? '/home' : '/login'"
        custom
        v-slot="{ navigate }">
        <a class="navbar-brand" href="" @click="navigate">&nbsp; 标注平台 </a>
    </router-link>
    
    <ul class="navbar-nav">
        <li v-if="pages[pageNow] != 0 && pages[pageNow] != -1" class="nav-item active">
            <router-link
                to="/home"
                custom
                v-slot="{ navigate }">
                <a class="nav-link" href="" @click="navigate"> 主页 </a>
            </router-link>
        </li>

        <li v-if="pages[pageNow] > 1" class="nav-item">
            <a class="nav-link disabled" href="#"> > </a>
        </li>
        <li v-if="pages[pageNow] > 1" class="nav-item active">
            <router-link
                to="/task_assign"
                custom
                v-slot="{ navigate }">
                <a class="nav-link" href="" @click="navigate"> 任务 </a>
            </router-link>
        </li>

        <li v-if="pages[pageNow] > 2" class="nav-item">
            <a class="nav-link disabled" href="#"> > </a>
        </li>
        <li v-if="pages[pageNow] > 2" class="nav-item active">
            <router-link
                to=""
                custom>
                <a class="nav-link" href="#" @click.native="routeTo('data')"> 数据 </a>
            </router-link>
        </li>
    </ul>

    <div class="collapse navbar-collapse justify-content-end">
        <div v-if="pages[pageNow] >= 0" class="nav-item dropdown active">
            <a id="user" class="" href="#" role="button" data-bs-toggle="dropdown">
                <img src="/my.svg" width="20" height="30" alt="" />
            </a>

            <ul id='user-down' class="dropdown-menu dropdown-menu-right">
                <li><a id="exit" class="dropdown-item" href="#" @click="handleLogout">退出</a></li>
            </ul>
        </div>
        
    </div>

    </nav>

</template>

<style>
.navbar {
    max-width: 100% !important;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    border-radius: 1px;
}

.nav-item {
    padding: 0px;
    margin-left: -3px;
    margin-right: -8px;
}

li {
    margin-left: 10px;
}

.icon {
    margin-left: 5px;
    cursor: pointer;
}

#user {
    margin-right: 60px;
    text-decoration: none;
    color: #4d5562;
}

.dropdown-menu {
    min-width: 20px !important;
    text-align: left !important;
}

#exit {
    width: 100% !important;
    margin-left: -8px;
}

#exit:active {
    background-color: #fff;
    color: #4d5562;
}

</style>