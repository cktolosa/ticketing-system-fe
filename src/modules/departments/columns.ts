import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';

import { DataAction } from '@/modules/departments/components';
import type { Department } from '@/modules/departments/types';

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Name'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('name')),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-start' }, [h(DataAction, { department: row.original })]),
    enableSorting: false,
  },
];
