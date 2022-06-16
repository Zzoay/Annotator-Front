import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getCookie } from "../utils";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/Login.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/Home.vue')
    },
    {
        path: '/task_assign',
        name: 'task_assign',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/TaskAssign.vue')
    },
    {
        path: '/annot',
        name: 'annot',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/AnnotView.vue')
    },
    {
        path: '/data',
        name: 'data',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/DataView.vue')
    }
]

const router = createRouter({
  history: createWebHistory(),    
  routes
})

router.beforeEach((to, from, next) => {
    const userInfo = window.sessionStorage.userInfo
    if (to.name !== 'login' && (!userInfo || userInfo === '{}')) next({name: 'login'})
    else next()
})

export default router;