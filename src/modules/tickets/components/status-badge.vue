<script setup lang="ts">
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

import type { Status } from '@/modules/tickets';

defineProps<{
  status: Status;
}>();

const styles: Record<number, string> = {
  1: 'bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-400',
  2: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-400',
  3: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-400',
  4: 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-400',
};
</script>

<template>
  <Badge :class="cn('capitalize', styles[status.id])">
    {{ status.category }}
  </Badge>
</template>
