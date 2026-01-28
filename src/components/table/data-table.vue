<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table';
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { valueUpdater } from '@/components/ui/table/utils';

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterColumn: string;
    filterPlaceholder?: string;
    enableSorting?: boolean;
  }>(),
  {
    enableSorting: false,
  }
);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
  },
});
</script>

<template>
  <div>
    <div class="flex items-center py-4">
      <Input
        class="max-w-full"
        :placeholder="filterPlaceholder"
        :model-value="table.getColumn(filterColumn)?.getFilterValue() as string"
        @update:model-value="table.getColumn(filterColumn)?.setFilterValue($event)"
      />
    </div>

    <div class="block space-y-3 lg:hidden">
      <template v-if="table.getRowModel().rows?.length">
        <Card v-for="row in table.getRowModel().rows" :key="row.id" class="p-5 text-sm">
          <CardContent class="grid grid-cols-2 *:border-b *:p-3">
            <template v-for="cell in row.getVisibleCells()" :key="cell.id">
              <div class="text-muted-foreground capitalize">
                {{
                  typeof cell.column.columnDef.header === 'string'
                    ? cell.column.columnDef.header
                    : cell.column.id
                }}
              </div>
              <div>
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </div>
            </template>
          </CardContent>
        </Card>
      </template>
      <Card v-else>
        <CardContent class="py-8 text-center"> No results. </CardContent>
      </Card>
    </div>

    <div class="hidden w-full overflow-auto rounded-md border px-2 lg:block">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="py-1 first:ps-1 last:pe-1"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div class="flex flex-col items-center justify-between gap-3 p-4 sm:flex-row">
      <div class="text-muted-foreground text-sm">
        Displaying total of
        {{ table.getFilteredRowModel().rows.length }} row(s).
      </div>
      <div class="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
