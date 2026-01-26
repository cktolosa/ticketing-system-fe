import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import ColumnHeader from '@/components/table/column-header.vue';

import { formatDate } from '@/lib/utils';

import { DataAction, PriorityBadge, StatusBadge } from '@/modules/tickets/components';
import {
  type Priority,
  priorityOrder,
  type Status,
  statusOrder,
  type Ticket,
} from '@/modules/tickets/types';

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => h(ColumnHeader, { column }, 'Date'),
    cell: ({ row }) => {
      const date = row.getValue<Date>('date');
      return h(
        'div',
        { class: 'text-left tabular-nums' },
        formatDate(new Date(date), {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => h(ColumnHeader, { column }, 'Title'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('title')),
    enableSorting: false,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => h(ColumnHeader, { column }, 'Department'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('department')),
    enableSorting: false,
  },
  {
    accessorKey: 'admin',
    header: ({ column }) => h(ColumnHeader, { column }, 'Admin'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('admin')),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(ColumnHeader, { column }, 'Status'),
    cell: ({ row }) => {
      const status = row.getValue<Status>('status');
      return h(StatusBadge, { status });
    },
    sortingFn: (a, b) => statusOrder[a.original.status] - statusOrder[b.original.status],
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => h(ColumnHeader, { column }, 'Priority'),
    cell: ({ row }) => {
      const priority = row.getValue<Priority>('priority');
      return h(PriorityBadge, { priority });
    },
    sortingFn: (a, b) => priorityOrder[a.original.priority] - priorityOrder[b.original.priority],
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column }, 'Actions'),
    cell: ({ row }) => h(DataAction, { ticket: row.original }),
    enableSorting: false,
  },
];
