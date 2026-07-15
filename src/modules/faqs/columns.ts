import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import { ColumnHeader } from '@/components/data-table';
import { UserAvatar } from '@/components/user-avatar';

import { formatDate } from '@/lib/utils';

import type { Faq } from '@/modules/faqs';
import { DataAction } from '@/modules/faqs/components';
import type { User } from '@/modules/users';

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
    cell: ({ row }) => {
      const author = row.getValue<User>('author');
      return h(UserAvatar, {
        name: author?.name ?? '',
        src: author?.avatar?.urls?.full,
      });
    },
    enableSorting: true,
  },

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
    cell: ({ row }) => h(DataAction, { faq: row.original }),
    enableSorting: false,
  },
];
