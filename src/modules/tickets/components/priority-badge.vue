<script setup lang="ts">
import { Circle, CircleArrowDown, CircleArrowRight, CircleArrowUp } from 'lucide-vue-next';
import type { Component } from 'vue';
import { computed } from 'vue';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

import type { Priority } from '@/modules/tickets';

const { priority } = defineProps<{
  priority: Priority;
}>();

type PriorityConfig = {
  class: string;
  icon: Component;
};

const config: Record<number, PriorityConfig> = {
  1: {
    class: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-300',
    icon: Circle,
  },
  2: {
    class: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-300',
    icon: CircleArrowDown,
  },
  3: {
    class: 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-400',
    icon: CircleArrowRight,
  },
  4: {
    class: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-400',
    icon: CircleArrowUp,
  },
};

const current = computed(() => config[priority.id]);
</script>

<template>
  <Badge v-if="current" :class="cn('inline-flex items-center gap-1 capitalize', current.class)">
    <component :is="current.icon" class="size-3" />
    {{ priority.category }}
  </Badge>
</template>
