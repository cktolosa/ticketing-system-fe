<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table';
import { SearchIcon, XIcon } from 'lucide-vue-next';
import { computed } from 'vue';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

const props = defineProps<{
  table: Table<T>;
  column: keyof T;
  model?: string;
}>();

const search = computed({
  get: () => props.table.getColumn(props.column.toString())?.getFilterValue() as string,
  set: (value: string) => props.table.getColumn(props.column.toString())?.setFilterValue(value),
});

const placeholder = props.model
  ? `Search ${props.model} by ${props.column.toString()}...`
  : `Search by ${props.column.toString()}...`;
</script>

<template>
  <InputGroup>
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>

    <InputGroupInput v-model="search" type="search" :placeholder />

    <InputGroupAddon align="inline-end">
      <InputGroupButton size="icon-xs" @click="search = ''">
        <XIcon />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>
