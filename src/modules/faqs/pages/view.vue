<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Eye } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { UserAvatar } from '@/components/user-avatar';

import { formatDate, getErrorMessage } from '@/lib/utils';

import type { Faq } from '@/modules/faqs/types';
import { useAuthStore } from '@/stores/auth';

import { faqsApi, Tiptap } from '..';

const auth = useAuthStore();

const route = useRoute();
const faqId = String(route.params.id);
const isDialogOpen = ref(false);
const tiptapRef = ref();

const faq = ref<Faq | null>(null);
const fetchError = ref('');
const postError = ref('');
const fetchFaq = async () => {
  fetchError.value = '';
  try {
    const response = await faqsApi.getById(faqId);
    faq.value = response;
  } catch (error) {
    fetchError.value = getErrorMessage(error);
    faq.value = null;
  }
};

onMounted(fetchFaq);

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

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await faqsApi.update(faqId, {
      ...data,
      content_text: tiptapRef.value?.getText() ?? '',
    });
    isDialogOpen.value = false;
    resetForm();
    await fetchFaq();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

watch(isDialogOpen, (open) => {
  if (open) {
    resetForm({
      values: {
        title: faq.value?.title ?? '',
        content: faq.value?.content ?? '',
      },
    });
    postError.value = '';
  }
});
</script>

<template>
  <template v-if="fetchError">
    <p class="text-destructive py-5 text-center text-sm">
      {{ fetchError }}
    </p>
  </template>
  <template v-else>
    <div class="w-full p-5">
      <Card>
        <CardHeader>
          <CardTitle class="flex flex-row items-center justify-between gap-2">
            <div class="flex flex-col gap-y-1">
              <span class="text-xl leading-relaxed"> {{ faq?.title }}</span>
              <div class="text-muted-foreground flex items-center gap-1 text-sm">
                <Eye class="size-4" />
                {{ faq?.faq_views }} {{ faq?.faq_views === 1 ? 'view' : 'views' }}
              </div>
            </div>
          </CardTitle>
          <CardAction>
            <FormDialog
              v-if="auth.user?.role !== 'customer'"
              v-model:open="isDialogOpen"
              name="FAQ"
              content-class="max-h-[90vh] overflow-y-auto md:max-w-4xl"
              :post-error="postError"
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
            <UserAvatar
              :name="faq?.author?.name ?? ''"
              :subtitle="faq?.updated_at ? formatDate(faq?.updated_at) : ''"
              variant="md"
            />
          </div>
          <div v-dompurify-html="faq?.content" class="prose prose-sm max-w-none" />
        </CardContent>
      </Card>
    </div>
  </template>
</template>
