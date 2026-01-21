<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useClipboard } from '@vueuse/core';
import { CheckIcon, CopyIcon } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import { Input } from '@/components/form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Department = {
  id: number;
  name: string;
};
const departments = ref<Department[]>([
  { id: 1, name: 'Team Banana' },
  { id: 2, name: 'AIT' },
  { id: 3, name: 'HRAD' },
  { id: 4, name: 'Equinox' },
  { id: 5, name: 'QA' },
  { id: 6, name: 'Crowd Works' },
]);

type Role = {
  id: number;
  name: string;
};
const roles = ref<Role[]>([
  { id: 1, name: 'User' },
  { id: 2, name: 'Support' },
  { id: 3, name: 'Admin' },
  { id: 4, name: 'Superuser' },
]);

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
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must not exceed 50 characters.'),
  middle_name: z.string().max(50, 'Middle name must not exceed 50 characters.').optional(),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must not exceed 50 characters.'),
  email: z.string().email().min(1, 'Email is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  department_id: z.number().min(1, 'Please select a department.'),
  role_id: z.number().min(1, 'Please select a role.'),
});

const defaultValues: z.infer<typeof userSchema> = {
  picture: undefined,
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  password: generatedPassword.value,
  department_id: 0,
  role_id: 0,
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: defaultValues,
});

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

        <div class="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <VeeField v-slot="{ componentField, errors }" name="picture">
            <Field>
              <FieldLabel for="picture">Profile Picture</FieldLabel>
              <input
                v-bind="componentField"
                ref="fileRef"
                id="picture"
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

          <VeeField v-slot="{ componentField }" name="first_name">
            <Input
              v-bind="componentField"
              label="First Name"
              type="text"
              placeholder="Enter the first name"
            />
          </VeeField>

          <VeeField v-slot="{ componentField }" name="middle_name">
            <Input
              v-bind="componentField"
              label="Middle Name"
              type="text"
              placeholder="Enter the middle name"
            />
          </VeeField>

          <VeeField v-slot="{ componentField }" name="last_name">
            <Input
              v-bind="componentField"
              label="Last Name"
              type="text"
              placeholder="Enter the last name"
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
            <template v-slot="{ componentField }">
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

          <VeeField v-slot="{ field, errors }" name="department_id">
            <Field>
              <FieldLabel>Department</FieldLabel>
              <Select :model-value="field.value" @update:modelValue="field.onChange">
                <SelectTrigger :aria-invalid="!!errors.length">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="d in departments" :key="d.id" :value="d.id">
                    {{ d.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError :errors="errors" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="role_id">
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select :model-value="field.value" @update:modelValue="field.onChange">
                <SelectTrigger :aria-invalid="!!errors.length">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in roles" :key="r.id" :value="r.id">
                    {{ r.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError :errors="errors" />
            </Field>
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
