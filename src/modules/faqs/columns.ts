import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';
import { UserAvatar } from '@/components/user-avatar';

import { formatDate } from '@/lib/utils';

import { DataAction } from '@/modules/faqs';
import type { Faq } from '@/modules/faqs/types';

import type { User } from '../users/types';

export const columns: ColumnDef<Faq>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Title'),
    cell: ({ row }) => row.getValue('title'),
    enableSorting: true,
  },
  {
    accessorKey: 'author',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Author'),
    cell: ({ row }) => h(UserAvatar, { name: row.getValue<User>('author')?.name }),
    enableSorting: true,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => h(ColumnHeader, { column }, () => 'Updated At'),
    cell: ({ row }) => {
      const date = row.getValue<Date>('updated_at');
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
    cell: ({ row }) => h(DataAction, { faq: row.original }),
    enableSorting: false,
  },
];
