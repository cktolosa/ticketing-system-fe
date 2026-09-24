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

import type { Ticket } from '@/modules/tickets';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const basePath = getRolePaths[auth.user?.role?.name ?? ''];
defineProps<{
  ticket: Ticket;
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
        <router-link :to="`${basePath}/tickets/${ticket.id}`">
          <Eye />
          View
        </router-link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
