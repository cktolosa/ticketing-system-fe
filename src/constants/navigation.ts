import { CircleHelp, FilePlus, Files, LayoutDashboard, UserPlus, Users } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface MenuItem {
  title: string;
  url?: string;
  icon: Component;
  children?: MenuItem[];
}

export interface FooterItem {
  title: string;
  url?: string;
  action?: () => void;
  icon: Component;
}

export const SU_NAV_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/su/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Management',
    url: '/su/companies',
    icon: Files,
  },
  {
    title: 'Tickets',
    icon: Files,
    children: [
      {
        title: 'Create Ticket',
        url: '/su/tickets/create',
        icon: FilePlus,
      },
      {
        title: 'My Tickets',
        url: '/su/tickets/reported',
        icon: Files,
      },
      {
        title: 'Assigned Tickets',
        url: '/su/tickets/assigned',
        icon: Files,
      },
      {
        title: 'All Tickets',
        url: '/su/tickets',
        icon: Files,
      },
    ],
  },
  {
    title: 'Users',
    icon: Users,
    children: [
      {
        title: 'Create User',
        url: '/su/users/create',
        icon: UserPlus,
      },
      {
        title: 'All Users',
        url: '/su/users',
        icon: Users,
      },
    ],
  },
  {
    title: 'FAQs',
    icon: CircleHelp,
    children: [
      {
        title: 'Create FAQ',
        url: '/su/faqs/create',
        icon: FilePlus,
      },
      {
        title: 'All FAQs',
        url: '/su/faqs',
        icon: Files,
      },
    ],
  },
];

export const SUPPORT_NAV_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/support/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tickets',
    icon: Files,
    children: [
      {
        title: 'Create Ticket',
        url: '/support/tickets/create',
        icon: FilePlus,
      },
      {
        title: 'My Tickets',
        url: '/support/tickets/reported',
        icon: Files,
      },
      {
        title: 'Assigned Tickets',
        url: '/support/tickets',
        icon: Files,
      },
    ],
  },
  {
    title: 'FAQs',
    icon: CircleHelp,
    children: [
      {
        title: 'Create FAQ',
        url: '/support/faqs/create',
        icon: FilePlus,
      },
      {
        title: 'My FAQs',
        url: '/support/faqs',
        icon: Files,
      },
    ],
  },
];

export const ADMIN_NAV_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tickets',
    icon: Files,
    children: [
      {
        title: 'Create Ticket',
        url: '/admin/tickets/create',
        icon: FilePlus,
      },
      {
        title: 'My Tickets',
        url: '/admin/tickets/reported',
        icon: Files,
      },
      {
        title: 'Assigned Tickets',
        url: '/admin/tickets/assigned',
        icon: Files,
      },
      {
        title: 'Department Tickets',
        url: '/admin/tickets',
        icon: Files,
      },
    ],
  },
  {
    title: 'FAQs',
    icon: CircleHelp,
    children: [
      {
        title: 'Create FAQ',
        url: '/admin/faqs/create',
        icon: FilePlus,
      },
      {
        title: 'Department FAQs',
        url: '/admin/faqs',
        icon: Files,
      },
    ],
  },
];

export const CUSTOMER_NAV_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/customer/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tickets',
    icon: Files,
    children: [
      {
        title: 'Create Ticket',
        url: '/customer/tickets/create',
        icon: FilePlus,
      },
      {
        title: 'My Tickets',
        url: '/customer/tickets',
        icon: Files,
      },
    ],
  },
  {
    title: 'FAQs',
    url: '/customer/faqs',
    icon: CircleHelp,
  },
];
