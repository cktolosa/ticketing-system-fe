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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { DataTable, Pagination, Search } from '@/components/data-table';
import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getErrorMessage } from '@/lib/utils';

import type { Company } from '@/modules/companies';

import { UpdateCompanyForm } from '@/modules/companies/components';

import { columns, type Department } from '@/modules/departments';
import { departmentsApi } from '@/modules/departments/services';

import { useCompanyStore } from '@/stores/company';
import { useFormDialog } from '@/composables/useFormDialog';

const route = useRoute();
const companyId = String(route.params.id);
const postError = ref('');
const isCreateDialogOpen = ref(false);

const companyStore = useCompanyStore();
const company = ref<Company | null>(null);
const departments = ref<Department[]>([]);
const fetchError = ref('');

const fetchCompany = async () => {
  fetchError.value = '';
  try {
    const response = await companyStore.fetchCompanybyId(companyId);
    company.value = response;
    departments.value = response.departments;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    company.value = null;
    departments.value = [];
  }
};

onMounted(fetchCompany);

const table = useVueTable({
  get columns() {
    return columns(companyId);
  },
  get data() {
    return departments;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

// create new department
const departmentSchema = z.object({
  department: z
    .string()
    .min(3, 'Department must be at least 3 characters.')
    .max(100, 'Department must not exceed 100 characters.'),
});

const defaultValues: z.infer<typeof departmentSchema> = {
  department: '',
};

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(departmentSchema),
  initialValues: defaultValues,
});

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await departmentsApi.create(companyId, data.department);
    isCreateDialogOpen.value = false;
    resetForm();
    await fetchCompany();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

useFormDialog(isCreateDialogOpen, resetForm, () => defaultValues);
</script>

<template>
  <template v-if="fetchError">
    <p class="text-destructive py-5 text-center text-sm">
      {{ fetchError }}
    </p>
  </template>

  <template v-else>
    <main class="flex flex-col gap-4 p-4">
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <Search :table column="name" model="departments" />
        <FormDialog
          v-model:open="isCreateDialogOpen"
          name="department"
          title="Create Department"
          description="Create a new department by providing a descriptive name. Click create when you are done."
          submit-text="Create"
          :post-error="postError"
          :is-submitting="isSubmitting"
          @submit="onSubmit"
          @clear-error="postError = ''"
        >
          <template #trigger>
            <Button type="button"><Plus />Create</Button>
          </template>

          <template #content>
            <VeeField v-slot="{ componentField }" name="department">
              <Input
                v-bind="componentField"
                label="Department"
                type="text"
                placeholder="Enter department name"
              />
            </VeeField>
          </template>
        </FormDialog>
      </div>
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle>{{ company?.name ?? 'Unknown' }}</CardTitle>
          <CardAction>
            <UpdateCompanyForm :company="company" @updated="fetchCompany" />
          </CardAction>
        </CardHeader>

        <CardContent class="space-y-3">
          <h3 class="font-medium">Departments</h3>
          <DataTable :table />
          <Pagination :table />
        </CardContent>
      </Card>
    </main>
  </template>
</template>
