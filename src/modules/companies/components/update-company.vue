<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';

import { getErrorMessage } from '@/lib/utils';

import { companiesApi } from '@/modules/companies/services/api';

import type { Company } from '../types';

const route = useRoute();
const companyId = String(route.params.id);

const isEditDialogOpen = ref(false);
const postError = ref('');

const props = defineProps<{
  company: Company | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const companySchema = z.object({
  company: z
    .string()
    .min(10, 'Company name must be at least 10 characters.')
    .max(50, 'Company name must not exceed 50 characters.'),
});

const defaultValues: z.infer<typeof companySchema> = {
  company: '',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(companySchema),
  initialValues: defaultValues,
});

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await companiesApi.update(companyId, data.company);
    isEditDialogOpen.value = false;
    resetForm();
    emit('updated');
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

watch(isEditDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: { company: props.company?.name ?? '' },
    });
    postError.value = '';
  }
});
</script>

<template>
  <FormDialog
    v-model:open="isEditDialogOpen"
    name="company"
    :post-error="postError"
    @submit="onSubmit"
  >
    <template #content>
      <VeeField v-slot="{ componentField }" name="company">
        <Input v-bind="componentField" label="Company" type="text" />
      </VeeField>
    </template>
  </FormDialog>
</template>
