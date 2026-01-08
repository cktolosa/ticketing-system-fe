import { h} from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

import DropdownAction from "@/components/tickets/data-action.vue";
import ColumnHeader from "@/components/table/column-header.vue";
import StatusBadge from "@/components/tickets/status.vue";
import PriorityBadge from "@/components/tickets/priority.vue";

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
      return h(StatusBadge, {status});
    },
    sortingFn: (a, b) =>
      statusOrder[a.original.status] - statusOrder[b.original.status],
  },
  {
    accessorKey: "priority",
    header: ({ column }) => h(ColumnHeader, { column }, "Priority"),
    cell: ({ row }) => {
      const priority = row.getValue<Priority>("priority");
      return h(PriorityBadge, {priority});
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
