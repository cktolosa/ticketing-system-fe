<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';

import { Tiptap } from '@/modules/faqs/components';

const faqSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters.')
    .max(50, 'Title must not exceed 50 characters.'),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters.')
    .max(10000, 'Content must not exceed 10,000 characters.'),
});

const defaultValues: z.infer<typeof faqSchema> = {
  title: '',
  content: '',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(faqSchema),
  initialValues: defaultValues,
});

const tiptapRef = ref();

const handleCancel = () => {
  resetForm();
  tiptapRef.value?.reset();
};

const onSubmit = handleSubmit((data) => {
  alert(JSON.stringify(data));
  handleCancel();
});
</script>

<template>
  <form class="w-full p-5" @submit="onSubmit">
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Create a FAQ</FieldLegend>
        <FieldDescription> Provide the details below to create a new FAQ. </FieldDescription>

        <VeeField v-slot="{ componentField }" name="title">
          <Input
            v-bind="componentField"
            label="Title"
            type="text"
            placeholder="Describe the subject of the article."
          />
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="content">
          <Tiptap ref="tiptapRef" :model-value="field.value" @update:model-value="field.onChange" />
          <FieldError :errors="errors" />
        </VeeField>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" @click="handleCancel"> Cancel </Button>
          <Button type="submit">Create</Button>
        </div>
      </FieldSet>
    </FieldGroup>
  </form>
</template>
