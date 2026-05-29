<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { storeToRefs } from 'pinia';
import { useForm, Field as VeeField } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Input, Select } from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Toggle } from '@/components/ui/toggle';
import { UserAvatar } from '@/components/user-avatar';

import { cn, getErrorMessage, transformToSelectOption } from '@/lib/utils';

import type { Department } from '@/modules/departments/types';
import { useCompanyStore } from '@/stores/company';
import { useRoleStore } from '@/stores/roles';

import { usersApi } from '..';
import DetailCard from '../components/detail-card.vue';
import StatusBadge from '../components/status-badge.vue';
import type { User } from '../types';

const companyStore = useCompanyStore();
const roleStore = useRoleStore();

const { companies } = storeToRefs(companyStore);
const { roles } = storeToRefs(roleStore);
const departments = ref<Department[]>([]);

const route = useRoute();
const userId = String(route.params.id);

const user = ref<User | null>(null);
const fetchError = ref('');
const postError = ref('');
const fetchUser = async () => {
  fetchError.value = '';
  try {
    const response = await usersApi.getById(userId);
    user.value = response;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    user.value = null;
  }
};
const fileRef = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  await Promise.all([companyStore.fetchCompanies(), roleStore.fetchRoles(), fetchUser()]);
});

const userSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 2_097_152, 'File must be less than 2MB.')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, or WEBP files are allowed.'
    )
    .optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(255, 'Name must not exceed 255 characters.'),
  email: z.string().email('Email is required.'),
  company_id: z.coerce.number().min(1, 'Please select a company.'),
  department_id: z.coerce.number().min(1, 'Please select a department.'),
  role_id: z.coerce.number().min(1, 'Please select a role.'),
  is_active: z.boolean(),
});

const defaultValues: z.infer<typeof userSchema> = {
  avatar: undefined,
  name: '',
  email: '',
  company_id: 0,
  department_id: 0,
  role_id: 0,
  is_active: true,
};
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: defaultValues,
});

async function onCompanyChange(companyId: string) {
  const company = await companyStore.fetchCompanybyId(companyId);
  departments.value = company.departments ?? [];
}

const isDialogOpen = ref(false);

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await usersApi.update(userId, data);
    isDialogOpen.value = false;
    await fetchUser();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

watch(isDialogOpen, async (open) => {
  if (open) {
    if (user.value?.company?.id) {
      const company = await companyStore.fetchCompanybyId(String(user.value.company.id));
      departments.value = company.departments ?? [];
    }

    resetForm({
      values: {
        avatar: undefined,
        name: user.value?.name ?? '',
        email: user.value?.email,
        company_id: user.value?.company?.id,
        department_id: user.value?.department?.id,
        role_id: user.value?.role?.id,
        is_active: user.value?.status === 'active',
      },
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
    <div class="space-y-4 p-5">
      <div class="flex justify-between px-2">
        <div class="flex items-center gap-2">
          <UserAvatar :src="user?.avatar?.urls?.full" :name="user?.name ?? ''" variant="lg" />
          <StatusBadge :status="user?.status" />
        </div>

        <FormDialog
          v-model:open="isDialogOpen"
          name="user"
          content-class="max-h-[90vh] overflow-y-auto md:max-w-4xl"
          :post-error="postError"
          @submit="onSubmit"
        >
          <template #content>
            <FieldGroup>
              <FieldSet>
                <div class="grid gap-4 md:grid-cols-2">
                  <VeeField v-slot="{ handleChange, errors }" name="avatar">
                    <Field>
                      <FieldLabel for="avatar">Profile Picture</FieldLabel>
                      <input
                        id="avatar"
                        ref="fileRef"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        :class="
                          cn(
                            'bg-background flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium',
                            errors.length ? 'border-destructive' : 'border-input'
                          )
                        "
                        @change="
                          (e: Event) => handleChange((e.target as HTMLInputElement).files?.[0])
                        "
                      />
                      <FieldDescription>Accepts images up to 2MB.</FieldDescription>
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-slot="{ componentField }" name="name">
                    <Input
                      v-bind="componentField"
                      label="Name"
                      type="text"
                      placeholder="Enter the full name"
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

                  <VeeField v-slot="{ componentField }" name="role_id">
                    <Select
                      v-bind="componentField"
                      label="Role"
                      placeholder="Select a role"
                      :options="
                        transformToSelectOption(roles, { labelKey: 'role', valueKey: 'id' })
                      "
                    />
                  </VeeField>

                  <VeeField v-slot="{ componentField }" name="company_id">
                    <Select
                      v-bind="componentField"
                      label="Company"
                      placeholder="Select a company"
                      :options="
                        transformToSelectOption(companies, { labelKey: 'name', valueKey: 'id' })
                      "
                      @update:model-value="onCompanyChange"
                    />
                  </VeeField>

                  <VeeField v-slot="{ componentField }" name="department_id">
                    <Select
                      v-bind="componentField"
                      label="Department"
                      placeholder="Select a department"
                      :disabled="!departments.length"
                      :options="
                        transformToSelectOption(departments, { labelKey: 'name', valueKey: 'id' })
                      "
                    />
                  </VeeField>
                </div>
                <VeeField v-slot="{ value, errors }" name="is_active">
                  <Field>
                    <FieldLabel for="is_active">Status</FieldLabel>
                    <Toggle
                      variant="outline"
                      :pressed="value"
                      @click="setFieldValue('is_active', !value)"
                    >
                      {{ value ? 'Active' : 'Inactive' }}
                    </Toggle>

                    <FieldError v-if="errors.length" :errors="errors" />
                  </Field>
                </VeeField>
              </FieldSet>
            </FieldGroup>
          </template>
        </FormDialog>
      </div>

      <DetailCard title="Personal Information">
        <div class="space-y-5 text-sm">
          <div class="space-y-1">
            <p class="text-muted-foreground">Profile Picture</p>
            <Avatar class="size-10">
              <AvatarImage :src="user?.avatar?.urls?.full" :alt="user?.name" />
              <AvatarFallback>
                {{
                  (user?.name ?? '')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                }}
              </AvatarFallback>
            </Avatar>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p class="text-muted-foreground">Full Name</p>
              <p>{{ user?.name }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Email Address</p>
              <div class="flex flex-col items-start gap-x-2 lg:flex-row">
                <p>{{ user?.email }}</p>
                <a href="#" class="text-primary font-medium hover:underline"
                  >Generate reset password link</a
                >
              </div>
            </div>
          </div>
        </div>
      </DetailCard>

      <DetailCard
        title="Access Control"
        description="Changing a user’s role will immediately update their permissions and access across the system."
        show-warning
      >
        <div class="space-y-1 text-sm capitalize">
          <p class="text-muted-foreground text-sm">Role</p>
          <p>{{ user?.role?.name }}</p>
        </div>
      </DetailCard>

      <DetailCard
        title="Management Assignment"
        description="Changing the company or department may affect data visibility, reporting structure, and workflow assignments."
        show-warning
      >
        <div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div>
            <p class="text-muted-foreground">Company</p>
            <p>{{ user?.company?.name }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Department</p>
            <p>{{ user?.department?.name }}</p>
          </div>
        </div>
      </DetailCard>

      <DetailCard
        title="Account Status"
        description="Deactivating this account will immediately prevent the user from accessing the system."
        show-warning
      >
        <div class="space-y-1 text-sm">
          <p class="text-muted-foreground text-sm">Status</p>
          <StatusBadge :status="user?.status" />
        </div>
      </DetailCard>
    </div>
  </template>
</template>
