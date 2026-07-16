<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { UserAvatar } from '@/components/user-avatar';

import { getErrorMessage } from '@/lib/utils';

import { profileApi } from '@/modules/profile/services';
import { useAuthStore } from '@/stores/auth';

const postError = ref('');
const auth = useAuthStore();
const userSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 2_097_152, 'File must be less than 2MB.')
    .refine((file) => file.type.startsWith('image/'), 'Only image files are allowed.')
    .optional(),
});

const defaultValues: z.infer<typeof userSchema> = {
  avatar: undefined,
};

const { handleSubmit, resetForm, isSubmitting } = useForm({
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

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await profileApi.update(data);
    await auth.fetchMe();
    handleCancel();
  } catch (error) {
    postError.value = getErrorMessage(error);
    handleCancel();
  }
});
</script>

<template>
  <div class="space-y-4 p-5">
    <UserAvatar
      :src="auth.user?.avatar?.urls?.full"
      :name="auth.user?.name ?? ''"
      :subtitle="auth.user?.email"
      variant="lg"
    />
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
              <FieldError v-if="postError">{{ postError }}</FieldError>
              <VeeField v-slot="{ componentField, errors }" name="avatar">
                <Field>
                  <FieldLabel for="avatar">Profile Picture</FieldLabel>
                  <input
                    v-bind="componentField"
                    id="avatar"
                    ref="fileRef"
                    type="file"
                    accept="image/*"
                    :class="[
                      'bg-background flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium',
                      errors.length ? 'border-destructive' : 'border-input',
                    ]"
                  />
                  <FieldDescription>Accepts images up to 2MB.</FieldDescription>
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>

              <Field>
                <FieldLabel for="name">Full Name</FieldLabel>
                <Input id="name" type="name" :placeholder="auth.user?.name" disabled />
              </Field>

              <Field>
                <FieldLabel for="email">Email</FieldLabel>
                <Input id="email" type="email" :placeholder="auth.user?.email" disabled />
              </Field>

              <Field>
                <FieldLabel for="department">Department</FieldLabel>
                <Input
                  id="department"
                  type="department"
                  :placeholder="auth.user?.department?.name"
                  disabled
                />
              </Field>

              <Field>
                <FieldLabel for="role">Role</FieldLabel>
                <Input
                  id="role"
                  type="role"
                  :placeholder="auth.user?.role?.name"
                  class="capitalize"
                  disabled
                />
              </Field>

              <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" @click="handleCancel"> Cancel </Button>
                <Button type="submit" :disabled="isSubmitting">
                  <Spinner v-if="isSubmitting" />
                  {{ isSubmitting ? 'Saving' : 'Update' }}
                </Button>
              </div>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
