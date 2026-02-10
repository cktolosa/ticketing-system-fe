<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

defineProps<{
  title: string;
  description?: string;
  showWarning?: boolean;
}>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription v-if="description" class="flex items-center gap-2">
        <TriangleAlert v-if="showWarning" class="size-4 shrink-0" />
        <span>{{ description }}</span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
