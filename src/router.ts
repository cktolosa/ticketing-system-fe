import { createRouter, createWebHistory } from "vue-router";

// https://router.vuejs.org/guide/advanced/lazy-loading.html#Lazy-Loading-Routes
const routes = [{
  path: '/',
  component: () => import('./modules/authentication/pages/login.vue')
},
{
  path: '/sample',
  component: () => import('./modules/authentication/pages/sample.vue')
}
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
