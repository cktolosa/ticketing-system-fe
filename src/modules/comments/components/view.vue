<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';

import { FormDialog } from '@/components/dialog';
import { Input } from '@/components/form';

import { getErrorMessage } from '@/lib/utils';

import { useFormDialog } from '@/composables/useFormDialog';

import { commentsApi } from '../services';
import type { Comment } from '../types';

const isDialogOpen = ref(false);
const postError = ref('');

const route = useRoute();
const ticketId = String(route.params.id);

const props = defineProps<{
  comment: Comment;
}>();

const commentSchema = z.object({
  comment: z.string().min(10, 'Comment must be at least 10 characters.'),
});

const defaultValues: z.infer<typeof commentSchema> = {
  comment: '',
};

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(commentSchema),
  initialValues: defaultValues,
});

const onSubmit = handleSubmit(async (data) => {
  try {
    await commentsApi.update(ticketId, props.comment.id, data);
    isDialogOpen.value = false;
    resetForm();
  } catch (error) {
    postError.value = getErrorMessage(error);
  }
});

useFormDialog(isDialogOpen, resetForm, () => ({
  comment: props.comment.comment ?? '',
}));
</script>

<template>
  <FormDialog
    v-model:open="isDialogOpen"
    name="comment"
    :is-submitting="isSubmitting"
    :post-error="postError"
    @submit="onSubmit"
  >
    <template #content>
      <VeeField v-slot="{ componentField }" name="comment">
        <Input v-bind="componentField" label="Comment" type="text" />
      </VeeField>
    </template>
  </FormDialog>
</template>
