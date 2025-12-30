<script setup lang="ts">
import { type Component, type HTMLAttributes } from "vue";
import type { Column, SortDirection } from "@tanstack/vue-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  CircleXIcon,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
  column: Column<any, any>;
  class?: HTMLAttributes["class"];
}>();

const sortIconMapping = new Map<false | SortDirection, Component>([
  [false, ArrowUpDownIcon],
  ["asc", ArrowDownNarrowWideIcon],
  ["desc", ArrowDownWideNarrowIcon],
]);
</script>

<template>
  <DropdownMenu v-if="column.getCanSort()">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        :class="cn('justify-start rounded-sm gap-x-2', props.class)"
      >
        <slot />
        <component
          :is="sortIconMapping.get(column.getIsSorted())"
          class="size-3.5"
        />
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
