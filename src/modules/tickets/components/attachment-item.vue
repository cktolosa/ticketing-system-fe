<script setup lang="ts">
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';

import { getFileIcon } from '@/lib/utils';

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
      <component :is="getFileIcon(attachment.file_type)" class="text-muted-foreground h-8 w-8" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>
        {{ attachment.file_name }}
      </ItemTitle>
    </ItemContent>
  </Item>
</template>
