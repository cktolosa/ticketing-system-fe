<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';

import { DataTable, Pagination, Search } from '@/components/data-table';

import { columns } from '@/modules/tickets/columns';
import type { Ticket } from '@/modules/tickets/types';

const tickets: Ticket[] = [
  {
    date: new Date('2025-12-02'),
    title: 'Password resets and account lockouts',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'in progress',
    priority: 'low',
  },
  {
    date: new Date('2025-12-03'),
    title: 'Email not sending or receiving',
    department: 'Team Banana',
    admin: 'John Doe',
    status: 'new',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-03'),
    title: 'Slow computer performance',
    department: 'HRAD',
    admin: 'Jane Smith',
    status: 'in progress',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-04'),
    title: 'Laptop not responding',
    department: 'Team Equinox',
    admin: 'Juan Dela Cruz',
    status: 'resolved',
    priority: 'low',
  },
  {
    date: new Date('2025-12-04'),
    title: 'Software installation request',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'closed',
    priority: 'low',
  },
  {
    date: new Date('2025-12-05'),
    title: 'Unable to connect to Wi-Fi network',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'in progress',
    priority: 'high',
  },
  {
    date: new Date('2025-12-05'),
    title: 'VPN connection failure',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'new',
    priority: 'high',
  },
  {
    date: new Date('2025-12-06'),
    title: 'System crashes on startup',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'in progress',
    priority: 'high',
  },
  {
    date: new Date('2025-12-06'),
    title: 'Access permission denied to shared folder',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'resolved',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-07'),
    title: 'Antivirus alert detected',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'in progress',
    priority: 'high',
  },
  {
    date: new Date('2025-12-07'),
    title: 'Monitor display not working',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'resolved',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-08'),
    title: 'File recovery request',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'new',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-08'),
    title: 'New user account setup',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'closed',
    priority: 'low',
  },
  {
    date: new Date('2025-12-09'),
    title: 'Application not responding',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'in progress',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-09'),
    title: 'Keyboard not functioning properly',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'resolved',
    priority: 'low',
  },
];

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
  <main class="flex flex-col gap-y-4 p-4">
    <Search :table column="title" model="tickets" />
    <DataTable :table />
    <Pagination :table />
  </main>
</template>
