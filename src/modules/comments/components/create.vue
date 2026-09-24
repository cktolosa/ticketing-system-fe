<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { Textarea } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError } from '@/components/ui/field';
import { UserAvatar } from '@/components/user-avatar';

import { formatDate, getErrorMessage } from '@/lib/utils';

// waiting for photo object
import { AttachmentItem, UploadAttachment } from '@/modules/tickets/components';

import { commentsApi } from '../services';
import type { Comment } from '../types.ts';
import { ViewComment } from './index.ts';

const postError = ref('');
const route = useRoute();
const ticketId = String(route.params.id);

const commentSchema = z.object({
  comment: z.string().min(10, 'Comment must be at least 10 characters.'),
  photo: z
    .array(z.instanceof(File))
    .max(1, 'You can only upload 1 file.')
    .refine((files) => files.every((file) => file.size <= 52428800), 'File must be less than 50MB.')
    .refine(
      (files) =>
        files.every((file) => {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          const isPDF = file.type === 'application/pdf';
          return isImage || isVideo || isPDF;
        }),
      'Only image, video, and PDF files are allowed.'
    )
    .optional(),
});

const defaultValues: z.infer<typeof commentSchema> = {
  comment: '',
  photo: undefined,
};

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(commentSchema),
  initialValues: defaultValues,
});

const fileRef = ref<HTMLInputElement | null>(null);
const handleCancel = () => {
  resetForm();
  if (fileRef.value) {
    fileRef.value.value = '';
  }
};

const onSubmit = handleSubmit(async (data) => {
  postError.value = '';
  try {
    await commentsApi.create(ticketId, data);
  } catch (error) {
    postError.value = getErrorMessage(error);
    handleCancel();
  }
});

const props = withDefaults(
  defineProps<{
    name: string;
    comments?: Comment[];
  }>(),
  {
    comments: () => [],
  }
);

const showAll = ref(false);
const limit = 2;

const displayedComments = computed(() => {
  if (showAll.value || props.comments.length <= limit) {
    return props.comments;
  }
  return props.comments.slice(0, limit);
});

const hasMore = computed(() => props.comments.length > limit);
</script>

<template>
  <div>
    <h3 class="font-medium">Discussion</h3>
    <form class="space-y-3" @submit="onSubmit">
      <VeeField v-slot="{ componentField }" name="comment">
        <Textarea v-bind="componentField" :placeholder="`Comment as ${name}`" class="w-full" />
      </VeeField>
      <VeeField v-slot="{ field, errors }" name="photo">
        <Field>
          <UploadAttachment :field="field" :max-files="1" />
          <FieldDescription>
            Maximum 1 file. Accepts images, videos, and PDF documents (up to 50MB).
          </FieldDescription>

          <FieldError v-if="errors" :errors="errors" />
          <FieldError v-if="postError">{{ postError }}</FieldError>
        </Field>
      </VeeField>

      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" @click="handleCancel">Cancel</Button>
        <Button type="submit" :disabled="isSubmitting">{{
          isSubmitting ? 'Posting' : 'Post'
        }}</Button>
      </div>
    </form>

    <div class="space-y-4 pt-4">
      <div
        v-for="comment in displayedComments"
        :key="comment.id"
        class="border-b pb-4 last:border-b-0 last:pb-0"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <div class="flex flex-row justify-between gap-5">
            <UserAvatar
              :src="comment.user?.avatar?.urls?.full"
              :name="comment.user?.name ?? ''"
              :subtitle="formatDate(comment.updated_at)"
            />
            <ViewComment :comment="comment" />
          </div>

          <p class="text-sm leading-relaxed whitespace-pre-wrap">
            {{ comment.comment }}
          </p>
          <!-- waiting for photo object -->
          <!-- <AttachmentItem v-if="comment.photo" :attachment="comment.photo" /> -->
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="flex justify-center pt-2">
      <Button variant="ghost" @click="showAll = !showAll">
        {{ showAll ? 'Show less' : `Show all (${comments.length})` }}
      </Button>
    </div>

    <div v-if="!comments.length" class="text-muted-foreground py-8 text-center text-sm">
      No comments yet.
    </div>
  </div>
</template>
