<script setup lang="ts">
import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

import { formatPercentage, getTrend } from '@/lib/utils';

interface BarCategory {
  label: string;
  new: number;
  closed: number;
}

interface BarChart {
  categories: BarCategory[];
  percentage: number;
}

const props = defineProps<{
  data: BarChart;
  loading?: boolean;
}>();

const barConfig = {
  new: { label: 'New', color: 'var(--color-purple-400)' },
  closed: { label: 'Closed', color: 'var(--color-gray-400)' },
} satisfies ChartConfig;
</script>

<template>
  <Card class="row-span-3 grid grid-rows-subgrid">
    <CardHeader class="row-start-1 items-center">
      <CardTitle>Ticket Trends</CardTitle>
    </CardHeader>

    <template v-if="loading">
      <CardContent class="row-start-2 flex items-center justify-center">
        <Skeleton class="mx-auto aspect-square max-h-[300px] w-full" />
      </CardContent>
      <CardFooter class="row-start-3 flex-col items-center gap-2">
        <Skeleton class="h-4 w-56" />
        <Skeleton class="h-4 w-44" />
      </CardFooter>
    </template>

    <template v-else>
      <CardContent class="row-start-2 flex-1 overflow-hidden">
        <ChartContainer :config="barConfig">
          <VisXYContainer
            :data="props.data.categories"
            :margin="{ left: -24 }"
            :y-domain="[0, undefined]"
          >
            <VisGroupedBar
              :x="(_d: BarCategory, i: number) => i"
              :y="[(d: BarCategory) => d.new, (d: BarCategory) => d.closed]"
              :color="[barConfig.new.color, barConfig.closed.color]"
              :rounded-corners="10"
            />
            <VisAxis
              type="x"
              :x="(_d: BarCategory, i: number) => i"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="6"
              :tick-format="(i: number) => props.data.categories[i]?.label ?? ''"
              :tick-values="props.data.categories.map((_d, i) => i)"
            />
            <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
            <ChartTooltip />
            <ChartCrosshair
              :template="
                componentToString(barConfig, ChartTooltipContent, {
                  hideLabel: true,
                })
              "
              color="#0000"
            />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter class="row-start-3 flex-col gap-2 text-sm">
        <div class="flex gap-2 leading-none font-medium">
          Closed ticket volume changed by
          {{ formatPercentage(data.percentage) }} from last month
          <component
            :is="getTrend(data.percentage).icon"
            :class="['size-4', getTrend(data.percentage).color]"
          />
        </div>
        <div class="text-muted-foreground leading-none">
          Showing ticket trends comparison for this month.
        </div>
      </CardFooter>
    </template>
  </Card>
</template>
