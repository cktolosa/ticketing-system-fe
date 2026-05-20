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
import { onMounted, ref, watch } from 'vue';
import * as z from 'zod';

import { DataTable, Pagination, Search } from '@/components/data-table';
import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';

import { getErrorMessage } from '@/lib/utils';

import { columns } from '@/modules/companies/columns';
import { companiesApi } from '@/modules/companies/services/api';
import type { Company } from '@/modules/companies/types';

const companies = ref<Company[]>([]);
const postError = ref('');
const fetchError = ref('');
const isDialogOpen = ref(false);

// fetching all companies
const fetchCompanies = async () => {
  fetchError.value = '';
  try {
    companies.value = await companiesApi.getAll();
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    companies.value = [];
  }
};
onMounted(fetchCompanies);

// table configuration
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

// company schema
const companySchema = z.object({
  company: z
    .string()
    .min(10, 'Company name must be at least 10 characters.')
    .max(100, 'Company name must not exceed 100 characters.'),
});
const defaultValues: z.infer<typeof companySchema> = {
  company: '',
};
const { handleSubmit, resetForm, values } = useForm({
  validationSchema: toTypedSchema(companySchema),
  initialValues: defaultValues,
});

// posting of data
const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await companiesApi.create(data.company);
    isDialogOpen.value = false;
    resetForm();
    await fetchCompanies();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

//clear server-error
watch(
  () => values.company,
  () => {
    postError.value = '';
  }
);

// reactive state for dialog
watch(isDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: defaultValues,
    });
    postError.value = '';
  }
});
</script>

<template>
  <main class="flex flex-col gap-4 p-4">
    <div v-if="fetchError" class="text-destructive py-5 text-center text-sm">
      {{ fetchError }}
    </div>
    <div v-else class="space-y-4">
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <Search :table column="name" model="companies" />
        <FormDialog
          v-model:open="isDialogOpen"
          name="company"
          title="Create Company"
          description="Create a new company by providing a descriptive name. Click create when you are done."
          submit-text="Create"
          :post-error="postError"
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
    </div>
  </main>
</template>
