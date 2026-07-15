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

import type { Meta } from '@/modules/types';
import { columns, type User } from '@/modules/users';
import { usersApi } from '@/modules/users/services';

const users = ref<User[]>([]);
const meta = ref<Meta | null>(null);
const fetchError = ref('');

const fetchUsers = async (page = 1) => {
  fetchError.value = '';
  try {
    const response = await usersApi.getAll(page);
    users.value = response.data;
    meta.value = response.meta;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    users.value = [];
  }
};

onMounted(fetchUsers);

const table = useVueTable({
  get columns() {
    return columns;
  },
  get data() {
    return users;
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
      <Search :table column="name" model="users" />
      <DataTable :table />
      <Pagination :table :meta @change="fetchUsers" />
    </main>
  </template>
</template>
