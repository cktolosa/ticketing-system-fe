<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { onMounted, ref } from 'vue';

import { DataTable, Pagination, Search } from '@/components/data-table';

import { getErrorMessage } from '@/lib/utils';

import { columns, type Ticket } from '@/modules/tickets';
import { ticketsApi } from '@/modules/tickets/services';
import type { Meta } from '@/modules/types';

const tickets = ref<Ticket[]>([]);
const meta = ref<Meta | null>(null);
const fetchError = ref('');

const fetchTickets = async (page = 1) => {
  fetchError.value = '';
  try {
    const response = await ticketsApi.getAll(page);
    tickets.value = response.data;
    meta.value = response.meta;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    tickets.value = [];
  }
};

onMounted(fetchTickets);

const table = useVueTable({
  // what we only need for displaying
  get columns() {
    return columns;
  },
  get data() {
    return tickets;
  },
  getCoreRowModel: getCoreRowModel(),

  // for pagination to work
  getPaginationRowModel: getPaginationRowModel(),

  // for filtering to work
  getFilteredRowModel: getFilteredRowModel(),

  // for sorting to work
  getSortedRowModel: getSortedRowModel(),
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
      <Search :table column="title" model="tickets" />
      <DataTable :table />
      <Pagination :table :meta @change="fetchTickets" />
    </main>
  </template>
</template>
