import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';

import type { Department } from '@/modules/departments';
import { DataAction } from '@/modules/departments/components';

export const columns = (companyId: string): ColumnDef<Department>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Name'),
    cell: ({ row }) => row.getValue('name'),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column, '^data-action': true }, () => 'Actions'),
    cell: ({ row }) => h(DataAction, { department: row.original, companyId: companyId }),
    enableSorting: false,
  },
];
