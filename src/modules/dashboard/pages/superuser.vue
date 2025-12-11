<script setup lang="ts">
import { computed } from "vue";

import { 
    TrendingUp, 
    TrendingDown, 
    CalendarIcon, 
    Download, 
} from 'lucide-vue-next';

import type { ChartConfig } from "@/components/ui/chart";
import { Donut } from "@unovis/ts";
import { 
    VisDonut, 
    VisSingleContainer,
    VisAxis,
    VisGroupedBar, 
    VisXYContainer,
} from "@unovis/vue";

import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button";
import { 
    Card, 
    CardAction,
    CardContent, 
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartCrosshair, 
    ChartTooltipContent, 
    componentToString
} from "@/components/ui/chart"; 

interface CardItem {
    title: string, 
    value: string, 
    percentage: number, 
    description: string, 
    recommendation: string, 
}; 
const items: CardItem[] = [
    {
        title: "Resolution Time", 
        value: "2.4 days", 
        percentage: 12, 
        description: "Average time to close a ticket",
        recommendation: "Monitor resolution time trends to ensure efficient ticket handling and workflow optimization.", 
    }, 
    {
        title: "Priority Resolution", 
        value: "10 tickets", 
        percentage: 12, 
        description: "Closed high-urgency tickets",
        recommendation: "Continue prioritizing high-urgency tickets to maintain smooth operations and user satisfaction.",
    }, 
    {
        title: "User Activity", 
        value: "6 users", 
        percentage: -15, 
        description: "Users engaged with the system",
        recommendation: "Track user engagement patterns to identify opportunities for system improvement and adoption."
    },
    {
        title: "FAQ Views", 
        value: "342 views", 
        percentage: 22, 
        description: "Total FAQ page visits",
        recommendation: "Keep FAQ content updated and accessible to encourage self-service problem resolution."
    }, 
];

type PieCategory = keyof typeof pieConfig; 
interface PieChart {
    category: PieCategory, 
    tickets: number, 
    fill: string,
}; 

const pie : PieChart[] = [
    { 
        category: "new",
        tickets: 275,
        fill: "var(--color-new)",
    },
    { 
        category: "inProgress",
        tickets: 200,
        fill: "var(--color-inProgress)",
    },
    { 
        category: "resolved",
        tickets: 287,
        fill: "var(--color-resolved)",
    },
    { 
        category: "closed",
        tickets: 173,
        fill: "var(--color-closed)",
    },
]; 

const totalTickets = computed(() => pie.reduce((acc, curr) => acc + curr.tickets, 0)); 

type PieData = typeof pie[number]; 

const pieConfig = {
    new: {
        label: "New",
        color: "var(--chart-1)",
    },
    inProgress: {
        label: "In Progress",
        color: "var(--chart-2)",
    },
    resolved: {
        label: "Resolved",
        color: "var(--chart-3)",
    },
    closed: {
        label: "Closed",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig; 

interface BarChart {
    date: Date, 
    ait: number, 
    development?: number,
};
const bar: BarChart[] = [
    { 
        date: new Date("2025-10-01"),
        ait: 186,
        development: 10,
    },
    { 
        date: new Date("2025-11-01"),
        ait: 305,
    },
    { 
        date: new Date("2025-12-01"),
        ait: 20,
    },
]; 

type BarData = typeof bar[number]

const barConfig = {
    ait: {
        label: "AIT",
        color: "var(--chart-1)",
    },
    development: {
        label: "Development",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig; 

const getTrend = (percentage: number) => {
    const isPositive = percentage >= 0;
    return {
        icon: isPositive ? TrendingUp : TrendingDown,
        color: isPositive ? 'text-green-500' : 'text-destructive',
        border: isPositive ? 'border-green-500' : 'border-destructive',
    };
};
</script>

<template>
    <div class="flex flex-col px-4 md:px-6 gap-4 py-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <h2 class="text-xl font-bold hidden sm:block">Overview</h2>
            <div class="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground border rounded-sm p-2">
                    <CalendarIcon class="h-4 w-4" />
                    <span>October - December 2025</span>
                </div>
                <Button class="w-full sm:w-auto">
                    <Download class="h-4 w-4 mr-2" />
                    Download Report
                </Button>
            </div> 
        </div>
        <div class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card v-for="item in items" :key="item.title" class="@container/card">
                    <CardHeader>
                        <CardDescription>{{ item.title }}</CardDescription>
                        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {{ item.value }}
                        </CardTitle>
                        <CardAction>
                            <Badge 
                                variant="outline" 
                                :class="getTrend(item.percentage).border"
                            >
                                <component
                                    :is="getTrend(item.percentage).icon" 
                                    :class="['h-4 w-4', getTrend(item.percentage).color]"
                                />
                                {{ item.percentage }} %
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter class="flex-col items-start gap-1.5 text-sm">
                        <div class="line-clamp-1 flex gap-2 font-medium">
                            {{ item.description }}
                            <component
                                :is="getTrend(item.percentage).icon" 
                                :class="['h-4 w-4', getTrend(item.percentage).color]"
                            />
                        </div>
                        <div class="text-muted-foreground">
                            {{ item.recommendation }}
                        </div>
                    </CardFooter>
                </Card>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card class="flex flex-col">
                <CardHeader class="items-center pb-0">
                    <CardTitle>Ticket Counts</CardTitle>
                </CardHeader>
                <CardContent class="flex-1 pb-0">
                    <ChartContainer
                        :config="pieConfig"
                        class="mx-auto aspect-square max-h-[300px]"
                        :style="{
                            '--vis-donut-central-label-font-size': 'var(--text-3xl)',
                            '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
                            '--vis-donut-central-label-text-color': 'var(--foreground)',
                            '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
                        }"
                    >
                        <VisSingleContainer
                            :data="pie"
                            :margin="{ top: 30, bottom: 30 }"
                        >
                            <VisDonut
                                :value="(d: PieData) => d.tickets"
                                :color="(d: PieData) => pieConfig[d.category].color"
                                :arc-width="30"
                                :central-label-offset-y="10"
                                :central-label="totalTickets.toLocaleString()"
                                central-sub-label="Tickets"
                            />
                            <ChartTooltip
                                :triggers="{
                                    [Donut.selectors.segment]: (d: any) => {
                                        const item: PieChart = 'data' in d ? d.data : d;
                                        return `
                                            <div class='bg-white text-xs p-2 rounded-full flex flex-row justify-between gap-3'>
                                                <div class='flex flex-row justify-center items-center gap-1'>
                                                    <div class='w-3 h-3 rounded' style='background-color: ${item.fill}'></div>
                                                    <div class='font-medium'>${pieConfig[item.category]?.label}</div>
                                                </div>
                                                <div class='text-muted-foreground'>${item.tickets} tickets</div>
                                            </div>`;
                                    }
                                }"
                            />
                        </VisSingleContainer>
                    </ChartContainer>
                </CardContent>
                <CardFooter class="flex-col gap-2 text-sm">
                    <div class="flex items-center gap-2 font-medium leading-none">
                        Ticket volume increased by 5.2% this month <TrendingUp class="h-4 w-4 text-green-500" />
                    </div>
                    <div class="leading-none text-muted-foreground">
                        Showing total number of tickets for the last 3 months. 
                    </div>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ticket Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer :config="barConfig">
                        <VisXYContainer
                            :data="bar"
                            :margin="{ left: -24 }"
                            :y-domain="[0, undefined]"
                        >
                            <VisGroupedBar
                                :x="(d: BarData) => d.date"
                                :y="[(d: BarData) => d.ait, (d: BarData) => d.development]"
                                :color="[barConfig.ait.color, barConfig.development.color]"
                                :rounded-corners="10"
                            />
                            <VisAxis
                                type="x"
                                :x="(d: BarData) => d.date"
                                :tick-line="false"
                                :domain-line="false"
                                :grid-line="false"
                                :num-ticks="6"
                                :tick-format="(d: number) => {
                                const date = new Date(d)
                                return date.toLocaleDateString('en-US', {
                                    month: 'short',
                                })
                                }"
                                :tick-values="bar.map(d => d.date)"
                            />
                            <VisAxis
                                type="y"
                                :num-ticks="3"
                                :tick-line="false"
                                :domain-line="false"
                            />
                            <ChartTooltip />
                            <ChartCrosshair
                                :template="componentToString(barConfig, ChartTooltipContent, {  indicator: 'dashed', hideLabel: true })"
                                color="#0000"
                            />
                        </VisXYContainer>
                    </ChartContainer>
                </CardContent>
                <CardFooter class="flex-col gap-2 text-sm">
                    <div class="flex items-center gap-2 font-medium leading-none">
                        AIT department handled 1.2% fewer tickets this month <TrendingDown class="h-4 w-4 text-destructive" />
                    </div>
                    <div class="leading-none text-muted-foreground">
                        Showing departments tickets comparison for the last 3 months. 
                    </div>
                </CardFooter>
            </Card>
        </div>  
    </div>
</template>
