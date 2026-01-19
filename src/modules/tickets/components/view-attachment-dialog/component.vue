<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useViewAttachmentDialogStore } from './store';

const viewAttachmentDialogStore = useViewAttachmentDialogStore();
const { isOpen, attachment } = storeToRefs(viewAttachmentDialogStore);
</script>

<template>
  <Dialog v-if="attachment" :open="isOpen" @update:open="viewAttachmentDialogStore.handleToggle">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View Attachment</DialogTitle>
        <DialogDescription> some short but concise description here </DialogDescription>
      </DialogHeader>
      <div class="grid place-items-center">
        <ImageIcon class="text-muted-foreground size-32 shrink-0" />
        <p class="text-sm font-medium">{{ attachment.filename }}</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
