<script setup lang="ts">
import { computed } from 'vue';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { formatPercentage, getTrend } from '@/lib/utils';

import type { MetricMeta } from '@/constants/metrics';

interface CardItem {
  key: string;
  value: number;
  percentage?: number;
}

const props = withDefaults(
  defineProps<{
    data: CardItem[];
    meta: Record<string, MetricMeta>;
    loading?: boolean;
  }>(),
  {
    data: () => [],
    loading: false,
  }
);

const items = computed(() =>
  props.data.map((data) => ({
    ...props.meta[data.key],
    value: `${data.value} ${props.meta[data.key]?.unit ?? ''}`,
    percentage: data.percentage,
    trend: data.percentage !== undefined ? getTrend(data.percentage) : null,
  }))
);
</script>

<template>
  <div
    class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid auto-rows-min grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t lg:grid-cols-2 xl:grid-cols-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
  >
    <template v-if="loading">
      <Card
        v-for="n in data.length || 4"
        :key="n"
        class="@container/card row-span-3 grid grid-rows-subgrid"
      >
        <CardHeader class="row-start-1">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-6 w-16" />
        </CardHeader>
        <Skeleton class="row-start-2 mx-6 h-7 w-32" />
        <CardFooter class="row-start-3 flex-col items-start gap-2">
          <Skeleton class="h-4 w-40" />
          <Skeleton class="h-4 w-52" />
        </CardFooter>
      </Card>
    </template>

    <template v-else>
      <Card
        v-for="item in items"
        :key="item.title"
        class="@container/card row-span-3 grid grid-rows-subgrid"
      >
        <CardHeader class="row-start-1">
          <CardDescription>{{ item.title }}</CardDescription>
          <CardAction v-if="item.trend">
            <Badge variant="outline" :class="item.trend.border">
              <component :is="item.trend.icon" :class="['size-4', item.trend.color]" />
              {{ formatPercentage(item.percentage) }}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardTitle class="row-start-2 pl-6 text-xl font-semibold tabular-nums">
          {{ item.value }}
        </CardTitle>
        <CardFooter class="row-start-3 flex-col items-start gap-2 text-sm">
          <div class="flex gap-2 font-medium">
            {{ item.description }}
            <component
              :is="item.trend.icon"
              v-if="item.trend"
              :class="['size-4', item.trend.color]"
            />
          </div>
          <div class="text-muted-foreground">
            {{ item.recommendation }}
          </div>
        </CardFooter>
      </Card>
    </template>
  </div>
</template>
