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
    }
]