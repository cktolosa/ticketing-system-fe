<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'; 

import { Image } from 'lucide-vue-next';

export type Attachment = {
  filename: string;
  size: string;
};

defineProps<{
    attachments: Attachment[]
}>();
</script>

<template>
  <div v-if="attachments && attachments.length" class="space-y-3">
      <div 
        v-for="(attachment, index) in attachments" 
        :key="index"
        class="border rounded-md p-2 flex items-center gap-3"
      >
      <!-- use of image and icon for the mean time as preview -->
        <Image class="size-8 text-muted-foreground shrink-0" />
        <div class="flex flex-col min-w-0">
            <Dialog>
                <DialogTrigger as-child>
                    <span class="cursor-pointer text-sm font-medium truncate">{{ attachment.filename }}</span>
                </DialogTrigger>
                <DialogContent class="flex flex-col items-center justify-center">
                    <Image class="size-32 text-muted-foreground shrink-0" />
                    <p class="text-sm font-medium">{{ attachment.filename }}</p>
                </DialogContent>
            </Dialog>
            <p class="text-xs text-muted-foreground">{{ attachment.size }}</p>
        </div>
      </div>
    </div>
</template>