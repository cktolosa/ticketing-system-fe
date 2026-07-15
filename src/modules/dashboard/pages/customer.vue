<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getErrorMessage } from '@/lib/utils';

import { USER_METRIC_META } from '@/constants/metrics';
import { CardOverview, CardRecent, Header } from '@/modules/dashboard/components';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const fetchError = ref('');
const items = ref('');
const isLoading = ref(true);
const auth = useAuthStore();

const fetchDashboard = async () => {
  isLoading.value = true;
  fetchError.value = '';
  try {
    const response = await api.get('/dashboard/customer');
    items.value = response.data;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 md:px-6">
    <Header :role="auth.user?.role?.name" :loading="isLoading" download-url="/sample" />
    <template v-if="fetchError">
      <p class="text-destructive text-center text-sm">
        {{ fetchError }}
      </p>
    </template>
    <template v-else>
      <CardOverview :data="items.cards" :meta="USER_METRIC_META" :loading="isLoading" />
      <CardRecent :tickets="items.recent_tickets" view-url="/sample" :loading="isLoading" />
    </template>
  </div>
</template>
