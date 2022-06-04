import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
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

export default router;