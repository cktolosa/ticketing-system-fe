<script setup lang="ts">
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { toTypedSchema } from '@vee-validate/zod';
import { Plus } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import { DataTable, Pagination, Search } from '@/components/data-table';
import { Input } from '@/components/form';
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

import { columns } from '@/modules/departments/columns';
import type { Department } from '@/modules/departments/types';

const departments: Department[] = [
  { id: 1, name: 'Team Banana' },
  { id: 2, name: 'AIT' },
  { id: 3, name: 'HRAD' },
  { id: 4, name: 'Equinox' },
  { id: 5, name: 'QA' },
  { id: 6, name: 'Crowd Works' },
];

const table = useVueTable({
  get columns() {
    return columns;
  },
  get data() {
    return departments;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

const isDialogOpen = ref(false);
const departmentSchema = z.object({
  department: z
    .string()
    .min(2, 'Department must be at least 2 characters.')
    .max(50, 'Department must not exceed 50 characters.'),
});

const defaultValues: z.infer<typeof departmentSchema> = {
  department: '',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(departmentSchema),
  initialValues: defaultValues,
});

const onSubmit = handleSubmit((data) => {
  alert(JSON.stringify(data));
  resetForm();
  isDialogOpen.value = false;
});
</script>

<template>
  <main class="flex flex-col gap-4 p-4">
    <Dialog v-model:open="isDialogOpen">
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <Search :table column="name" model="departments" />
        <DialogTrigger as-child>
          <Button type="button"><Plus />Create New</Button>
        </DialogTrigger>
      </div>
      <DialogContent @interact-outside="(e) => e.preventDefault()">
        <DialogHeader>
          <DialogTitle>Add new department</DialogTitle>
          <DialogDescription>
            Create a new department by providing a descriptive name. Click submit when you are done.
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-5" @submit="onSubmit">
          <VeeField v-slot="{ componentField }" name="department">
            <Input
              v-bind="componentField"
              label="Department"
              type="text"
              placeholder="Enter department name"
            />
          </VeeField>
          <DialogFooter>
            <DialogClose as-child>
              <Button type="button" variant="outline"> Cancel </Button>
            </DialogClose>
            <Button type="submit"> Create </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <DataTable :table />
    <Pagination :table />
  </main>
</template>
