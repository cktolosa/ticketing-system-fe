<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useClipboard } from '@vueuse/core';
import { CheckIcon, CopyIcon } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useForm, Field as VeeField } from 'vee-validate';
import { onMounted, ref } from 'vue';
import * as z from 'zod';

import { Input, Select } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

import { transformToSelectOption } from '@/lib/utils';

import type { Department } from '@/modules/departments/types';
import { useCompanyStore } from '@/stores/company';
import { useRoleStore } from '@/stores/roles';

const companyStore = useCompanyStore();
const roleStore = useRoleStore();

const { companies } = storeToRefs(companyStore);
const { roles } = storeToRefs(roleStore);
const departments = ref<Department[]>([]);

onMounted(async () => {
  await Promise.all([companyStore.fetchCompanies(), roleStore.fetchRoles()]);
});

const generatePassword = () => {
  return Math.random().toString(36).slice(2, 10);
};
const generatedPassword = ref(generatePassword());
const { copy, copied } = useClipboard({ source: generatedPassword });

const userSchema = z.object({
  picture: z
    .instanceof(File)
    .refine((file) => file.size <= 10_485_760, 'File must be less than 10MB.')
    .refine((file) => file.type.startsWith('image/'), 'Only image files are allowed.')
    .optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(255, 'Name must not exceed 255 characters.'),
  email: z.string().email('Email is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  company_id: z.coerce.number().min(1, 'Please select a company.'),
  department_id: z.coerce.number().min(1, 'Please select a department.'),
  role_id: z.coerce.number().min(1, 'Please select a role.'),
});

const defaultValues: z.infer<typeof userSchema> = {
  picture: undefined,
  name: '',
  email: '',
  password: generatedPassword.value,
  company_id: 0,
  department_id: 0,
  role_id: 0,
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: defaultValues,
});

async function onCompanyChange(companyId: string) {
  const company = await companyStore.fetchCompanybyId(companyId);
  departments.value = company.departments ?? [];
}

const fileRef = ref<HTMLInputElement | null>(null);
const handleCancel = () => {
  generatedPassword.value = generatePassword();

  if (fileRef.value) {
    fileRef.value.value = '';
  }

  resetForm({
    values: {
      ...defaultValues,
      password: generatedPassword.value,
    },
  });
};

// still need to fix once roles are not undefined
const onSubmit = handleSubmit((data) => {
  alert(
    JSON.stringify({
      ...data,
      picture: data.picture
        ? {
            name: data.picture.name,
            size: data.picture.size,
            type: data.picture.type,
          }
        : undefined,
    })
  );
  handleCancel();
});
</script>

<template>
  <form class="w-full p-5" @submit="onSubmit">
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Create User</FieldLegend>
        <FieldDescription> Provide the details below to create a new user. </FieldDescription>

        <!-- no avatar field yet -->
        <VeeField v-slot="{ componentField, errors }" name="picture">
          <Field>
            <FieldLabel for="picture">Profile Picture</FieldLabel>
            <input
              v-bind="componentField"
              id="picture"
              ref="fileRef"
              type="file"
              accept="image/*"
              :class="[
                'bg-background flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium',
                errors.length ? 'border-destructive' : 'border-input',
              ]"
            />
            <FieldDescription>Accepts images up to 10MB.</FieldDescription>
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <div class="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <VeeField v-slot="{ componentField }" name="name">
            <Input
              v-bind="componentField"
              label="Full Name"
              type="text"
              placeholder="Enter the full name"
            />
          </VeeField>

          <!-- returning null values -->
          <VeeField v-slot="{ componentField }" name="role_id">
            <Select
              v-bind="componentField"
              label="Role"
              placeholder="Select a role"
              :options="transformToSelectOption(roles, { labelKey: 'role', valueKey: 'id' })"
            />
          </VeeField>

          <VeeField v-slot="{ componentField }" name="email">
            <Input
              v-bind="componentField"
              label="Email"
              type="email"
              placeholder="Enter the work email address"
            />
          </VeeField>

          <VeeField name="password" :value="generatedPassword">
            <template #default="{ componentField }">
              <Field>
                <FieldLabel>Generated Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput v-bind="componentField" id="password" type="text" readonly />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton type="button" size="icon-xs" @click="copy()">
                      <CopyIcon v-if="!copied" />
                      <CheckIcon v-if="copied" />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </template>
          </VeeField>

          <VeeField v-slot="{ componentField }" name="company_id">
            <Select
              v-bind="componentField"
              label="Company"
              placeholder="Select a company"
              :options="transformToSelectOption(companies, { labelKey: 'name', valueKey: 'id' })"
              @update:model-value="onCompanyChange"
            />
          </VeeField>

          <VeeField v-slot="{ componentField }" name="department_id">
            <Select
              v-bind="componentField"
              label="Department"
              placeholder="Select a department"
              :disabled="!departments.length"
              :options="transformToSelectOption(departments, { labelKey: 'name', valueKey: 'id' })"
            />
          </VeeField>
        </div>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" @click="handleCancel"> Cancel </Button>
          <Button type="submit">Create</Button>
        </div>
      </FieldSet>
    </FieldGroup>
  </form>
</template>
