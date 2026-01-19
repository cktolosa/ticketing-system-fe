<script setup lang="ts">
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ImageIcon } from "lucide-vue-next";
import type { Attachment } from "../types";
import { useViewAttachmentDialogStore } from "./view-attachment-dialog";

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
    class="cursor-pointer hover:bg-muted transition-colors"
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
