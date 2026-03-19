<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Eye } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref, watch } from 'vue';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { UserAvatar } from '@/components/user-avatar';

import { formatDate } from '@/lib/utils';

import { Tiptap } from '@/modules/faqs/components';
import type { Faq } from '@/modules/faqs/types';

const faq: Faq = {
  updated_at: new Date('2025-12-02'),
  author: 'Carlos Mendoza',
  title: 'AIT Audit Monthly Schedule Process',
  content:
    'The AIT Audit Monthly Schedule Process outlines the steps to plan, track, and execute monthly audits efficiently. It ensures all audit activities are completed on time and provides a standardized approach for reporting and review.',
};

const isDialogOpen = ref(false);
const tiptapRef = ref();

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
  title: faq.title,
  content: faq.content ?? '',
};

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(faqSchema),
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
    <Card>
      <CardHeader>
        <CardTitle class="flex flex-row items-center justify-between gap-2">
          <div class="flex flex-col gap-y-1">
            <span class="text-xl leading-relaxed"> {{ faq.title }}</span>
            <div class="text-muted-foreground flex items-center gap-1 text-sm">
              <Eye class="size-4" />
              232 views
            </div>
          </div>
        </CardTitle>
        <CardAction>
          <FormDialog
            v-model:open="isDialogOpen"
            name="FAQ"
            content-class="max-h-[90vh] overflow-y-auto md:max-w-4xl"
            @submit="onSubmit"
          >
            <template #content>
              <FieldGroup>
                <FieldSet>
                  <VeeField v-slot="{ componentField }" name="title">
                    <Input v-bind="componentField" label="Title" type="text" />
                  </VeeField>
                  <VeeField v-slot="{ field, errors }" name="content">
                    <Tiptap
                      ref="tiptapRef"
                      :model-value="field.value"
                      @update:model-value="field.onChange"
                    />
                    <FieldError :errors="errors" />
                  </VeeField>
                </FieldSet>
              </FieldGroup>
            </template>
          </FormDialog>
        </CardAction>
      </CardHeader>

      <CardContent class="flex flex-col gap-y-4">
        <div class="flex items-center gap-2">
          <UserAvatar :name="faq.author" :subtitle="formatDate(faq.updated_at)" variant="md" />
        </div>
        <p class="text-sm leading-relaxed">
          {{ faq.content }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
