<script setup lang="ts">
import { useRoute, RouterView } from "vue-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Component } from 'vue';
import { 
    ChevronRight,
    ChevronUp,
    LayoutDashboard,
    FileText, 
    FilePlus, 
    Files, 
    UserPlus, 
    User, 
    Users, 
    CircleHelp,
    LogOut,
} from 'lucide-vue-next';
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
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'; 
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 
import Header from "../header.vue";

const route = useRoute();
const isChildActive = (item: MenuItem): boolean => {
    return item.children?.some((child) => route.path === child.url) ?? false; 
}; 

interface MenuItem {
    title: string, 
    url?: string, 
    icon: Component,
    children?: MenuItem[],
}; 
const items: MenuItem[] = [
    {
        title: "Dashboard", 
        url: "/su",
        icon: LayoutDashboard,
    }, 
    {
        title: "Tickets", 
        icon: Files,
        children: [
            {
                title: "File Ticket", 
                url: "/su/tickets/create",
                icon: FilePlus,
            }, 
            {
                title: "My Tickets", 
                url: "/su/tickets/user",
                icon: FileText,
            }, 
            {
                title: "All Tickets", 
                url: "/su/tickets/all",
                icon: Files,
            }, 
        ]
    }, 
    {
        title: "Users", 
        icon: Users,
        children: [
            {
                title: "Create User", 
                url: "/users/create",
                icon: UserPlus,
            }, 
            {
                title: "All Users", 
                url: "/users",
                icon: Users,
            }, 
        ]
    }, 
    {
        title: "Departments", 
        icon: Files,
        children: [
            {
                title: "Create Department", 
                url: "/departments/create",
                icon: FilePlus,
            }, 
            {
                title: "All Departments", 
                url: "/departments",
                icon: Files,
            }, 
        ]
    }, 
    {
        title: "FAQs", 
        icon: CircleHelp,
        children: [
            {
                title: "Create FAQ", 
                url: "/faqs/create",
                icon: FilePlus,
            }, 
            {
                title: "All FAQs", 
                url: "/faqs",
                icon: Files,
            }, 
        ]
    }, 
]; 

interface FooterItem {
    title: string, 
    url: string, 
    icon: Component,
}; 
const footer: FooterItem[] = [
    {
        title: "View Profile",
        url: "/profile",
        icon: User,
    },
    {
        title: "Log Out",
        url: "/logout",
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
                                        :to="item.url|| ''"
                                        exact-active-class="bg-sidebar-primary text-sidebar-primary-foreground"
                                    >
                                        <component :is="item.icon"/>
                                        <span>{{ item.title }}</span>
                                    </router-link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <Collapsible 
                              v-else 
                              as-child
                              class="group/collapsible"
                              :key="route.path"
                              :data-active="isChildActive(item)"
                              :default-open="isChildActive(item)"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger as-child>
                                      <SidebarMenuButton 
                                        class="
                                          group-data-[active=true]/collapsible:bg-sidebar-primary
                                          group-data-[active=true]/collapsible:text-sidebar-primary-foreground
                                        "
                                      >
                                        <component :is="item.icon"/>
                                        <span>{{ item.title }}</span>
                                        <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                      </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem v-for="child in item.children" :key="child.title">
                                                <SidebarMenuSubButton as-child >
                                                    <router-link 
                                                        :to="child.url || ''"
                                                        exact-active-class="bg-sidebar-primary text-sidebar-primary-foreground"
                                                    >
                                                        <component :is="child.icon"/>
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
                                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <User class="size-4"/>
                                </div>  
                                <div class="grid flex-1 text-left text-sm leading-tight">
                                    <span class="truncate font-semibold">Juan Dela Cruz</span>
                                    <span class="truncate text-xs">juan@email.com</span>
                                </div>
                                <ChevronUp class="ml-auto size-4"/>
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
                                    <component :is="item.icon" class="mr-2 size-4"/>
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
