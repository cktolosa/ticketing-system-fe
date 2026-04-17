import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';

import { DataAction } from '@/modules/companies/components';
import type { Company } from '@/modules/companies/types';

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Name'),
    cell: ({ row }) => row.getValue('name'),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column, '^data-action': true }, () => 'Actions'),
    cell: ({ row }) => h(DataAction, { company: row.original }),
    enableSorting: false,
  },
];
