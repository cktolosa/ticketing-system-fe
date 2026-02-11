import { createRouter, createWebHistory } from 'vue-router';

// https://router.vuejs.org/guide/advanced/lazy-loading.html#Lazy-Loading-Routes
const routes = [
  {
    path: '/',
    component: () => import('@/modules/authentication/pages/login.vue'),
  },
  {
    path: '/sample',
    component: () => import('@/modules/authentication/pages/sample.vue'),
  },
  {
    path: '/su',
    name: 'Dashboard',
    component: () => import('@/components/layouts/superuser.vue'),
    children: [
      {
        path: '',
        component: () => import('@/modules/dashboard/pages/superuser.vue'),
      },
      {
        path: 'tickets',
        name: 'Tickets',
        redirect: '/su/tickets',
        children: [
          {
            path: 'create',
            name: 'File Ticket',
            component: () => import('@/modules/tickets/pages/create.vue'),
          },
          {
            path: 'reported',
            name: 'My Tickets',
            component: () => import('@/modules/tickets/pages/reported.vue'),
          },
          {
            path: 'assigned',
            name: 'Assigned Tickets',
            component: () => import('@/modules/tickets/pages/assigned.vue'),
          },
          {
            path: '',
            name: 'All Tickets',
            component: () => import('@/modules/tickets/pages/index.vue'),
          },
          {
            path: 'view',
            name: 'View Ticket',
            component: () => import('@/modules/tickets/pages/view.vue'),
          },
        ],
      },
      {
        path: 'users',
        name: 'Users',
        redirect: '/su/users',
        children: [
          {
            path: 'create',
            name: 'Create User',
            component: () => import('@/modules/users/pages/create.vue'),
          },
          {
            path: '',
            name: 'All Users',
            component: () => import('@/modules/users/pages/index.vue'),
          },
          {
            path: 'view',
            name: 'View User',
            component: () => import('@/modules/users/pages/view.vue'),
          },
        ],
      },
      {
        path: 'departments',
        name: 'Departments',
        redirect: '/su/departments',
        children: [
          {
            path: '',
            name: 'All Departments',
            component: () => import('@/modules/departments/pages/index.vue'),
          },
          {
            path: 'view',
            name: 'View Department',
            component: () => import('@/modules/departments/pages/view.vue'),
          },
        ],
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
