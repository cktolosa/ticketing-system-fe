<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const route = useRoute();

interface Breadcrumb {
  name: string;
  to: string;
  isLast: boolean;
}
const breadcrumbs = computed<Breadcrumb[]>(() => {
  const matched = route.matched.filter((record) => record.name);
  return matched.map((record, index) => ({
    name: record.name?.toString() || '',
    to: record.path,
    isLast: index === matched.length - 1,
  }));
});
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <template v-for="crumb in breadcrumbs" :key="crumb.to">
            <BreadcrumbItem v-if="!crumb.isLast" class="hidden md:block">
              <BreadcrumbLink as-child>
                <router-link :to="crumb.to || ''">
                  {{ crumb.name }}
                </router-link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbPage v-else class="hidden md:block">
              {{ crumb.name }}
            </BreadcrumbPage>
            <BreadcrumbSeparator v-if="!crumb.isLast" class="hidden md:block" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
</template>
