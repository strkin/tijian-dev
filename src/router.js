import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

export default [
    {
        path:"/",
        redirect:"/login"
    },
    {
        path:"/home",
        component:()=>import('@/page/Home.vue')
    },
    {
        path:"/login",
        component:()=>import('@/page/Login.vue')
    },
    {
        path:"/reg",
        component:()=>import('@/page/Reg.vue')
    },
    {
    path: "/shop",
    component: () => import('@/page/Shop.vue')
    },
    {
        path: "/discover",
        component: () => import('@/page/Discover.vue')
    },
    {
        path: "/discover91",
        component: () => import("@/page/Discover91.vue")
    },
    {
        path: "/discover/publish",
        component: () => import('@/page/DiscoverPublish.vue')
    },
    {
        path: "/discover/publish91",
        component: () => import('@/page/DiscoverPublish91.vue')
    },
    {
        path: "/discover/:id",
        component: () => import('@/page/DiscoverDetail.vue')
    },
    {
        path: "/discover91/:id",
        component: () => import('@/page/DiscoverDetail91.vue')
    }
]