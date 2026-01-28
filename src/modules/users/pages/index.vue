<script setup lang="ts">
import DataTable from '@/components/table/data-table.vue';

import { columns } from '../columns';
import type { User } from '../types';

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
</script>

<template>
  <div class="w-full p-5">
    <h1 class="text-lg font-bold md:text-xl">All Users</h1>
    <DataTable
      :columns="columns"
      :data="users"
      filter-column="name"
      filter-placeholder="Filter user name"
      enable-sorting
    />
  </div>
</template>
