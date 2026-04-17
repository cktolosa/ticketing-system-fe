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
    redirect: '/su/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/superuser.vue'),
      },
      {
        path: 'tickets',
        name: 'Tickets',
        redirect: '/su/tickets',
        children: [
          {
            path: 'create',
            name: 'Create Ticket',
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
        path: 'companies',
        name: 'Management',
        redirect: '/su/companies',
        children: [
          {
            path: '',
            name: 'All Companies',
            component: () => import('@/modules/companies/pages/index.vue'),
          },
          {
            path: 'view',
            name: 'View Company',
            meta: { title: 'Adish International Corporation' },
            component: () => import('@/modules/departments/pages/index.vue'),
          },
          {
            path: 'view/department',
            name: 'View Department',
            meta: { title: 'Team Banana' },
            component: () => import('@/modules/departments/pages/view.vue'),
          },
        ],
      },
      {
        path: 'faqs',
        name: 'FAQs',
        redirect: '/su/faqs',
        children: [
          {
            path: 'create',
            name: 'Create FAQ',
            component: () => import('@/modules/faqs/pages/create.vue'),
          },
          {
            path: '',
            name: 'All FAQs',
            component: () => import('@/modules/faqs/pages/index.vue'),
          },
          {
            path: 'view',
            name: 'View FAQ',
            component: () => import('@/modules/faqs/pages/view.vue'),
          },
        ],
      },
      {
        path: 'profile',
        name: 'View Profile',
        component: () => import('@/modules/profile/pages/index.vue'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'Admin Dashboard',
    meta: { title: 'Dashboard' },
    component: () => import('@/components/layouts/admin.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/admin.vue'),
      },
    ],
  },
  {
    path: '/support',
    name: 'Support Dashboard',
    meta: { title: 'Dashboard' },
    component: () => import('@/components/layouts/support.vue'),
    redirect: '/support/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/support.vue'),
      },
    ],
  },
  {
    path: '/customer',
    name: 'Customer Dashboard',
    meta: { title: 'Dashboard' },
    component: () => import('@/components/layouts/customer.vue'),
    redirect: '/customer/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/customer.vue'),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
