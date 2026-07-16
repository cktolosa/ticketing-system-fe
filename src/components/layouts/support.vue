<script setup lang="ts">
import { ChevronRight, ChevronUp, LogOut, User } from 'lucide-vue-next';
import { RouterView, useRoute, useRouter } from 'vue-router';

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
import { UserAvatar } from '@/components/user-avatar';

import { SUPPORT_NAV_ITEMS } from '@/constants/navigation';
import type { FooterItem, MenuItem } from '@/constants/navigation';
import { useAuthStore } from '@/stores/auth';

import Header from '../header.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
  router.push('/');
}

const items = SUPPORT_NAV_ITEMS;

const footer: FooterItem[] = [
  {
    title: 'View Profile',
    url: '/support/profile',
    icon: User,
  },
  {
    title: 'Log Out',
    action: handleLogout,
    icon: LogOut,
  },
];

const isChildActive = (item: MenuItem): boolean => {
  return (
    item.children?.some((child) => {
      return route.path === child.url || route.path.startsWith(child.url + '/');
    }) ?? false
  );
};
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
                      active-class="bg-sidebar-primary text-sidebar-primary-foreground"
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
                  <UserAvatar
                    :src="auth.user?.avatar?.urls?.full"
                    :name="auth.user?.name ?? 'Unknown'"
                    :subtitle="auth.user?.email ?? 'Unknown'"
                    variant="md"
                  />
                  <ChevronUp class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                :side-offset="4"
              >
                <DropdownMenuItem v-for="item in footer" :key="item.title" as-child>
                  <button
                    v-if="item.action"
                    class="flex w-full cursor-pointer items-center"
                    @click="item.action"
                  >
                    <component :is="item.icon" class="mr-2 size-4" />
                    {{ item.title }}
                  </button>
                  <router-link
                    v-else
                    :to="item.url ?? ''"
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
