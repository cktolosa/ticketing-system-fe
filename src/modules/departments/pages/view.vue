<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';

import { getErrorMessage } from '@/lib/utils';

import { departmentsApi } from '@/modules/departments/services';
import type { Department } from '@/modules/departments';
import type { User } from '@/modules/users';
import { useFormDialog } from '@/composables/useFormDialog';

const route = useRoute();
const companyId = String(route.params.companyId);
const departmentId = String(route.params.id);
const department = ref<Department | null>(null);
const employees = ref<User[]>([]);
const fetchError = ref('');
const postError = ref('');

const fetchDepartment = async () => {
  fetchError.value = '';
  try {
    const response = await departmentsApi.getById(departmentId);
    department.value = response;
    employees.value = response.users;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    department.value = null;
    employees.value = [];
  }
};

onMounted(fetchDepartment);

const isDialogOpen = ref(false);
const departmentSchema = z.object({
  department: z
    .string()
    .min(3, 'Department must be at least 2 characters.')
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
    await departmentsApi.update(departmentId, companyId, data.department);
    isDialogOpen.value = false;
    resetForm();
    await fetchDepartment();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

useFormDialog(isDialogOpen, resetForm, () => ({
  department: department.value?.name ?? '',
}));

watch(isDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: { department: department.value?.name ?? '' },
    });
    postError.value = '';
  }
});
</script>

<template>
  <div class="w-full p-5">
    <template v-if="fetchError">
      <p class="text-destructive py-5 text-center text-sm">
        {{ fetchError }}
      </p>
    </template>

    <template v-else>
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle>{{ department?.name ?? 'Unknown' }}</CardTitle>
          <CardAction>
            <FormDialog
              v-model:open="isDialogOpen"
              name="department"
              :post-error="postError"
              :is-submitting="isSubmitting"
              @submit="onSubmit"
              @clear-error="postError = ''"
            >
              <template #content>
                <VeeField v-slot="{ componentField }" name="department">
                  <Input v-bind="componentField" label="Department" type="text" />
                </VeeField>
              </template>
            </FormDialog>
          </CardAction>
        </CardHeader>

        <CardContent class="space-y-3">
          <h3 class="font-medium">Members</h3>

          <template v-if="employees && employees.length">
            <div v-for="employee in employees" :key="employee.id" class="flex items-center">
              <UserAvatar :name="employee.name" :subtitle="employee.email" variant="md" />
            </div>
          </template>

          <template v-else>
            <p class="text-muted-foreground text-sm">No members found.</p>
          </template>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
