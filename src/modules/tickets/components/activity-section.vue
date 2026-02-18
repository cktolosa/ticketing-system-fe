<script setup lang="ts">
import { Circle } from 'lucide-vue-next';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { formatDate } from '@/lib/utils';

import { type History } from '@/modules/tickets/types';

defineProps<{
  histories: History[];
}>();
</script>

<template>
  <Card class="min-h-100">
    <CardHeader>
      <h3 class="text-sm font-semibold">Activity</h3>
    </CardHeader>
    <CardContent class="max-h-125 space-y-3 overflow-y-auto">
      <div
        v-for="(history, index) in histories"
        :key="index"
        class="flex items-start gap-3 gap-y-3"
      >
        <Circle class="text-muted-foreground mt-2 size-2 fill-current" />
        <div class="flex-1">
          <div class="text-sm">{{ history.description }}</div>
          <span class="text-muted-foreground text-xs">
            {{ formatDate(history.timestamp) }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
