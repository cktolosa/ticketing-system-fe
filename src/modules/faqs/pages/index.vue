<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { onMounted, ref } from 'vue';

import { DataTable, Pagination, Search } from '@/components/data-table';

import { getErrorMessage } from '@/lib/utils';

import { columns } from '@/modules/faqs/columns';
import type { Meta } from '@/modules/types';
import { useAuthStore } from '@/stores/auth';

import { faqsApi } from '..';
import type { Faq } from '../types';

const faqs = ref<Faq[]>([]);
const meta = ref<Meta | null>(null);
const fetchError = ref('');
const auth = useAuthStore();

const fetchFaqs = async (page = 1) => {
  fetchError.value = '';
  try {
    const hasAccessToAll = ['superadmin', 'customer'].includes(auth.user?.role ?? '');
    const response = hasAccessToAll ? await faqsApi.getAll(page) : await faqsApi.getByUser(page);

    faqs.value = response.data;
    meta.value = response.meta;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    faqs.value = [];
  }
};

onMounted(fetchFaqs);

const table = useVueTable({
  get columns() {
    return columns;
  },
  get data() {
    return faqs;
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  manualPagination: true,
});
</script>

<template>
  <template v-if="fetchError">
    <p class="text-destructive py-5 text-center text-sm">
      {{ fetchError }}
    </p>
  </template>
  <template v-else>
    <main class="flex flex-col gap-y-4 p-4">
      <Search :table column="title" model="faqs" />
      <DataTable :table />
      <Pagination :table :meta @change="fetchFaqs" />
    </main>
  </template>
</template>
