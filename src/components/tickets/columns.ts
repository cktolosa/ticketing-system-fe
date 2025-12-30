import { h, type Component } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

import { cn } from '@/lib/utils';

import DropdownAction from "@/components/tickets/data-action.vue";
import ColumnHeader from "@/components/table/column-header.vue";
import { Badge } from "@/components/ui/badge";

import { ArrowDown, ArrowRight, ArrowUp } from "lucide-vue-next";

const statusOrder = {
  new: 1,
  "in progress": 2,
  resolved: 3,
  closed: 4,
} as const;

const priorityOrder = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

export type Status = keyof typeof statusOrder;
export type Priority = keyof typeof priorityOrder;

export interface Ticket {
  date: Date;
  title: string;
  department: string;
  admin: string;
  status: Status;
  priority: Priority;
}

const statusStyles: Record<Status, string> = {
  new: "bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-400",
  "in progress": "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-400",
  resolved: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-400",
  closed: "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-400",
};

type PriorityConfig = {
  class: string;
  icon: Component;
};

const priorityConfig: Record<Priority, PriorityConfig> = {
  low: {
    class: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-300",
    icon: ArrowDown,
  },
  medium: {
    class: "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-400",
    icon: ArrowRight,
  },
  high: {
    class: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-400",
    icon: ArrowUp,
  },
};

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => h(ColumnHeader, { column }, "Date"),
    cell: ({ row }) => {
      const date = row.getValue<Date>("date");
      return h(
        "div",
        { class: "text-left tabular-nums" },
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => h(ColumnHeader, { column }, "Title"),
    cell: ({ row }) => h("div", { class: "text-left" }, row.getValue("title")),
    enableSorting: false,
  },
  {
    accessorKey: "department",
    header: ({ column }) => h(ColumnHeader, { column }, "Department"),
    cell: ({ row }) =>
      h("div", { class: "text-left" }, row.getValue("department")),
    enableSorting: false,
  },
  {
    accessorKey: "admin",
    header: ({ column }) => h(ColumnHeader, { column }, "Admin"),
    cell: ({ row }) => h("div", { class: "text-left" }, row.getValue("admin")),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => h(ColumnHeader, { column }, "Status"),
    cell: ({ row }) => {
      const status = row.getValue<Status>("status");
      return h(
        Badge,
        { class: `capitalize ${statusStyles[status]}` },
        () => status,
      );
    },
    sortingFn: (a, b) =>
      statusOrder[a.original.status] - statusOrder[b.original.status],
  },
  {
    accessorKey: "priority",
    header: ({ column }) => h(ColumnHeader, { column }, "Priority"),
    cell: ({ row }) => {
      const priority = row.getValue<Priority>("priority");
      const config = priorityConfig[priority];

      return h(
        Badge,
        { class: `capitalize inline-flex items-center gap-1 ${config.class}` },
        () => [h(config.icon, { class: "size-3" }), priority],
      );
    },
    sortingFn: (a, b) =>
      priorityOrder[a.original.priority] - priorityOrder[b.original.priority],
  },
  {
    id: "actions",
    header: ({ column }) => h(ColumnHeader, { column }, "Actions"),
    cell: ({ row }) => h(DropdownAction, { ticket: row.original }),
    enableSorting: false,
  },
];
