<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import { computed } from 'vue';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    name: string;
    title?: string;
    description?: string;
    open?: boolean;
    submitText?: string;
    contentClass?: string;
    postError: string;
    isSubmitting: boolean;
  }>(),
  {
    open: false,
    submitText: 'Update',
    contentClass: '',
    title: undefined,
    description: undefined,
  }
);

const defaultTitle = computed(() => props.title ?? `Update ${props.name}`);

const defaultDescription = computed(
  () =>
    props.description ?? `Make changes to the ${props.name} here. Click update when you are done.`
);

const emit = defineEmits<{
  submit: [];
  'update:open': [value: boolean];
  'clear-error': [];
}>();

const handleSubmit = () => {
  emit('submit');
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger">
        <Button variant="ghost">
          <Pencil class="size-4" />
          Edit
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent
      :class="cn('flex flex-col gap-y-5', contentClass)"
      @interact-outside="(e) => e.preventDefault()"
    >
      <DialogHeader>
        <DialogTitle class="capitalize">{{ defaultTitle }}</DialogTitle>
        <DialogDescription>
          {{ defaultDescription }}
        </DialogDescription>
      </DialogHeader>

      <form id="dialogForm" @submit.prevent="handleSubmit" @input="emit('clear-error')">
        <slot name="content" />
      </form>

      <p v-if="postError" class="text-destructive text-sm">
        {{ postError }}
      </p>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="outline"> Cancel </Button>
        </DialogClose>
        <Button :disabled="isSubmitting" type="submit" form="dialogForm">
          <Spinner v-if="isSubmitting" />
          {{ isSubmitting ? 'Saving' : submitText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
