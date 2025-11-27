<script setup lang="ts">
import { RouterView } from "vue-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/sidebar.vue";
</script>

<template>
  <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <SidebarTrigger />
        <RouterView />
      </SidebarInset>
  </SidebarProvider>
</template>
