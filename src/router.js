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
        path: "/discover/publish",
        component: () => import('@/page/DiscoverPublish.vue')
    },
    {
        path: "/discover/:id",
        component: () => import('@/page/DiscoverDetail.vue')
    }
]