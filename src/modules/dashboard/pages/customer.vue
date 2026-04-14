<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { USER_METRIC_META } from '@/constants/metrics';
import { CardOverview, CardRecent, Header } from '@/modules/dashboard/components';

const items = {
  cards: [
    { key: 'new_tickets', value: 2 },
    { key: 'in_progress_tickets', value: 10 },
    { key: 'resolved_tickets', value: 6 },
    { key: 'closed_tickets', value: 32 },
  ],
};

const tickets = [
  {
    title: 'Password reset not sending email',
    status: 'new',
    priority: 'high',
    date: '2026-04-13T13:40:00',
  },
  {
    title: 'VPN connection keeps dropping',
    status: 'in progress',
    priority: 'high',
    date: '2026-04-13T08:00:00',
  },
  {
    title: 'Laptop not detecting external monitor',
    status: 'new',
    priority: 'medium',
    date: '2026-04-12T10:00:00',
  },
  {
    title: 'Unable to access company VPN after update',
    status: 'in progress',
    priority: 'high',
    date: '2026-04-10T10:00:00',
  },
  {
    title: 'Windows update causing slow boot time',
    status: 'new',
    priority: 'medium',
    date: '2026-03-30T10:00:00',
  },
];

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 md:px-6">
    <Header role="support" :loading="isLoading" download-url="/sample" />
    <CardOverview :data="items.cards" :meta="USER_METRIC_META" :loading="isLoading" />
    <CardRecent :tickets="tickets" view-url="/sample" :loading="isLoading" />
  </div>
</template>
