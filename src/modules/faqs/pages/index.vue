<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';

import { DataTable, Pagination, Search } from '@/components/data-table';

import { columns } from '@/modules/faqs/columns';
import type { Faq } from '@/modules/faqs/types';

const faqs: Faq[] = [
  {
    updated_at: new Date('2025-12-02'),
    author: 'Juan Dela Cruz',
    title: 'How to Maximize SIL',
  },
  {
    updated_at: new Date('2025-12-03'),
    author: 'Carlos Mendoza',
    title: 'AIT Audit Monthly Schedule Process',
  },
  {
    updated_at: new Date('2025-12-04'),
    author: 'Ana Marie Garcia',
    title: 'Basic Troubleshooting',
  },
];

const table = useVueTable({
  get columns() {
    return columns;
  },
  get data() {
    return faqs;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
});
</script>

<template>
  <main class="flex flex-col gap-y-4 p-4">
    <Search :table column="title" model="faqs" />
    <DataTable :table />
    <Pagination :table />
  </main>
</template>
