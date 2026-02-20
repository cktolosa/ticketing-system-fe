<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref, watch } from 'vue';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { ItemGroup } from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ActivitySection,
  AttachmentItem,
  CommentsSection,
  DetailsSection,
  PriorityBadge,
  StatusBadge,
  ViewAttachmentDialog,
} from '@/modules/tickets/components';
import type { Attachment, Comment, History, Ticket } from '@/modules/tickets/types';

const ticket: Ticket = {
  date: new Date('2025-12-02'),
  title: 'Password resets and account lockouts',
  department: 'AIT',
  admin: 'Juan Dela Cruz',
  status: 'in progress',
  priority: 'low',
};

const attachments: Attachment[] = [
  { filename: 'IMG_0001', size: '5 MB' },
  { filename: 'IMG_0002', size: '3 MB' },
  { filename: 'IMG_0003', size: '2 MB' },
];

const histories: History[] = [
  {
    description: 'Jose Reyes created a new ticket.',
    timestamp: new Date('2025-12-02T10:30:00'),
  },
  {
    description: 'Jose Reyes set the ticket status to New.',
    timestamp: new Date('2025-12-02T10:32:00'),
  },
  {
    description: 'Jose Reyes set the ticket priority to Low.',
    timestamp: new Date('2025-12-02T10:35:00'),
  },
  {
    description: 'Jose Reyes assigned a ticket to Juan Dela Cruz.',
    timestamp: new Date('2025-12-02T11:00:00'),
  },
  {
    description: 'Juan Dela Cruz changed its status to In Progress.',
    timestamp: new Date('2025-12-03T14:20:00'),
  },
];

const comments: Comment[] = [
  {
    id: 1,
    author: 'Jose Reyes',
    comment:
      "Users are reporting that they're being locked out of their accounts after only 2 failed password attempts. The system should allow 5 attempts before locking. I've documented several cases from this morning.",
    timestamp: new Date('2025-12-02T11:00:00'),
  },
  {
    id: 2,
    author: 'Juan Dela Cruz',
    comment:
      "I've investigated the issue and found a misconfiguration in the authentication module. The lockout threshold was set to 2 instead of 5. I'm attaching the updated configuration file for review before deploying to production.",
    timestamp: new Date('2025-12-02T11:00:00'),
    attachments: [{ filename: 'IMG_0004', size: '2 MB' }],
  },
  {
    id: 3,
    author: 'Jose Reyes',
    comment:
      "Excellent work! I've tested the fix in staging and confirmed that users can now attempt password reset 5 times before being locked out. The reset email delivery is also working correctly. Attaching the full test results.",
    timestamp: new Date('2025-12-02T11:00:00'),
    attachments: [{ filename: 'IMG_0005', size: '1.8 MB' }],
  },
];

const isCollapsibleOpen = ref(true);
const isDialogOpen = ref(false);

type Status = {
  id: number;
  name: string;
};
const statuses = ref<Status[]>([
  { id: 1, name: 'New' },
  { id: 2, name: 'In Progress' },
  { id: 3, name: 'Resolved' },
  { id: 4, name: 'Closed' },
]);

type Priority = {
  id: number;
  name: string;
};
const priorities = ref<Priority[]>([
  { id: 1, name: 'Low' },
  { id: 2, name: 'Medium' },
  { id: 3, name: 'High' },
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

type Admin = {
  id: number;
  name: string;
};
const admins = ref<Admin[]>([
  { id: 1, name: 'Juan Dela Cruz' },
  { id: 2, name: 'Juana Rodriguez' },
  { id: 3, name: 'Ruby Velasquez' },
]);

const ticketSchema = z.object({
  priority_id: z.number().min(1, 'Please select a priority.'),
  status_id: z.number().min(1, 'Please select a status.'),
  department_id: z.number().min(1, 'Please select a department.'),
  admin_id: z.number().min(1, 'Please select an admin'),
});

//sample default values
const defaultValues: z.infer<typeof ticketSchema> = {
  department_id: 2,
  admin_id: 1,
  priority_id: 1,
  status_id: 2,
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(ticketSchema),
  initialValues: defaultValues,
});

const onSubmit = handleSubmit((data) => {
  alert(JSON.stringify(data));
  isDialogOpen.value = false;
});

watch(isDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: defaultValues,
    });
  }
});

const description = `I'm unable to log into my account and need help regaining access as soon as possible. I think I either forgot my password, my credentials might have expired, or my account got automatically locked after several failed login attempts. I'm ready to verify my identity through the security procedures, reset my password if needed, and follow the steps to create a new secure password. I'd also appreciate guidance on setting up additional security measures like two-factor authentication to avoid this issue in the future.`;
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-5 p-5 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <div class="space-y-1">
          <CardTitle class="flex flex-row items-center justify-between gap-2">
            <span class="leading-relaxed"> {{ ticket.title }}</span>

            <FormDialog v-model:open="isDialogOpen" name="ticket" @submit="onSubmit">
              <template #content>
                <FieldGroup>
                  <FieldSet>
                    <div class="grid gap-4">
                      <VeeField v-slot="{ field, errors }" name="priority_id">
                        <Field>
                          <FieldLabel>Priority</FieldLabel>
                          <Select :model-value="field.value" @update:model-value="field.onChange">
                            <SelectTrigger :aria-invalid="!!errors.length">
                              <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="p in priorities" :key="p.id" :value="p.id">
                                {{ p.name }}
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

                      <VeeField v-slot="{ field, errors }" name="admin_id">
                        <Field>
                          <div class="flex justify-between">
                            <FieldLabel>Admin</FieldLabel>
                          </div>
                          <Select :model-value="field.value" @update:model-value="field.onChange">
                            <SelectTrigger :aria-invalid="!!errors.length">
                              <SelectValue placeholder="Select an admin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="a in admins" :key="a.id" :value="a.id">
                                {{ a.name }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FieldError :errors="errors" />
                        </Field>
                      </VeeField>
                    </div>
                  </FieldSet>
                </FieldGroup>
              </template>
            </FormDialog>
          </CardTitle>
          <CardDescription class="flex items-center gap-2">
            <StatusBadge :status="ticket.status" />
            <PriorityBadge :priority="ticket.priority" />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="mt-1 space-y-7">
        <div class="space-y-1">
          <h3 class="mb-2 text-sm font-semibold">Description</h3>
          <p class="leading-relaxed">{{ description }}</p>
        </div>
        <ItemGroup v-if="attachments.length" class="gap-y-2">
          <AttachmentItem v-for="(attachment, index) in attachments" :key="index" :attachment />
        </ItemGroup>
        <CommentsSection :comments />
      </CardContent>
    </Card>

    <div class="space-y-5">
      <DetailsSection v-model:open="isCollapsibleOpen" :ticket="ticket" />
      <ActivitySection :histories="histories" />
    </div>
  </div>

  <ViewAttachmentDialog />
</template>
