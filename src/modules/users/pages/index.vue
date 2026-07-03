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

import { columns, type User } from '@/modules/users';
import { usersApi } from '@/modules/users/services';

const users = ref<User[]>([]);
const fetchError = ref('');

const fetchUsers = async () => {
  fetchError.value = '';
  try {
    const response = await usersApi.getAll();
    users.value = response;
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
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
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
      <Search :table column="name" model="users" />
      <DataTable :table />
      <Pagination :table />
    </main>
  </template>
</template>
