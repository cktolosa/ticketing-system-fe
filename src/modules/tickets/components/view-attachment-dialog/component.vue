<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useViewAttachmentDialogStore } from './store';

const viewAttachmentDialogStore = useViewAttachmentDialogStore();
const { isOpen, attachment } = storeToRefs(viewAttachmentDialogStore);
</script>

<template>
  <Dialog v-if="attachment" :open="isOpen" @update:open="viewAttachmentDialogStore.handleToggle">
    <DialogContent class="w-full md:max-w-5xl">
      <DialogHeader>
        <DialogTitle>View Attachment</DialogTitle>
      </DialogHeader>
      <div class="grid place-items-center">
        <img :src="`http://127.0.0.1:8000${attachment.file_path}`" class="w-full object-contain" />

        <p class="mt-3 text-sm font-medium">{{ attachment.file_name }}</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
