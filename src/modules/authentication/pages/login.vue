<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import * as z from 'zod';

import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

const schema = toTypedSchema(
  z.object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  })
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
});

const onSubmit = handleSubmit(async (data) => {
  await new Promise((r) => setTimeout(r, 5000));

  alert(JSON.stringify(data));
});
</script>

<template>
  <main>
    <form @submit="onSubmit">
      <FieldSet>
        <FieldGroup>
          <VeeField v-slot="{ componentField }" name="email">
            <Input
              v-bind="componentField"
              label="Email"
              type="email"
              placeholder="user@example.com"
            />
          </VeeField>
          <VeeField v-slot="{ componentField }" name="password">
            <Input
              v-bind="componentField"
              label="Password"
              type="password"
              placeholder="********"
            />
          </VeeField>
          <Field orientation="horizontal">
            <Button :disabled="isSubmitting">
              <Spinner v-if="isSubmitting" />
              Login
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  </main>
</template>
