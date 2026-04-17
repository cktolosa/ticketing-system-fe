<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { toTypedSchema } from '@vee-validate/zod';
import { Plus } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref, watch } from 'vue';
import * as z from 'zod';

import { DataTable, Pagination, Search } from '@/components/data-table';
import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';

import { columns } from '@/modules/companies/columns';
import type { Company } from '@/modules/companies/types';

const companies: Company[] = [
  { id: 1, name: 'Adish International Corporation' },
  { id: 2, name: 'ABC Incorporated' },
  { id: 3, name: 'XYZ Solutions' },
];

const table = useVueTable({
  get columns() {
    return columns;
  },
  get data() {
    return companies;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

const isDialogOpen = ref(false);
const companySchema = z.object({
  company: z
    .string()
    .min(2, 'Company name must be at least 2 characters.')
    .max(50, 'Company name must not exceed 50 characters.'),
});

const defaultValues: z.infer<typeof companySchema> = {
  company: '',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(companySchema),
  initialValues: defaultValues,
});

const onSubmit = handleSubmit((data) => {
  alert(JSON.stringify(data));
  isDialogOpen.value = false;
});

watch(isDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: defaultValues,
    });
  }
});
</script>

<template>
  <main class="flex flex-col gap-4 p-4">
    <div class="flex flex-col justify-between gap-3 md:flex-row">
      <Search :table column="name" model="companies" />
      <FormDialog
        v-model:open="isDialogOpen"
        name="company"
        title="Create Company"
        description="Create a new company by providing a descriptive name. Click create when you are done."
        submit-text="Create"
        @submit="onSubmit"
      >
        <template #trigger>
          <Button type="button"><Plus />Create</Button>
        </template>

        <template #content>
          <VeeField v-slot="{ componentField }" name="company">
            <Input
              v-bind="componentField"
              label="Company"
              type="text"
              placeholder="Enter company name"
            />
          </VeeField>
        </template>
      </FormDialog>
    </div>
    <DataTable :table />
    <Pagination :table />
  </main>
</template>
