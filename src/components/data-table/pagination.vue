<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';

import { Button } from '@/components/ui/button';

import type { Meta } from '@/modules/types';

const props = defineProps<{
  table: Table<T>;
  meta?: Meta | null;
}>();

const emit = defineEmits<{
  change: [page: number];
}>();

const range = computed(() => {
  if (props.meta) {
    return {
      start: props.meta.from,
      end: props.meta.to,
      totalRows: props.meta.total,
    };
  }

  const { pageIndex, pageSize } = props.table.getState().pagination;

  const totalRows = props.table.getFilteredRowModel().rows.length;

  return {
    start: pageIndex * pageSize + 1,
    end: Math.min((pageIndex + 1) * pageSize, totalRows),
    totalRows,
  };
});

const canPrev = computed(() =>
  props.meta ? props.meta?.current_page > 1 : props.table.getCanPreviousPage()
);
const handlePrev = () => {
  if (props.meta) {
    emit('change', props.meta.current_page - 1);
  } else {
    props.table.previousPage();
  }
};

const canNext = computed(() =>
  props.meta ? props.meta?.current_page < props.meta?.last_page : props.table.getCanNextPage()
);
const handleNext = () => {
  if (props.meta) {
    emit('change', props.meta.current_page + 1);
  } else {
    props.table.nextPage();
  }
};
</script>

<template>
  <section class="flex items-center justify-between">
    <span class="text-muted-foreground text-sm">
      Showing {{ range.start }} - {{ range.end }} of {{ range.totalRows }} row(s)
    </span>
    <div class="flex items-center gap-x-2">
      <Button variant="outline" size="sm" :disabled="!canPrev" @click="handlePrev">
        Previous
      </Button>
      <Button variant="outline" size="sm" :disabled="!canNext" @click="handleNext"> Next </Button>
    </div>
  </section>
</template>
