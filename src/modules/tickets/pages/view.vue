<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { storeToRefs } from 'pinia';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Select } from '@/components/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { ItemGroup } from '@/components/ui/item';

import { transformToSelectOption } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils';

import {
  ActivitySection,
  AttachmentItem,
  CommentsSection,
  DetailsSection,
  PriorityBadge,
  StatusBadge,
  ViewAttachmentDialog,
} from '@/modules/tickets/components';
import type { Status, Ticket } from '@/modules/tickets/types';
import type { User } from '@/modules/users';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useDepartmentStore } from '@/stores/department';
import { usePriorityStore } from '@/stores/priority';

import { ticketsApi } from '../services';

const auth = useAuthStore();
const role = auth.user?.role?.name;
const route = useRoute();
const ticketId = String(route.params.id);

const isCollapsibleOpen = ref(true);
const isDialogOpen = ref(false);
const fetchError = ref('');
const postError = ref('');
const ticket = ref<Ticket | null>(null);
const statuses = ref<Status[]>([]);
const employees = ref<User[]>([]);
const priorityStore = usePriorityStore();
const departmentStore = useDepartmentStore();
const { priorities } = storeToRefs(priorityStore);
const { departments } = storeToRefs(departmentStore);

const canEdit = computed(() => {
  if (role === 'superadmin') return true;
  if (role === 'admin') return ticket.value?.department?.id === auth.user?.department?.id;
  if (role === 'support') return ticket.value?.employee?.id === auth.user?.id;
  return false;
});

async function onDepartmentChange(departmentId: string) {
  const department = await departmentStore.fetchDepartmentbyId(departmentId);
  employees.value = (department.users ?? []).filter((user: User) => user.role?.name !== 'customer');
}

const ticketSchema = z.object({
  priority_id: z.coerce.number().min(1, 'Please select a priority.'),
  status_id: z.coerce.number().min(1, 'Please select a status.'),
  department_id: z.coerce.number().min(1, 'Please select a department.'),
  employee_id: z.coerce.number().min(1, 'Please select an employee'),
});

//sample default values
const defaultValues: z.infer<typeof ticketSchema> = {
  department_id: 0,
  employee_id: 0,
  priority_id: 0,
  status_id: 0,
};

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(ticketSchema),
  initialValues: defaultValues,
});

// 500 server error
const onSubmit = handleSubmit(async (data) => {
  try {
    await ticketsApi.update(ticketId, data);
    isDialogOpen.value = false;
    resetForm();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

watch(isDialogOpen, async (open) => {
  if (open) {
    if (ticket.value?.department?.id) {
      await onDepartmentChange(String(ticket.value.department.id));
    }

    resetForm({
      values: {
        department_id: ticket.value?.department?.id,
        employee_id: ticket.value?.employee?.id,
        status_id: ticket.value?.status?.id,
        priority_id: ticket.value?.priority?.id,
      },
    });

    postError.value = '';
  }
});

const fetchTicket = async () => {
  fetchError.value = '';
  try {
    const response = await ticketsApi.getById(ticketId);
    ticket.value = response;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    ticket.value = null;
    console.log(error);
  }
};

onMounted(async () => {
  const fetches = [fetchTicket()];

  if (role !== 'customer') {
    fetches.push(
      priorityStore.fetchPriorities(),
      departmentStore.fetchDepartments(),
      api.get('statuses').then((res) => (statuses.value = res.data.data))
    );
  }
  await Promise.all(fetches);
});
</script>

<template>
  <template v-if="fetchError">
    <p class="text-destructive py-5 text-center text-sm">
      {{ fetchError }}
    </p>
  </template>
  <template v-else-if="ticket">
    <div class="grid w-full grid-cols-1 gap-5 p-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div class="space-y-1">
            <CardTitle class="flex items-center justify-between gap-2 text-xl">
              {{ ticket?.title }}
              <FormDialog
                v-if="canEdit"
                v-model:open="isDialogOpen"
                name="ticket"
                :is-submitting="isSubmitting"
                :post-error="postError"
                @submit="onSubmit"
              >
                <template #content>
                  <FieldGroup>
                    <FieldSet>
                      <div class="grid gap-4">
                        <VeeField v-slot="{ componentField }" name="priority_id">
                          <Select
                            v-bind="componentField"
                            label="Priority"
                            placeholder="Select a priority"
                            :options="
                              transformToSelectOption(priorities, {
                                labelKey: 'category',
                                valueKey: 'id',
                              })
                            "
                          />
                        </VeeField>

                        <!-- no access yet for admin and support -->
                        <VeeField v-slot="{ componentField }" name="status_id">
                          <Select
                            v-bind="componentField"
                            label="Status"
                            placeholder="Select a status"
                            :options="
                              transformToSelectOption(statuses, {
                                labelKey: 'category',
                                valueKey: 'id',
                              })
                            "
                          />
                        </VeeField>

                        <VeeField v-slot="{ componentField }" name="department_id">
                          <Select
                            v-bind="componentField"
                            label="Department"
                            placeholder="Select a department"
                            :options="
                              transformToSelectOption(departments, {
                                labelKey: 'name',
                                valueKey: 'id',
                              })
                            "
                            @update:model-value="onDepartmentChange"
                          />
                        </VeeField>

                        <VeeField v-slot="{ componentField }" name="employee_id">
                          <Select
                            v-bind="componentField"
                            label="Employee"
                            placeholder="Select an employee"
                            :disabled="!employees.length"
                            :options="
                              transformToSelectOption(employees, {
                                labelKey: 'name',
                                valueKey: 'id',
                              })
                            "
                          />
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
            <h3 class="font-medium">Description</h3>
            <p class="text-sm leading-relaxed">{{ ticket.description }}</p>
          </div>

          <ItemGroup v-if="ticket?.attachments.length" class="gap-y-2">
            <AttachmentItem
              v-for="(attachment, index) in ticket.attachments"
              :key="index"
              :attachment="attachment"
            />
          </ItemGroup>

          <CommentsSection :comments="ticket?.comments" :name="auth.user?.name ?? ''" />
        </CardContent>
      </Card>

      <div class="space-y-5">
        <DetailsSection v-model:open="isCollapsibleOpen" :ticket="ticket" />
        <ActivitySection :histories="ticket?.histories" />
      </div>
    </div>

    <ViewAttachmentDialog />
  </template>
</template>
