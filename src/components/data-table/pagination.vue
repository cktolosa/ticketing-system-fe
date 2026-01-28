<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';

import { Button } from '@/components/ui/button';

const props = defineProps<{
  table: Table<T>;
}>();

const range = computed(() => {
  const { pageIndex, pageSize } = props.table.getState().pagination;

  const totalRows = props.table.getFilteredRowModel().rows.length;

  return {
    start: pageIndex * pageSize + 1,
    end: Math.min((pageIndex + 1) * pageSize, totalRows),
    totalRows,
  };
});
</script>

<template>
  <section class="flex items-center justify-between">
    <span class="text-muted-foreground text-sm">
      Showing {{ range.start }} - {{ range.end }} of {{ range.totalRows }} row(s)
    </span>
    <div class="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage"
      >
        Next
      </Button>
    </div>
  </section>
</template>
