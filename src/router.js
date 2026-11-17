// 路由表，自己一条一条写的
// 这个component不知道干嘛用的，先留着吧
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

let routes = [
    { path: "/", redirect: "/login" },
    { path: "/home", component: function () { return import('@/page/Home.vue') } },
    { path: "/login", component: function () { return import('@/page/Login.vue') } },
    { path: "/reg", component: function () { return import('@/page/Reg.vue') } },
    { path: "/shop", component: function () { return import('@/page/Shop.vue') } },
    { path: "/DoctorDetail/:id", component: function () { return import('@/page/DoctorDetail.vue') } },
    { path: "/FreeConsultation", component: function () { return import('@/page/FreeConsultation.vue') } },
    { path: "/WebConsulation", component: function () { return import('@/page/WebConsulation.vue') } },
    { path: "/Chat", component: function () { return import('@/page/Chat.vue') } },
    { path: "/Outpatient", component: function () { return import('@/page/Outpatient.vue') } },
    { path: "/HomeCare", component: function () { return import('@/page/HomeCare.vue') } },
    { path: "/DiseaseManagement", component: function () { return import('@/page/DiseaseManagement.vue') } },
    { path: "/Appointment", component: function () { return import('@/page/Appointment.vue') } },
    { path: "/Message", component: function () { return import('@/page/Message.vue') } },
    { path: "/MyFile", component: function () { return import('@/page/MyFile.vue') } },
    { path: "/Hospital", component: function () { return import('@/page/Hospital.vue') } },
    { path: "/Tijiantaocan", component: function () { return import('@/page/Tijiantaocan.vue') } },
    { path: "/FamilyMember", component: function () { return import('@/page/FamilyMember.vue') } },
    { path: "/HealthFile", component: function () { return import('@/page/HealthFile.vue') } },
    { path: "/TijianReport", component: function () { return import('@/page/TijianReport.vue') } },
    { path: "/SelfCommit", component: function () { return import('@/page/SelfCommit.vue') } },
    { path: "/LifeEstimate", component: function () { return import('@/page/LifeEstimate.vue') } },
    { path: "/HealthRisk", component: function () { return import('@/page/HealthRisk.vue') } },
    { path: "/MentalAge", component: function () { return import('@/page/MentalAge.vue') } },
    { path: "/TcmConstitution", component: function () { return import('@/page/TcmConstitution.vue') } },
    { path: "/DiabetesRisk", component: function () { return import('@/page/DiabetesRisk.vue') } },
]

export default routes
