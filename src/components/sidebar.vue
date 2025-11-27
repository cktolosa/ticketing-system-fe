<script setup lang="ts">
import { ref } from 'vue';
import type { Component, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { 
    ChevronRight,
    ChevronDown,
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

const route = useRoute();
const isChildActive = (item: MenuItem): boolean => {
    return item.children?.some((child) => route.path === child.url) ?? false; 
}; 

interface MenuItem {
    title: string, 
    url?: string, 
    icon: Component,
    children?: MenuItem[],
    isOpen?: Ref<boolean>,
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
        isOpen: ref(false),
        children: [
            {
                title: "File Ticket", 
                url: "/tickets/create",
                icon: FilePlus,
            }, 
            {
                title: "My Tickets", 
                url: "/tickets/user",
                icon: FileText,
            }, 
            {
                title: "All Tickets", 
                url: "/su/tickets",
                icon: Files,
            }, 
        ]
    }, 
    {
        title: "Users", 
        icon: Users,
        isOpen: ref(false),
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
        isOpen: ref(false),
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
        isOpen: ref(false),
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
                                v-else-if="item.isOpen" 
                                v-model:open="item.isOpen.value"  
                                as-child
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger as-child>
                                        <SidebarMenuButton 
                                            :class="{ 'bg-sidebar-primary text-sidebar-primary-foreground': isChildActive(item) }"
                                        >
                                            <component :is="item.icon"/>
                                            <span>{{ item.title }}</span>
                                           <component 
                                                :is="item.isOpen.value ? ChevronDown : ChevronRight" 
                                                class="ml-auto"
                                            />
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
</template>

<style scoped>
a.bg-sidebar-primary svg, a.bg-sidebar-primary span {
  color: hsl(var(--sidebar-primary-foreground)) !important;
}
</style>