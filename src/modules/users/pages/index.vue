<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';

import { DataTable, Pagination, Search } from '@/components/data-table';

import { columns } from '@/modules/users/columns';
import type { User } from '@/modules/users/types';

const users: User[] = [
  {
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    department: 'AIT',
    role: 'Admin',
    status: 'active',
  },
  {
    name: 'Carlos Mendoza',
    email: 'carlos@email.com',
    department: 'Team Banana',
    role: 'User',
    status: 'active',
  },
  {
    name: 'Ana Marie Garcia',
    email: 'ana@email.com',
    department: 'AIT',
    role: 'Support',
    status: 'inactive',
  },
];

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
  <main class="flex flex-col gap-y-4 p-4">
    <Search :table column="name" model="users" />
    <DataTable :table />
    <Pagination :table />
  </main>
</template>
