import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';

import { DataAction } from '@/modules/departments/components';
import type { Department } from '@/modules/departments/types';

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Name'),
    cell: ({ row }) => row.getValue('name'),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column, '^data-action': true }, () => 'Actions'),
    cell: ({ row }) => h(DataAction, { department: row.original }),
    enableSorting: false,
  },
];
