import type { ColumnDef } from '@tanstack/vue-table';
import { UserIcon } from 'lucide-vue-next';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';

import { DataAction, StatusBadge } from '@/modules/users/components';
import type { User, UserStatus } from '@/modules/users/types';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'profile',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Profile Picture'),
    cell: ({ row }) => {
      const profile = row.original.profile || UserIcon;
      return h(
        'div',
        { class: 'flex items-center justify-center size-8 rounded-full bg-secondary' },
        h(profile, { class: 'size-5 text-primary' })
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Full Name'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('name')),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Email Address'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('email')),
    enableSorting: false,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Department'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('department')),
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Role'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('role')),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Status'),
    cell: ({ row }) => {
      const status = row.getValue<UserStatus>('status');
      return h(StatusBadge, { status });
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-start' }, [
        h(DataAction, { link: `/su/users/view`, user: row.original }),
      ]),
    enableSorting: false,
  },
];
