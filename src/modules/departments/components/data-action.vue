<script setup lang="ts">
import { Eye, MoreHorizontal } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        <router-link to="/su/departments/view">
          <Eye />
          View
        </router-link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
