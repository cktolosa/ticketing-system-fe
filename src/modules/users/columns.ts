import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';
import { UserAvatar } from '@/components/user-avatar';

import { DataAction, StatusBadge } from '@/modules/users/components';
import type { User, UserStatus } from '@/modules/users/types';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Full Name'),
    cell: ({ row }) => h(UserAvatar, { name: row.getValue('name') }),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Email Address'),
    cell: ({ row }) => row.getValue('email'),
    enableSorting: false,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Department'),
    cell: ({ row }) => row.getValue('department'),
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Role'),
    cell: ({ row }) => row.getValue('role'),
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
    header: ({ column }) => h(ColumnHeader, { column, '^data-action': true }, () => 'Actions'),
    cell: ({ row }) => h(DataAction, { link: `/su/users/view`, user: row.original }),
    enableSorting: false,
  },
];
