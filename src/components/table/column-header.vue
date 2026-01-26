<script setup lang="ts" generic="T extends Column<any, any>">
import type { Column, SortDirection } from '@tanstack/vue-table';
import {
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  CircleXIcon,
} from 'lucide-vue-next';
import { type Component, type HTMLAttributes } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';

const props = defineProps<{
  column: T;
  class?: HTMLAttributes['class'];
}>();

const sortIconMapping = new Map<false | SortDirection, Component>([
  [false, ArrowUpDownIcon],
  ['asc', ArrowDownNarrowWideIcon],
  ['desc', ArrowDownWideNarrowIcon],
]);
</script>

<template>
  <DropdownMenu v-if="column.getCanSort()">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" :class="cn('justify-start gap-x-2 rounded-sm', props.class)">
        <slot />
        <component :is="sortIconMapping.get(column.getIsSorted())" class="size-3.5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Sorting</DropdownMenuLabel>
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowDownNarrowWideIcon />
          Ascending
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDownWideNarrowIcon />
          Descending
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.clearSorting()">
          <CircleXIcon />
          Reset
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>

  <span v-else :class="cn('px-2', props.class)">
    <slot />
  </span>
</template>
