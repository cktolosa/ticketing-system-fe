<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next';

import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';

import type { Attachment } from '../types';
import { useViewAttachmentDialogStore } from './view-attachment-dialog';

const props = defineProps<{
  attachment: Attachment;
}>();

const viewAttachmentDialogStore = useViewAttachmentDialogStore();

function handleClick() {
  viewAttachmentDialogStore.handleInitialize(props.attachment);
  viewAttachmentDialogStore.handleOpen();
}
</script>

<template>
  <Item
    variant="outline"
    class="hover:bg-muted cursor-pointer transition-colors"
    @click="handleClick"
  >
    <ItemMedia>
      <ImageIcon class="text-muted-foreground size-4" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>
        {{ attachment.filename }}
      </ItemTitle>
    </ItemContent>
  </Item>
</template>
