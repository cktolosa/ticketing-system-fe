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
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { DataTable, Pagination, Search } from '@/components/data-table';
import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getErrorMessage } from '@/lib/utils';

import UpdateCompany from '@/modules/companies/components/update-company.vue';
import { companiesApi } from '@/modules/companies/services/api';
import type { Company } from '@/modules/companies/types';
import { columns } from '@/modules/departments/columns';
import { departmentsApi } from '@/modules/departments/services/api';
import type { Department } from '@/modules/departments/types';

const route = useRoute();
const companyId = String(route.params.id);
const postError = ref('');
const isCreateDialogOpen = ref(false);

const company = ref<Company | null>(null);
const departments = ref<Department[]>([]);
const fetchError = ref('');

const fetchCompany = async () => {
  fetchError.value = '';
  try {
    const response = await companiesApi.getById(companyId);
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
    .max(50, 'Department must not exceed 50 characters.'),
});

const defaultValues: z.infer<typeof departmentSchema> = {
  department: '',
};

const { handleSubmit, resetForm, values } = useForm({
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

//clear server-error
watch(
  () => values.department,
  () => {
    postError.value = '';
  }
);

watch(isCreateDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: defaultValues,
    });
    postError.value = '';
  }
});
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
          @submit="onSubmit"
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
            <UpdateCompany :company="company" @updated="fetchCompany" />
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
