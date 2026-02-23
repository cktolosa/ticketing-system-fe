<script setup lang="ts">
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import {
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-vue-next';
import { onBeforeUnmount, ref, watch } from 'vue';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editor = useEditor({
  content: props.modelValue,
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML());
  },
  extensions: [
    Placeholder.configure({
      placeholder: 'Write something...',
      emptyEditorClass: 'is-editor-empty',
    }),
    StarterKit.configure({
      link: {
        openOnClick: false,
        autolink: true,
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'p-3 prose max-w-none min-h-[200px] max-h-[500px] overflow-y-auto',
    },
  },
});

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value?.getHTML() === value) return;
    editor.value?.commands.setContent(value);
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const link = ref('');

const setLink = () => {
  if (!link.value) {
    editor.value?.chain().focus().unsetLink().run();
    return;
  }
  editor.value?.chain().focus().setLink({ href: link.value }).run();
  link.value = '';
};

const onPopoverOpen = (open: boolean) => {
  if (open) {
    link.value = editor.value?.getAttributes('link').href ?? '';
  }
};

defineExpose({
  reset() {
    editor.value?.commands.clearContent(true);
  },
});

const toolbar = [
  {
    icon: Heading1,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 1 }),
  },
  {
    icon: Heading2,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 2 }),
  },
  {
    icon: Heading3,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 3 }),
  },
  {
    icon: Bold,
    action: () => editor.value?.chain().focus().toggleBold().run(),
    isActive: () => editor.value?.isActive('bold'),
  },
  {
    icon: Italic,
    action: () => editor.value?.chain().focus().toggleItalic().run(),
    isActive: () => editor.value?.isActive('italic'),
  },
  {
    icon: Underline,
    action: () => editor.value?.chain().focus().toggleUnderline().run(),
    isActive: () => editor.value?.isActive('underline'),
  },
  {
    icon: Strikethrough,
    action: () => editor.value?.chain().focus().toggleStrike().run(),
    isActive: () => editor.value?.isActive('strike'),
  },
  {
    icon: List,
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value?.isActive('bulletList'),
  },
  {
    icon: ListOrdered,
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value?.isActive('orderedList'),
  },
  {
    icon: Eraser,
    action: () => editor.value?.chain().focus().unsetAllMarks().clearNodes().run(),
    isActive: () => false,
  },
];
</script>

<template>
  <Field>
    <FieldLabel>Content</FieldLabel>
    <div class="rounded-md border">
      <div class="flex flex-wrap gap-1 border-b p-2">
        <template v-for="bar in toolbar" :key="bar.icon.name">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            :class="{ 'bg-secondary': bar.isActive() }"
            @click="bar.action"
          >
            <component :is="bar.icon" class="size-4" />
          </Button>
        </template>

        <Popover @update:open="onPopoverOpen">
          <PopoverTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              :class="{ 'bg-secondary': editor?.isActive('link') }"
            >
              <Link class="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="flex max-w-xs flex-col gap-y-3">
            <Input v-model="link" label="Link" type="url" placeholder="https://example.com" />
            <Button type="button" @click="setLink">Apply</Button>
          </PopoverContent>
        </Popover>
      </div>

      <editor-content :editor="editor" />
    </div>
  </Field>
</template>
