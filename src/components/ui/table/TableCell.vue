<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <td
    data-slot="table-cell"
    :class="
      cn(
        'px-5 py-2 align-middle [&:has([role=checkbox])]:pr-0 [&:has(button[data-slot=dropdown-menu-trigger])]:text-center [&>[role=checkbox]]:translate-y-[2px]',
        'last:text-end',
        'data-empty:text-center',
        props.class
      )
    "
  >
    <slot />
  </td>
</template>
