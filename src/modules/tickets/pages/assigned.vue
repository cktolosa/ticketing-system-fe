<script setup lang="ts">
import { columns } from '@/components/tickets/columns';
import type { Ticket } from '@/components/tickets/columns';
import DataTable from '@/components/tickets/data-table.vue';

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
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'new',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-03'),
    title: 'Slow computer performance',
    department: 'AIT',
    admin: 'Juan Dela Cruz',
    status: 'in progress',
    priority: 'medium',
  },
  {
    date: new Date('2025-12-04'),
    title: 'Laptop not responding',
    department: 'AIT',
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
</script>

<template>
  <div class="w-full p-5">
    <h1 class="text-lg font-bold md:text-xl">Assigned Tickets</h1>
    <DataTable :columns="columns" :data="tickets" />
  </div>
</template>
