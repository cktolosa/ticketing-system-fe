<script setup lang="ts">
import { ref, watch } from 'vue';

import { ADMIN_METRIC_META } from '@/constants/metrics';
import { BarChart, CardOverview, Header, PieChart } from '@/modules/dashboard/components';

const items = {
  cards: [
    { key: 'new_tickets', value: 2, percentage: 0.1245 },
    { key: 'resolved_tickets', value: 10, percentage: 0.12 },
    { key: 'overdue_tickets', value: 6, percentage: -0.15 },
    { key: 'faq_views', value: 32, percentage: 0.12 },
  ],
  pie: {
    categories: [
      { category: 'new', count: 2 },
      { category: 'in_progress', count: 5 },
      { category: 'resolved', count: 5 },
      { category: 'closed', count: 5 },
    ],
    total: 17,
    percentage: 0.052,
  },
  bar: {
    categories: [{ label: 'AIT', new: 33, closed: 30 }],
    percentage: -0.052,
  },
};
const selectedMonth = ref('');
const isLoading = ref(false);

watch(selectedMonth, async () => {
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
    <Header
      v-model:selected-month="selectedMonth"
      download-url="/sample"
      role="admin"
      :loading="isLoading"
    />
    <CardOverview :data="items.cards" :meta="ADMIN_METRIC_META" :loading="isLoading" />
    <div class="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
      <PieChart :data="items.pie" :loading="isLoading" />
      <BarChart :data="items.bar" :loading="isLoading" />
    </div>
  </div>
</template>
