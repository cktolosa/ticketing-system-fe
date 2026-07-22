import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';
// missing admin object
import { UserAvatar } from '@/components/user-avatar';

import { formatDate } from '@/lib/utils';

import type { Department } from '@/modules/departments';
import { DataAction, PriorityBadge, StatusBadge } from '@/modules/tickets/components';
import { type Priority, type Status, type Ticket } from '@/modules/tickets/types';

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Title'),
    cell: ({ row }) => row.getValue('title'),
    enableSorting: false,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Priority'),
    cell: ({ row }) => {
      const priority = row.getValue<Priority>('priority');
      return h(PriorityBadge, { priority });
    },
    sortingFn: (a, b) => a.original.priority.id - b.original.priority.id,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Status'),
    cell: ({ row }) => {
      const status = row.getValue<Status>('status');
      return h(StatusBadge, { status });
    },
    sortingFn: (a, b) => a.original.status.id - b.original.status.id,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Department'),
    cell: ({ row }) => row.getValue<Department>('department')?.name,
    enableSorting: false,
  },
  // missing admin object
  // {
  //   accessorKey: 'admin',
  //   header: ({ column }) => h(ColumnHeader, { column }, () => 'Admin'),
  //   cell: ({ row }) => h(UserAvatar, { name: row.getValue('admin') }),
  //   enableSorting: false,
  // },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Updated At'),
    cell: ({ row }) => {
      const rawDate = row.getValue<string>('updated_at');
      const date = rawDate ? new Date(rawDate) : null;
      return h(
        'div',
        { class: 'text-left tabular-nums' },
        formatDate(date, { month: 'short', hour: undefined, minute: undefined, hour12: undefined })
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column, '^data-action': true }, () => 'Actions'),
    cell: ({ row }) => h(DataAction, { link: `/su/tickets/view`, ticket: row.original }),
    enableSorting: false,
  },
];
