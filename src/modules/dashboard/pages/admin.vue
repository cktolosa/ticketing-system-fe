<script setup lang="ts">
import { ref, watch } from 'vue';

import { getErrorMessage } from '@/lib/utils';

import { ADMIN_METRIC_META } from '@/constants/metrics';
import { BarChart, CardOverview, Header, PieChart } from '@/modules/dashboard/components';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const selectedMonth = ref('');
const fetchError = ref('');
const items = ref({});
const isLoading = ref(true);
const auth = useAuthStore();

const fetchDashboard = async () => {
  isLoading.value = true;
  fetchError.value = '';
  try {
    const response = await api.get('/dashboard/admin', {
      params: { month: selectedMonth.value || undefined },
    });
    items.value = response.data;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedMonth, fetchDashboard, { immediate: true });
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 md:px-6">
    <Header
      v-model:selected-month="selectedMonth"
      download-url="/sample"
      :role="auth.user?.role?.name"
      :loading="isLoading"
    />

    <template v-if="fetchError">
      <p class="text-destructive text-center text-sm">
        {{ fetchError }}
      </p>
    </template>

    <template v-else>
      <CardOverview :data="items.cards" :meta="ADMIN_METRIC_META" :loading="isLoading" />
      <div class="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
        <PieChart :data="items.pie" :loading="isLoading" />
        <!-- to check: must display department where the admin belongs -->
        <BarChart :data="items.bar" :loading="isLoading" />
      </div>
    </template>
  </div>
</template>
