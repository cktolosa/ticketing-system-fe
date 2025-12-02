<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field as VeeField } from "vee-validate";

const schema = toTypedSchema(
  z.object({
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
  },
});

const onSubmit = handleSubmit((data) => {
  alert(JSON.stringify(data));
});
</script>

<template>
  <main>
    <form @submit="onSubmit">
      <FieldSet>
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="email">
            <Field :aria-invalid="!!errors.length">
              <FieldLabel for="email">Email</FieldLabel>
              <Input
                v-bind="field"
                id="email"
                type="email"
                placeholder="juandelacruz@gmail.com"
                :aria-invalid="!!errors.length"
              />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>
          <VeeField v-slot="{ field, errors }" name="password">
            <Field :aria-invalid="!!errors.length">
              <FieldLabel for="password">Password</FieldLabel>
              <Input
                v-bind="field"
                id="password"
                type="password"
                placeholder="********"
                :aria-invalid="!!errors.length"
              />
              <FieldError :errors="errors" />
            </Field>
          </VeeField>
          <Field orientation="horizontal">
            <Button>Login</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  </main>
</template>
