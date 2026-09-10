<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { getFileType } from '@/lib/utils';

import { useViewAttachmentDialogStore } from './store';

const viewAttachmentDialogStore = useViewAttachmentDialogStore();
const { isOpen, attachment } = storeToRefs(viewAttachmentDialogStore);

const src = computed(() => {
  if (!attachment.value) return '';
  if (attachment.value instanceof File) return URL.createObjectURL(attachment.value);
  return `http://127.0.0.1:8000${attachment.value.file_path}`;
});

const fileName = computed(() => {
  if (!attachment.value) return '';
  if (attachment.value instanceof File) return attachment.value.name;
  return attachment.value.file_name;
});

const fileType = computed(() => {
  if (!attachment.value) return '';
  if (attachment.value instanceof File) return attachment.value.type;
  return getFileType(attachment.value.file_name);
});
</script>

<template>
  <Dialog v-if="attachment" :open="isOpen" @update:open="viewAttachmentDialogStore.handleToggle">
    <DialogContent class="w-full md:max-w-5xl">
      <DialogHeader>
        <DialogTitle>View Attachment</DialogTitle>
      </DialogHeader>
      <div class="grid place-items-center">
        <img
          v-if="fileType.startsWith('image/')"
          :src="src"
          alt="Attachment"
          class="w-full object-contain"
        />
        <video v-else-if="fileType.startsWith('video/')" :src="src" controls class="w-full" />
        <iframe v-else-if="fileType === 'application/pdf'" :src="src" class="h-[70vh] w-full" />
        <p class="mt-3 text-sm font-medium">{{ fileName }}</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
