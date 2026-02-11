<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Pencil } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref, watch } from 'vue';
import * as z from 'zod';

import { Input } from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type Employee = {
  id: number;
  name: string;
  email: string;
};
const employees = ref<Employee[]>([
  { id: 1, name: 'Jose Reyes', email: 'jose@email.com' },
  { id: 2, name: 'Carlos Mendoza', email: 'carlos@email.com' },
  { id: 3, name: 'Ana Marie Garcia', email: 'ana@email.com' },
]);

const isDialogOpen = ref(false);
const departmentSchema = z.object({
  department: z
    .string()
    .min(2, 'Department must be at least 2 characters.')
    .max(50, 'Department must not exceed 50 characters.'),
});

const defaultValues: z.infer<typeof departmentSchema> = {
  department: 'Team Banana',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(departmentSchema),
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
</script>

<template>
  <div class="w-full p-5">
    <Dialog v-model:open="isDialogOpen">
      <Card>
        <CardHeader>
          <CardTitle>Team Banana</CardTitle>
          <CardAction>
            <DialogTrigger as-child>
              <Button type="button" variant="ghost">
                <Pencil class="size-4" />
                Edit
              </Button>
            </DialogTrigger>
          </CardAction>
        </CardHeader>

        <CardContent class="space-y-3">
          <h3 class="font-medium">Members</h3>
          <div v-for="employee in employees" :key="employee.id" class="flex items-center gap-2">
            <Avatar class="size-8">
              <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
              <AvatarFallback>{{ employee.name.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div class="flex flex-col text-sm">
              <p class="font-medium">{{ employee.name }}</p>
              <p class="text-muted-foreground">{{ employee.email }}</p>
            </div>
          </div>
        </CardContent>

        <DialogContent @interact-outside="(e) => e.preventDefault()">
          <DialogHeader>
            <DialogTitle>Edit department</DialogTitle>
            <DialogDescription>
              Make changes to the department here. Click update when you are done.
            </DialogDescription>
          </DialogHeader>
          <form class="space-y-5" @submit="onSubmit">
            <VeeField v-slot="{ componentField }" name="department">
              <Input v-bind="componentField" label="Department" type="text" />
            </VeeField>
            <DialogFooter>
              <DialogClose as-child>
                <Button type="button" variant="outline"> Cancel </Button>
              </DialogClose>
              <Button type="submit"> Update </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Card>
    </Dialog>
  </div>
</template>
