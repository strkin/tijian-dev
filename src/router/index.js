import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/personal' },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/personal', name: 'Personal', component: () => import('@/views/Personal.vue') },
  { path: '/appointment', name: 'AppointmentList', component: () => import('@/views/AppointmentList.vue') },
  { path: '/appointment/:id', name: 'AppointmentDetail', component: () => import('@/views/AppointmentDetail.vue') },
  { path: '/service', name: 'MyService', component: () => import('@/views/MyService.vue') },
  { path: '/service/:id', name: 'ServiceDetail', component: () => import('@/views/ServiceDetail.vue') },
  { path: '/service/:id/order', name: 'ServiceOrder', component: () => import('@/views/ServiceOrder.vue') },
  { path: '/doctor', name: 'MyDoctor', component: () => import('@/views/MyDoctor.vue') },
  { path: '/doctor/:id', name: 'DoctorProfile', component: () => import('@/views/DoctorProfile.vue') },
  { path: '/doctor/:id/consult', name: 'ConsultChat', component: () => import('@/views/ConsultChat.vue') },
  { path: '/consult', name: 'ConsultOrder', component: () => import('@/views/ConsultOrder.vue') },
  { path: '/shop', name: 'ShopOrder', component: () => import('@/views/ShopOrder.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
