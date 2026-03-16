<script setup lang="ts">
import { computed } from 'vue';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const props = withDefaults(
  defineProps<{
    name: string;
    src?: string;
    subtitle?: string;
    variant?: 'sm' | 'md';
    showName?: boolean;
  }>(),
  {
    src: undefined,
    subtitle: undefined,
    variant: 'sm',
    showName: true,
  }
);

const map = {
  sm: { avatar: 'size-8', fallback: 'text-xs', name: 'font-normal' },
  md: { avatar: 'size-10', fallback: 'text-sm', name: 'font-medium' },
};

const current = computed(() => map[props.variant]);
</script>

<template>
  <div class="flex items-center gap-2">
    <Avatar :class="current.avatar">
      <AvatarImage v-if="src" :src="src" :alt="name" />
      <AvatarFallback :class="current.fallback">
        {{
          name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        }}
      </AvatarFallback>
    </Avatar>
    <div class="flex flex-col text-sm">
      <span v-if="showName" :class="current.name">{{ name }}</span>
      <span class="text-muted-foreground">{{ subtitle }}</span>
    </div>
  </div>
</template>
