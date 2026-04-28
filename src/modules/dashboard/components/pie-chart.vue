<script setup lang="ts">
import { Donut } from '@unovis/ts';
import { VisDonut, VisSingleContainer } from '@unovis/vue';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

import { formatPercentage, getTrend } from '@/lib/utils';

type DonutSegment<T> = T | { data: T };
type categories = 'new' | 'in_progress' | 'resolved' | 'closed';

interface PieCategory {
  category: categories;
  count: number;
}
interface PieChart {
  categories: PieCategory[];
  percentage: number;
  total: number;
}

const props = withDefaults(
  defineProps<{
    data: PieChart;
    loading?: boolean;
  }>(),
  {
    data: () => ({ categories: [], percentage: 0, total: 0 }),
    loading: false,
  }
);

const pieConfig = {
  new: {
    label: 'New',
    color: 'var(--color-purple-400)',
  },
  in_progress: {
    label: 'In Progress',
    color: 'var(--color-blue-400)',
  },
  resolved: {
    label: 'Resolved',
    color: 'var(--color-green-300)',
  },
  closed: {
    label: 'Closed',
    color: 'var(--color-gray-400)',
  },
} satisfies ChartConfig;

const tooltip = (d: DonutSegment<PieCategory>) => {
  const item: PieCategory = 'data' in d ? d.data : d;
  return `
    <div class='bg-white text-xs p-2 rounded-full flex flex-row justify-between gap-3'>
      <div class='flex flex-row justify-center items-center gap-1'>
        <div class='size-3 rounded' style='background-color: ${pieConfig[item.category].color}'></div>
        <div class='font-medium'>${pieConfig[item.category].label}</div>
      </div>
      <div class='text-muted-foreground'>${item.count} tickets</div>
    </div>`;
};
</script>

<template>
  <Card class="row-span-3 grid grid-rows-subgrid">
    <CardHeader class="row-start-1 items-center">
      <CardTitle>Ticket Counts</CardTitle>
    </CardHeader>

    <template v-if="loading">
      <CardContent class="row-start-2 flex items-center justify-center">
        <Skeleton class="mx-auto aspect-square max-h-[300px] w-full rounded-full" />
      </CardContent>
      <CardFooter class="row-start-3 flex-col items-center gap-2">
        <Skeleton class="h-4 w-56" />
        <Skeleton class="h-4 w-44" />
      </CardFooter>
    </template>

    <template v-else>
      <CardContent class="row-start-2 flex-1">
        <ChartContainer :config="pieConfig" class="donut-chart mx-auto aspect-square max-h-[300px]">
          <VisSingleContainer :data="props.data.categories" :margin="{ top: 30, bottom: 30 }">
            <VisDonut
              :value="(d: PieCategory) => d.count"
              :color="(d: PieCategory) => pieConfig[d.category].color"
              :arc-width="30"
              :central-label-offset-y="10"
              :central-label="props.data.total?.toLocaleString() ?? '0'"
              central-sub-label="Tickets"
            />
            <ChartTooltip :triggers="{ [Donut.selectors.segment]: tooltip }" />
          </VisSingleContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter class="row-start-3 flex-col gap-2 text-sm">
        <div class="flex gap-2 leading-none font-medium">
          Ticket volume changed by
          {{ formatPercentage(data?.percentage ?? '0') }} from last month.
          <component
            :is="getTrend(data.percentage).icon"
            :class="['size-4', getTrend(data.percentage).color]"
          />
        </div>
        <div class="text-muted-foreground leading-none">
          Showing all tickets by status for this month.
        </div>
      </CardFooter>
    </template>
  </Card>
</template>
