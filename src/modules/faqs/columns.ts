import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';
import { UserAvatar } from '@/components/user-avatar';

import { formatDate } from '@/lib/utils';

import { DataAction } from '@/modules/faqs/components';
import type { Faq } from '@/modules/faqs/types';

export const columns: ColumnDef<Faq>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Title'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('title')),
    enableSorting: true,
  },
  {
    accessorKey: 'author',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Author'),
    cell: ({ row }) => h(UserAvatar, { name: row.getValue('author') }),
    enableSorting: true,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Updated At'),
    cell: ({ row }) => {
      const date = row.getValue<Date>('updated_at');
      return h('div', { class: 'text-left tabular-nums' }, formatDate(date));
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => h(ColumnHeader, { column, '^data-action': true }, () => 'Actions'),
    cell: ({ row }) => h(DataAction, { faq: row.original }),
    enableSorting: false,
  },
];
