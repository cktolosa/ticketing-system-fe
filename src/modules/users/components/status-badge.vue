<script setup lang="ts">
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

import UserStatus from './types.ts';

defineProps<{
  status: UserStatus;
}>();

const styles: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-400',
  inactive: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-400',
};
</script>

<template>
  <Badge :class="cn('capitalize', styles[status])">
    {{ status }}
  </Badge>
</template>
