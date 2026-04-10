<script setup lang="ts">
import { ref, watch } from 'vue';

import { SU_METRIC_META } from '@/constants/metrics';
import { BarChart, CardOverview, Header, PieChart } from '@/modules/dashboard/components';

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

const items = {
  cards: [
    { key: 'resolution_rate', value: 2, percentage: 0.1245 },
    { key: 'priority_resolution', value: 10, percentage: 0.12 },
    { key: 'user_activity', value: 6, percentage: -0.15 },
    { key: 'faq_views', value: 342, percentage: 0.22 },
  ],
  pie: {
    categories: [
      { category: 'new', count: 10 },
      { category: 'in_progress', count: 20 },
      { category: 'resolved', count: 30 },
      { category: 'closed', count: 40 },
    ],
    total: 100,
    percentage: -0.012,
  },
  bar: {
    categories: [
      { label: 'AIT', new: 50, closed: 186 },
      { label: 'QA', new: 30, closed: 120 },
      { label: 'Development', new: 40, closed: 100 },
      { label: 'Crowdworks', new: 10, closed: 25 },
    ],
    percentage: 0.1625,
  },
};
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 md:px-6">
    <Header
      v-model:selected-month="selectedMonth"
      download-url="/sample"
      role="superuser"
      :loading="isLoading"
    />
    <CardOverview :data="items.cards" :meta="SU_METRIC_META" :loading="isLoading" />

    <div class="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
      <PieChart :data="items.pie" :loading="isLoading" />
      <BarChart :data="items.bar" :loading="isLoading" />
    </div>
  </div>
</template>
