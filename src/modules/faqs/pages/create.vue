<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
import { Spinner } from '@/components/ui/spinner';

import { getErrorMessage, getRolePaths } from '@/lib/utils';

import { Tiptap } from '@/modules/faqs/components';
import { faqsApi } from '@/modules/faqs/services';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const postError = ref('');
const router = useRouter();
const faqSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters.')
    .max(100, 'Title must not exceed 100 characters.'),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters.')
    .max(10000, 'Content must not exceed 10,000 characters.'),
});

const defaultValues: z.infer<typeof faqSchema> = {
  title: '',
  content: '',
};

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(faqSchema),
  initialValues: defaultValues,
});

const tiptapRef = ref();
const handleCancel = () => {
  resetForm();
  tiptapRef.value?.reset();
};

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await faqsApi.create({
      ...data,
      content_text: tiptapRef.value?.getText() ?? '',
    });
    const basePath = getRolePaths[auth.user?.role?.name ?? ''];
    router.push(`${basePath}/faqs`);
  } catch (error) {
    postError.value = getErrorMessage(error);
    handleCancel();
  }
});
</script>

<template>
  <form class="w-full p-5" @submit="onSubmit">
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Create FAQ</FieldLegend>
        <FieldDescription> Provide the details below to create a new FAQ. </FieldDescription>
        <FieldError v-if="postError">{{ postError }}</FieldError>
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
          <Button type="submit" :disabled="isSubmitting">
            <Spinner v-if="isSubmitting" />
            {{ isSubmitting ? 'Saving' : 'Create' }}
          </Button>
        </div>
      </FieldSet>
    </FieldGroup>
  </form>
</template>
