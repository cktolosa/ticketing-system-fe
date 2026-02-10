<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Pencil } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import { Input } from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

import DetailCard from '../components/detail-card.vue';
import StatusBadge from '../components/status-badge.vue';

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

type Status = {
  id: number;
  name: string;
};
const statuses = ref<Status[]>([
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
]);

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
  department_id: z.number().min(1, 'Please select a department.'),
  role_id: z.number().min(1, 'Please select a role.'),
  status_id: z.number().min(1, 'Please select a status.'),
});

const defaultValues: z.infer<typeof userSchema> = {
  picture: undefined,
  first_name: 'Juan',
  middle_name: '',
  last_name: 'Dela Cruz',
  email: 'juan@email.com',
  department_id: 2,
  role_id: 3,
  status_id: 1,
};
const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: defaultValues,
});

const isDialogOpen = ref(false);
const fileRef = ref<HTMLInputElement | null>(null);
const handleCancel = () => {
  if (fileRef.value) {
    fileRef.value.value = '';
  }
  resetForm();
  isDialogOpen.value = false;
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
    <div class="flex justify-between px-2">
      <div class="flex items-center gap-2">
        <Avatar class="size-6">
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span class="font-medium">Juan Dela Cruz</span>
        <StatusBadge status="active" />
      </div>

      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button variant="ghost">
            <Pencil class="size-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent
          class="max-h-[90vh] overflow-y-auto md:max-w-4xl"
          @interact-outside="(e) => e.preventDefault()"
        >
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Make changes to the user here. Click update when you are done.
            </DialogDescription>
          </DialogHeader>
          <form @submit="onSubmit">
            <FieldGroup>
              <FieldSet>
                <div class="grid gap-4 md:grid-cols-2">
                  <VeeField v-slot="{ componentField, errors }" name="picture">
                    <Field>
                      <FieldLabel for="picture">Profile Picture</FieldLabel>
                      <input
                        v-bind="componentField"
                        id="picture"
                        ref="fileRef"
                        type="file"
                        accept="image/*"
                        :class="
                          cn(
                            'bg-background flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium',
                            errors.length ? 'border-destructive' : 'border-input'
                          )
                        "
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

                  <VeeField v-slot="{ field, errors }" name="role_id">
                    <Field>
                      <FieldLabel>Role</FieldLabel>
                      <Select :model-value="field.value" @update:model-value="field.onChange">
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

                  <VeeField v-slot="{ field, errors }" name="department_id">
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Select :model-value="field.value" @update:model-value="field.onChange">
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

                  <VeeField v-slot="{ field, errors }" name="status_id">
                    <Field>
                      <FieldLabel>Status</FieldLabel>
                      <Select :model-value="field.value" @update:model-value="field.onChange">
                        <SelectTrigger :aria-invalid="!!errors.length">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="s in statuses" :key="s.id" :value="s.id">
                            {{ s.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError :errors="errors" />
                    </Field>
                  </VeeField>
                </div>

                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="outline"> Cancel </Button>
                  </DialogClose>
                  <Button type="submit"> Update </Button>
                </DialogFooter>
              </FieldSet>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <DetailCard title="Personal Information">
      <div class="space-y-5">
        <div class="space-y-1">
          <p class="text-muted-foreground text-sm">Profile Picture</p>
          <div class="flex items-start gap-3">
            <Avatar class="size-10">
              <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div>
            <p class="text-muted-foreground text-sm">First Name</p>
            <p>Juan</p>
          </div>
          <div>
            <p class="text-muted-foreground text-sm">Middle Name</p>
            <p>No middle name</p>
          </div>
          <div>
            <p class="text-muted-foreground text-sm">Last Name</p>
            <p>Dela Cruz</p>
          </div>
          <div>
            <p class="text-muted-foreground text-sm">Email Address</p>
            <div class="flex flex-col items-start gap-x-2 lg:flex-row">
              <p>juandelacruz@email.com</p>
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
      <div class="space-y-1 text-sm">
        <p class="text-muted-foreground text-sm">Role</p>
        <p>Admin</p>
      </div>
    </DetailCard>

    <DetailCard
      title="Department Assignment"
      description="Changing the department may affect data visibility, reporting structure, and workflow assignments."
      show-warning
    >
      <div class="space-y-1 text-sm">
        <p class="text-muted-foreground text-sm">Department</p>
        <p>AIT</p>
      </div>
    </DetailCard>

    <DetailCard
      title="Account Status"
      description="Deactivating this account will immediately prevent the user from accessing the system."
      show-warning
    >
      <div class="space-y-1 text-sm">
        <p class="text-muted-foreground text-sm">Status</p>
        <StatusBadge status="active" />
      </div>
    </DetailCard>
  </div>
</template>
