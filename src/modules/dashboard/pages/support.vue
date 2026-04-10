<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SUPPORT_METRIC_META } from '@/constants/metrics';
import { CardOverview, CardRecent, Header } from '@/modules/dashboard/components';

const items = {
  cards: [
    { key: 'new_tickets', value: 2 },
    { key: 'in_progress_tickets', value: 10 },
    { key: 'overdue_tickets', value: 6 },
    { key: 'faq_views', value: 32 },
  ],
};

const tickets = [];

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
    <CardOverview :data="items.cards" :meta="SUPPORT_METRIC_META" :loading="isLoading" />
    <CardRecent :tickets="tickets" view-url="/sample" :loading="isLoading" />
  </div>
</template>
