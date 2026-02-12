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

import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    name: string;
    // eslint-disable-next-line vue/require-default-prop
    title?: string;
    // eslint-disable-next-line vue/require-default-prop
    description?: string;
    open?: boolean;
    submitText?: string;
    contentClass?: string;
  }>(),
  {
    open: false,
    submitText: 'Update',
    contentClass: '',
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
      :class="cn('space-y-5', contentClass)"
      @interact-outside="(e) => e.preventDefault()"
    >
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>{{ defaultTitle }}</DialogTitle>
          <DialogDescription>
            {{ defaultDescription }}
          </DialogDescription>
        </DialogHeader>
        <slot name="content" />

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit"> {{ submitText }} </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
