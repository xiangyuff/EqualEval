import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

const routes = [
  {
    path: '/',
    redirect: '/login' // 默认跳转到登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/Login.vue"),
    meta: { auth: false }
  },
  {
    path: "/task",
    name: "Task",
    component: () => import("@/views/Task.vue"),
    meta: { auth: true },
  },
  {
    path: "/task/taskdetail/:task_id",
    name: "TaskDetail",
    component: () => import("@/views/TaskDetail.vue"),
  },
  {
    path: "/dataset",
    name: "Dataset",
    component: () => import("@/views/Dataset.vue"),
    meta: { auth: true },
  },
  {
    path: "/dataset/datasetdetail/:dataset_id",
    name: "DatasetDetail",
    component: () => import("@/views/DatasetDetail.vue"),
  },
  {
    path: "/model",
    name: "Model",
    component: () => import("@/views/Model.vue"),
    meta: { auth: true },
  },
  {
    path: "/model/modeldetail/:model_id",
    name: "ModelDetail",
    component: () => import("@/views/ModelDetail.vue"),
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("@/views/Report.vue"),
    meta: { auth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // 需要确保在 setup 中引入
  const isAuthenticated = userStore.isLoggedIn;

  if (to.meta.auth) {
    if (isAuthenticated) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;