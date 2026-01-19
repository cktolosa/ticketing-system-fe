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
        'p-2 align-middle whitespace-nowrap last:text-end [&:has([role=checkbox])]:pr-0 [&:has(button[data-slot=dropdown-menu-trigger])]:text-center [&>[role=checkbox]]:translate-y-[2px]',
        props.class
      )
    "
  >
    <slot />
  </td>
</template>
