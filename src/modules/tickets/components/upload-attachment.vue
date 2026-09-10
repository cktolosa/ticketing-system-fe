<script setup lang="ts">
import { Upload, X } from 'lucide-vue-next';
import { type FieldBindingObject } from 'vee-validate';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { getFileIcon } from '@/lib/utils';

import { useViewAttachmentDialogStore } from '.';

const props = defineProps<{
  field: FieldBindingObject<File[]>;
  maxFiles: number;
}>();

const viewAttachmentDialogStore = useViewAttachmentDialogStore();

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  const combined = [...(props.field.value || []), ...files];

  if (combined.length > props.maxFiles) {
    props.field.onChange(combined.slice(0, props.maxFiles));
  } else {
    props.field.onChange(combined);
  }
};

const removeFile = (index: number) => {
  const files = props.field.value || [];
  const filtered = files.filter((_file: File, i: number) => i !== index);
  props.field.onChange(filtered);
};

const handlePreview = (file: File) => {
  viewAttachmentDialogStore.handleInitialize(file);
  viewAttachmentDialogStore.handleOpen();
}; 

const isInvalidFile = (file: File) => 
  file.size > 52428800 || 
  (!file.type.startsWith('image/') && 
   !file.type.startsWith('video/') && 
   file.type !== 'application/pdf');

</script>
<template>
  <input
    :id="`${field.name}-input`"
    :key="field.value?.length"
    type="file"
    multiple
    accept="application/pdf,image/*,video/*"
    class="hidden"
    :disabled="(field.value?.length ?? 0) >= maxFiles"
    @change="handleFileChange"
  />
  <Label :for="`${field.name}-input`">
    <Button
      type="button"
      variant="outline"
      class="w-full justify-start text-left"
      :disabled="(field.value?.length ?? 0) >= maxFiles"
      as-child
    >
      <span>
        <Upload class="mr-2 h-4 w-4" />
        {{ (field.value?.length ?? 0) >= maxFiles ? 'Maximum files reached' : 'Choose Files' }}
      </span>
    </Button>
  </Label>

  <div v-if="field.value && field.value.length > 0" class="mt-3 space-y-2">
    <Card
      v-for="(file, index) in field.value"
      :key="`${file.name}-${index}`"
      :class="isInvalidFile(file) ? 'border-destructive bg-red-50' : 'cursor-pointer'"
      @click="handlePreview(file)"
    >
      <CardContent class="flex items-center justify-between p-3">
        <div class="flex items-center gap-3">
          <component :is="getFileIcon(file.name)" class="text-muted-foreground h-8 w-8" />
          <div class="flex flex-col">
            <p class="truncate text-sm font-medium">
              {{ file.name }}
            </p>
            <p class="truncate text-xs font-medium">{{ (file.size / 1048576).toFixed(2) }} MB</p>
          </div>
        </div>
        <Button type="button" variant="ghost" @click.stop="removeFile(+index)">
          <X />
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
