<script setup lang="ts">
import { CalendarIcon, Download } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { formatDate } from '@/lib/utils';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

//12 months rolling window
const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(currentYear, currentMonth - i);
  return {
    label: formatDate(date, {
      month: 'long',
      year: 'numeric',
      day: undefined,
      hour: undefined,
      minute: undefined,
    }),
    value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
  };
}).reverse();

const props = defineProps<{
  downloadUrl: string;
  role: string;
  loading?: boolean;
}>();

const canAccess = computed(() => props.role !== 'customer' && props.role !== 'support');

const selectedMonth = ref(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);

const emit = defineEmits<{
  'update:selectedMonth': [value: string];
}>();

watch(
  selectedMonth,
  (value) => {
    emit('update:selectedMonth', value);
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <h3 class="text-base font-medium md:text-xl">Overview</h3>
    <div class="flex gap-2">
      <Select v-if="canAccess" v-model="selectedMonth" :disabled="props.loading">
        <SelectTrigger class="w-full sm:w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="m in months" :key="m.value" :value="m.value">
            {{ m.label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <div
        v-else
        class="text-muted-foreground flex w-full items-center justify-center gap-2 rounded-sm border p-2 text-sm sm:w-auto"
      >
        <CalendarIcon class="size-4" />
        <span>{{
          formatDate(new Date(), { hour: undefined, minute: undefined, hour12: undefined })
        }}</span>
      </div>

      <Button
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        :href="loading ? undefined : downloadUrl"
        :class="loading ? 'pointer-events-none opacity-50' : ''"
      >
        <Download class="mr-2 size-4" />
        Download
      </Button>
    </div>
  </div>
</template>
