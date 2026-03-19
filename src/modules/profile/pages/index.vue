<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { UserAvatar } from '@/components/user-avatar';

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
  email: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
});

const defaultValues: z.infer<typeof userSchema> = {
  picture: undefined,
  first_name: '',
  middle_name: '',
  last_name: 'Dela Cruz',
  email: 'juan@email.com',
  department: 'AIT',
  role: 'Superadmin',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: defaultValues,
});

const fileRef = ref<HTMLInputElement | null>(null);
const handleCancel = () => {
  if (fileRef.value) {
    fileRef.value.value = '';
  }
  resetForm();
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
  <div class="space-y-4 p-5">
    <UserAvatar name="Juan Dela Cruz" subtitle="juan@email.com" variant="lg" />
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription
          ><a href="#" class="text-primary text-sm font-medium hover:underline"
            >Generate reset password link</a
          ></CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <FieldGroup>
            <FieldSet>
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

              <VeeField v-slot="{ componentField }" name="first_name">
                <Input
                  v-bind="componentField"
                  label="First Name"
                  type="text"
                  placeholder="Enter your first name"
                  :disabled="!!defaultValues.first_name"
                />
              </VeeField>

              <VeeField v-slot="{ componentField }" name="middle_name">
                <Input
                  v-bind="componentField"
                  label="Middle Name"
                  type="text"
                  placeholder="Enter your middle name"
                  :disabled="!!defaultValues.middle_name"
                />
              </VeeField>

              <VeeField v-slot="{ componentField }" name="last_name">
                <Input
                  v-bind="componentField"
                  label="Last Name"
                  type="text"
                  placeholder="Enter your last name"
                  :disabled="!!defaultValues.last_name"
                />
              </VeeField>

              <VeeField v-slot="{ componentField }" name="email">
                <Input
                  v-bind="componentField"
                  label="Email"
                  type="email"
                  :disabled="!!defaultValues.email"
                />
              </VeeField>

              <VeeField v-slot="{ componentField }" name="department">
                <Input
                  v-bind="componentField"
                  label="Department"
                  type="text"
                  :disabled="!!defaultValues.department"
                />
              </VeeField>

              <VeeField v-slot="{ componentField }" name="role">
                <Input
                  v-bind="componentField"
                  label="Role"
                  type="text"
                  :disabled="!!defaultValues.role"
                />
              </VeeField>

              <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" @click="handleCancel"> Cancel </Button>
                <Button type="submit">Update</Button>
              </div>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
