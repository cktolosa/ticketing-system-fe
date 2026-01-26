<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { ChevronDown, Circle, Pencil } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { ItemGroup } from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { formatDate } from '@/lib/utils';
import type { Ticket } from '@/modules/tickets/columns';
import AttachmentItem from '@/modules/tickets/components/attachment-item.vue';
import Comments from '@/modules/tickets/components/comment.vue';
import type { Comment } from '@/modules/tickets/components/comment.vue';
import PriorityBadge from '@/modules/tickets/components/priority.vue';
import StatusBadge from '@/modules/tickets/components/status.vue';
import { ViewAttachmentDialog } from '@/modules/tickets/components/view-attachment-dialog';
import type { Attachment } from '@/modules/tickets/types';

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

type History = {
  description: string;
  timestamp: Date;
};

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

const isOpen = ref(true);
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

const handleCancel = () => {
  resetForm();
};

const onSubmit = handleSubmit((data) => {
  alert(JSON.stringify(data));
  handleCancel();
  isDialogOpen.value = false;
});
</script>

<template>
  <div class="grid w-full grid-cols-1 lg:grid-cols-2">
    <Card class-name="w-full py-5">
      <CardHeader>
        <div class="space-y-1">
          <CardTitle class="flex flex-row items-center justify-between gap-2">
            <span class="leading-relaxed"> {{ ticket.title }}</span>

            <Dialog v-model:open="isDialogOpen">
              <DialogTrigger as-child>
                <Button variant="ghost">
                  <Pencil class="size-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit ticket</DialogTitle>
                  <DialogDescription>
                    Make changes to the ticket here. Click update when you are done.
                  </DialogDescription>
                </DialogHeader>
                <form @submit="onSubmit">
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
          </CardTitle>
          <CardDescription class="mb-2 flex items-center gap-2">
            <StatusBadge :status="ticket.status" />
            <PriorityBadge :priority="ticket.priority" />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="mt-1 space-y-7">
        <div class="space-y-1">
          <h3 class="mb-2 text-sm font-semibold">Description</h3>
          <p class="leading-relaxed">
            I'm unable to log into my account and need help regaining access as soon as possible. I
            think I either forgot my password, my credentials might have expired, or my account got
            automatically locked after several failed login attempts. I'm ready to verify my
            identity through the security procedures, reset my password if needed, and follow the
            steps to create a new secure password. I'd also appreciate guidance on setting up
            additional security measures like two-factor authentication to avoid this issue in the
            future.
          </p>
        </div>
        <ItemGroup v-if="attachments.length" class="gap-y-2">
          <AttachmentItem v-for="(attachment, index) in attachments" :key="index" :attachment />
        </ItemGroup>
        <Comments :comments="comments" />
      </CardContent>
    </Card>

    <div class="w-full space-y-4 p-5">
      <Collapsible v-model:open="isOpen" class="space-y-2 rounded-lg border p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Details</h3>
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="icon" class="size-8">
              <ChevronDown
                class="size-4 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
              />
              <span class="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <dl class="space-y-5 text-sm">
            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Assignee</dt>
              <dd class="flex items-center gap-2">
                <Avatar class="size-6">
                  <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                  <AvatarFallback>{{ ticket.admin.charAt(0).toUpperCase() }}</AvatarFallback>
                </Avatar>
                <span>{{ ticket.admin }}</span>
              </dd>
            </div>

            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Department</dt>
              <dd>{{ ticket.department }}</dd>
            </div>

            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Reporter</dt>
              <dd class="flex items-center gap-2">
                <Avatar class="size-6">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>JR</AvatarFallback>
                </Avatar>
                <span>Jose Reyes</span>
              </dd>
            </div>

            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Status</dt>
              <dd><StatusBadge :status="ticket.status" /></dd>
            </div>

            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Priority</dt>
              <dd><PriorityBadge :priority="ticket.priority" /></dd>
            </div>

            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Created</dt>
              <dd>{{ formatDate(ticket.date) }}</dd>
            </div>

            <div class="flex items-start gap-3">
              <dt class="text-muted-foreground min-w-[150px]">Resolved</dt>
              <dd class="text-muted-foreground">Not yet resolved</dd>
            </div>
          </dl>
        </CollapsibleContent>
      </Collapsible>

      <Card class="min-h-[400px]">
        <CardHeader>
          <h3 class="text-sm font-semibold">Activity</h3>
        </CardHeader>
        <CardContent class="max-h-[500px] overflow-y-auto">
          <div class="space-y-3">
            <div
              v-for="(history, index) in histories"
              :key="index"
              class="flex items-start gap-3 gap-y-3"
            >
              <Circle class="text-muted-foreground mt-2 size-2 fill-current" />
              <div class="flex-1">
                <div class="text-sm">{{ history.description }}</div>
                <span class="text-muted-foreground text-xs">
                  {{ formatDate(history.timestamp) }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <ViewAttachmentDialog />
</template>
