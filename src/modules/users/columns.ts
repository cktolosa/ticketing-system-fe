import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';
import { UserAvatar } from '@/components/user-avatar';

import { DataAction, StatusBadge } from '@/modules/users/components';
import type { User, UserStatus } from '@/modules/users';
import type { Role } from '@/stores/roles';

import type { Company } from '@/modules/companies';
import type { Department } from '@/modules/departments';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Full Name'),
    cell: ({ row }) =>
      h(UserAvatar, { name: row.getValue('name'), src: row.original.avatar?.urls?.full }),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Email Address'),
    cell: ({ row }) => row.getValue('email'),
    enableSorting: false,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Company'),
    cell: ({ row }) => row.getValue<Company>('company')?.name,
    enableSorting: true,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Department'),
    cell: ({ row }) => row.getValue<Department>('department')?.name,
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Role'),
    cell: ({ row }) => h('span', { class: 'capitalize' }, row.getValue<Role>('role')?.name),
    enableSorting: true,
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
    cell: ({ row }) => h(DataAction, { user: row.original }),
    enableSorting: false,
  },
];
