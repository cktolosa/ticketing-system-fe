<script setup lang="ts">
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

import type { Status } from '@/modules/tickets/types';

defineProps<{
  status: Status;
}>();

const styles: Record<Status, string> = {
  new: 'bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-400',
  'in progress': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-400',
  resolved: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-400',
  closed: 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-400',
};
</script>

<template>
  <Badge :class="cn('capitalize', styles[status])">
    {{ status }}
  </Badge>
</template>
