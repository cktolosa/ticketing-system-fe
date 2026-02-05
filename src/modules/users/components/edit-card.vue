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
      <CardDescription v-if="description && showWarning" class="flex flex-row items-center gap-x-2">
        <TriangleAlert class="hidden size-4 lg:block" />
        {{ description }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
