import { createRouter, createWebHistory } from 'vue-router';

import { getRolePaths } from './lib/utils';
import { useAuthStore } from './stores/auth';

// https://router.vuejs.org/guide/advanced/lazy-loading.html#Lazy-Loading-Routes
const routes = [
  {
    path: '/',
    component: () => import('@/modules/authentication/pages/login.vue'),
    meta: { guest: true },
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
    meta: { requiresAuth: true, role: 'superadmin' },
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
            path: ':id',
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
            path: ':id',
            name: 'View Company',
            component: () => import('@/modules/departments/pages/index.vue'),
          },
          {
            path: ':companyId/department/:id',
            name: 'View Department',
            component: () => import('@/modules/departments/pages/view.vue'),
          },
        ],
      },
      {
        path: 'faqs',
        name: 'SU FAQs',
        meta: { title: 'FAQs' },
        redirect: '/su/faqs',
        children: [
          {
            path: 'create',
            name: 'SU Create FAQ',
            meta: { title: 'Create FAQ' },
            component: () => import('@/modules/faqs/pages/create.vue'),
          },
          {
            path: '',
            name: 'SU All FAQs',
            meta: { title: 'All FAQs' },
            component: () => import('@/modules/faqs/pages/index.vue'),
          },
          {
            path: ':id',
            name: 'SU View FAQ',
            meta: { title: 'View FAQ' },
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
    meta: { requiresAuth: true, role: 'admin', title: 'Dashboard' },
    component: () => import('@/components/layouts/admin.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/admin.vue'),
      },
      {
        path: 'faqs',
        name: 'Admin FAQs',
        meta: { title: 'FAQs' },
        redirect: '/admin/faqs',
        children: [
          {
            path: 'create',
            name: 'Admin Create FAQ',
            meta: { title: 'Create FAQ' },
            component: () => import('@/modules/faqs/pages/create.vue'),
          },
          {
            path: '',
            name: 'Admin Department FAQs',
            meta: { title: 'Department FAQs' },
            component: () => import('@/modules/faqs/pages/index.vue'),
          },
          {
            path: ':id',
            name: 'Admin View FAQ',
            meta: { title: 'View FAQ' },
            component: () => import('@/modules/faqs/pages/view.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/support',
    name: 'Support Dashboard',
    meta: { requiresAuth: true, role: 'support', title: 'Dashboard' },
    component: () => import('@/components/layouts/support.vue'),
    redirect: '/support/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/support.vue'),
      },
      {
        path: 'faqs',
        name: 'Support FAQs',
        meta: { title: 'FAQs' },
        redirect: '/support/faqs',
        children: [
          {
            path: 'create',
            name: 'Support Create FAQ',
            meta: { title: 'Create FAQ' },
            component: () => import('@/modules/faqs/pages/create.vue'),
          },
          {
            path: '',
            name: 'Support My FAQs',
            meta: { title: 'My FAQs' },
            component: () => import('@/modules/faqs/pages/index.vue'),
          },
          {
            path: ':id',
            name: 'Support View FAQ',
            meta: { title: 'View FAQ' },
            component: () => import('@/modules/faqs/pages/view.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/customer',
    name: 'Customer Dashboard',
    meta: { requiresAuth: true, role: 'customer', title: 'Dashboard' },
    component: () => import('@/components/layouts/customer.vue'),
    redirect: '/customer/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/modules/dashboard/pages/customer.vue'),
      },
      {
        path: 'faqs',
        name: 'Customer FAQs',
        meta: { title: 'FAQs' },
        redirect: '/customer/faqs',
        children: [
          {
            path: '',
            name: 'Customer FAQS',
            meta: { title: 'FAQs' },
            component: () => import('@/modules/faqs/pages/customer-view.vue'),
          },
          {
            path: ':id',
            name: 'Customer View FAQ',
            meta: { title: 'View FAQ' },
            component: () => import('@/modules/faqs/pages/view.vue'),
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

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
      return '/';
    }
  }

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const requiredRole = to.matched.find((r) => r.meta.role)?.meta.role;

  if (to.meta.guest && auth.isAuthenticated) {
    return getRolePaths[auth.user?.role?.name ?? ''] ?? '/';
  }

  if (requiresAuth && !auth.isAuthenticated) {
    return '/';
  }

  if (requiredRole && auth.user?.role?.name !== requiredRole) {
    return getRolePaths[auth.user?.role?.name ?? ''] ?? '/';
  }
});
