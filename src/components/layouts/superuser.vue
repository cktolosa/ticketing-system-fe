<script setup lang="ts">
import {
  ChevronRight,
  ChevronUp,
  CircleHelp,
  FilePlus,
  Files,
  LayoutDashboard,
  LogOut,
  User,
  UserPlus,
  Users,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

import Header from '../header.vue';

const route = useRoute();
const isChildActive = (item: MenuItem): boolean => {
  return (
    item.children?.some((child) => {
      return route.path === child.url || route.path.startsWith(child.url + '/');
    }) ?? false
  );
};

interface MenuItem {
  title: string;
  url?: string;
  icon: Component;
  children?: MenuItem[];
}
const items: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/su',
    icon: LayoutDashboard,
  },
  {
    title: 'Departments',
    url: '/su/departments',
    icon: Files,
  },
  {
    title: 'Tickets',
    icon: Files,
    children: [
      {
        title: 'File Ticket',
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
        url: '/faqs/create',
        icon: FilePlus,
      },
      {
        title: 'All FAQs',
        url: '/faqs',
        icon: Files,
      },
    ],
  },
];

interface FooterItem {
  title: string;
  url: string;
  icon: Component;
}
const footer: FooterItem[] = [
  {
    title: 'View Profile',
    url: '/profile',
    icon: User,
  },
  {
    title: 'Log Out',
    url: '/logout',
    icon: LogOut,
  },
];
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <template v-for="item in items" :key="item.title">
                <SidebarMenuItem v-if="!item.children">
                  <SidebarMenuButton as-child>
                    <router-link
                      :to="item.url || ''"
                      :class="
                        cn(
                          route.path === item.url ||
                            (item.url &&
                              item.url !== '/su' &&
                              route.path.startsWith(item.url + '/'))
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : ''
                        )
                      "
                    >
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                    </router-link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <Collapsible
                  v-else
                  :key="route.path"
                  as-child
                  class="group/collapsible"
                  :data-active="isChildActive(item)"
                  :default-open="isChildActive(item)"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                      <SidebarMenuButton
                        class="group-data-[active=true]/collapsible:bg-sidebar-primary group-data-[active=true]/collapsible:text-sidebar-primary-foreground"
                      >
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <ChevronRight
                          class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem v-for="child in item.children" :key="child.title">
                          <SidebarMenuSubButton as-child>
                            <router-link
                              :to="child.url || ''"
                              exact-active-class="bg-sidebar-primary text-sidebar-primary-foreground"
                            >
                              <component :is="child.icon" />
                              <span>{{ child.title }}</span>
                            </router-link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </template>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div
                    class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                  >
                    <User class="size-4" />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">Juan Dela Cruz</span>
                    <span class="truncate text-xs">juan@email.com</span>
                  </div>
                  <ChevronUp class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                :side-offset="4"
              >
                <DropdownMenuItem v-for="item in footer" :key="item.title" as-child>
                  <router-link
                    :to="item.url"
                    class="cursor-pointer"
                    exact-active-class="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <component :is="item.icon" class="mr-2 size-4" />
                    {{ item.title }}
                  </router-link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <Header />
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
