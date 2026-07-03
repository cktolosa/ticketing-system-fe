<script setup lang="ts">
import { Eye, MoreHorizontal } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { getRolePaths } from '@/lib/utils';

import type { Faq } from '@/modules/faqs';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const basePath = getRolePaths[auth.user?.role ?? ''];

defineProps<{
  faq: Faq;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon-sm">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="size-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem as-child>
        <router-link :to="`${basePath}/faqs/${faq.id}`">
          <Eye />
          View
        </router-link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
