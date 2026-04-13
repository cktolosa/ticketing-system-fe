<script setup lang="ts">
import { Eye } from 'lucide-vue-next';
import { useTimeAgo } from '@vueuse/core';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { PriorityBadge, StatusBadge } from '@/modules/tickets/components';
import type { Ticket } from '@/modules/tickets/types';

defineProps<{
  tickets: Ticket[];
  viewUrl: string;
  loading?: boolean;
}>();

const timeAgo = (date: string) => useTimeAgo(new Date(date)).value;

</script>

<template>
  <div class="mt-5 space-y-2">
    <div class="flex flex-row items-center justify-between">
      <h3 class="text-base font-medium md:text-xl">Recent Tickets</h3>
      <Button
        variant="ghost"
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        :href="loading ? undefined : viewUrl"
        :class="loading ? 'pointer-events-none opacity-50' : ''"
      >
        <Eye />
        View All
      </Button>
    </div>
    <Card>
      <template v-if="loading">
        <CardContent v-for="i in tickets.length || 5" :key="i">
          <div class="flex justify-between">
            <div class="flex items-center gap-2">
              <Skeleton class="h-4 w-40" />
              <Skeleton class="h-5 w-16" />
              <Skeleton class="h-5 w-16" />
            </div>
            <Skeleton class="h-4 w-20" />
          </div>
          <Separator v-if="i < (tickets.length || 5)" class="my-2" />
        </CardContent>
      </template>

      <template v-else-if="!tickets.length">
        <CardContent class="p-3 text-center text-sm">
          <p>No tickets found.</p>
        </CardContent>
      </template>

      <template v-else>
        <CardContent v-for="(ticket, index) in tickets" :key="ticket.title">
          <a href="#" class="flex flex-col justify-between md:flex-row">
            <div class="flex flex-col-reverse gap-2 md:flex-row md:items-center">
              <p>{{ ticket.title }}</p>
              <div class="flex items-center gap-2">
                <StatusBadge :status="ticket.status" />
                <PriorityBadge :priority="ticket.priority" />
              </div>
            </div>
            <p class="text-muted-foreground text-sm">{{ timeAgo(ticket.date) }}</p>
          </a>
          <Separator v-if="index < tickets.length - 1" class="my-2" />
        </CardContent>
      </template>
    </Card>
  </div>
</template>
