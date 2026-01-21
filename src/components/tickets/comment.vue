<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { computed, ref } from 'vue';
import * as z from 'zod';

import { Textarea } from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FieldDescription, FieldError } from '@/components/ui/field';
import { ItemGroup } from '@/components/ui/item';

import { formatDate } from '@/lib/utils';
import AttachmentItem from '@/modules/tickets/components/attachment-item.vue';
import type { Attachment } from '@/modules/tickets/types';

export type Comment = {
  id: number;
  author: string;
  timestamp: Date;
  comment: string;
  attachments?: Attachment[];
};

const commentSchema = z.object({
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters.')
    .max(50, 'Comment must not exceed 50 characters.'),
  picture: z
    .instanceof(File)
    .refine((file) => file.size <= 10_485_760, 'File must be less than 10MB.')
    .optional(),
});

const defaultValues: z.infer<typeof commentSchema> = {
  comment: '',
  picture: undefined,
};

const { handleSubmit, resetForm } = useForm({
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

const onSubmit = handleSubmit((data) => {
  alert(
    JSON.stringify({
      ...data,
      picture: data.picture
        ? {
            name: data.picture.name,
            size: data.picture.size,
            type: data.picture.type,
          }
        : undefined,
    })
  );
  handleCancel();
});

const props = defineProps<{
  comments: Comment[];
}>();

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
  <div class="space-y-2">
    <h3 class="text-sm font-semibold">Discussion</h3>
    <form class="space-y-3" @submit="onSubmit">
      <div class="flex items-start gap-3">
        <Avatar class="mt-3 size-8 shrink-0">
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div class="flex w-full flex-col gap-3">
          <VeeField v-slot="{ componentField }" name="comment">
            <Textarea
              v-bind="componentField"
              placeholder="Write your comments here..."
              class="w-full"
            />
          </VeeField>

          <VeeField v-slot="{ componentField, errors }" name="picture">
            <div class="space-y-1">
              <input
                v-bind="componentField"
                id="picture"
                ref="fileRef"
                type="file"
                accept="application/pdf,image/*,video/*"
                class="border-input flex h-10 w-full rounded-md border p-3 py-2.5 text-sm file:font-medium"
              />
              <FieldDescription>
                Accepts images, videos, and PDF documents (up to 10MB each).
              </FieldDescription>
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </VeeField>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" @click="handleCancel">Cancel</Button>
        <Button type="submit">Post</Button>
      </div>
    </form>

    <div class="space-y-4 pt-4">
      <div
        v-for="c in displayedComments"
        :key="c.id"
        class="border-b pb-4 last:border-b-0 last:pb-0"
      >
        <div class="flex gap-3">
          <Avatar class="size-8 shrink-0">
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>{{ c.author.charAt(0).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span class="text-sm font-medium">{{ c.author }}</span>
              <span class="text-muted-foreground text-xs">{{ formatDate(c.timestamp) }}</span>
            </div>
            <p class="text-sm leading-relaxed whitespace-pre-wrap">
              {{ c.comment }}
            </p>

            <ItemGroup v-if="c.attachments?.length" class="gap-y-2">
              <AttachmentItem
                v-for="(attachment, index) in c.attachments"
                :key="index"
                :attachment
              />
            </ItemGroup>
          </div>
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
