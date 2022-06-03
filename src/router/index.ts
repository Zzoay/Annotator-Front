import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/Home.vue')
    },
    {
        path: '/conv_annot',
        name: 'conv_annot',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/AnnotView.vue')
    },
    {
        path: '/conv_data',
        name: 'conv_data',
        component: () => import(/* webpackChunkName: "conv_annotation" */ '../components/DataView.vue')
    }
]

const router = createRouter({
  history: createWebHistory(),    
  routes
})

export default router;