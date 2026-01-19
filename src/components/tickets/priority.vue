<script setup lang="ts">
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-vue-next';
import type { Component } from 'vue';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

//to handle ids
export type Priority = 'low' | 'medium' | 'high';

const { priority } = defineProps<{
  priority: Priority;
}>();

type PriorityConfig = {
  class: string;
  icon: Component;
};

const config: Record<Priority, PriorityConfig> = {
  low: {
    class: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-300',
    icon: ArrowDown,
  },
  medium: {
    class: 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-400',
    icon: ArrowRight,
  },
  high: {
    class: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-400',
    icon: ArrowUp,
  },
};
</script>

<template>
  <Badge :class="cn('inline-flex items-center gap-1 capitalize', config[priority].class)">
    <component :is="config[priority].icon" class="size-3" />
    {{ priority }}
  </Badge>
</template>
