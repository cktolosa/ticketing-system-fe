<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { formatDate } from '@/lib/utils';

import { PriorityBadge, StatusBadge } from '@/modules/tickets/components';
import { type Ticket } from '@/modules/tickets/types';

withDefaults(
  defineProps<{
    open?: boolean;
    ticket: Ticket;
  }>(),
  {
    open: true,
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();
</script>

<template>
  <Collapsible
    :open="open"
    class="space-y-2 rounded-lg border p-5 shadow-sm"
    @update:open="emit('update:open', $event)"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">Details</h3>
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="icon" class="size-8">
          <ChevronDown
            class="size-4 transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
          <span class="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>

    <CollapsibleContent>
      <dl class="space-y-5 text-sm">
        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Assignee</dt>
          <dd class="flex items-center gap-2">
            <Avatar class="size-6">
              <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
              <AvatarFallback>{{ ticket.admin.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <span>{{ ticket.admin }}</span>
          </dd>
        </div>

        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Department</dt>
          <dd>{{ ticket.department }}</dd>
        </div>

        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Reporter</dt>
          <dd class="flex items-center gap-2">
            <Avatar class="size-6">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JR</AvatarFallback>
            </Avatar>
            <span>Jose Reyes</span>
          </dd>
        </div>

        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Status</dt>
          <dd><StatusBadge :status="ticket.status" /></dd>
        </div>

        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Priority</dt>
          <dd><PriorityBadge :priority="ticket.priority" /></dd>
        </div>

        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Created</dt>
          <dd>{{ formatDate(ticket.date) }}</dd>
        </div>

        <div class="flex items-start gap-3">
          <dt class="text-muted-foreground min-w-37.5">Resolved</dt>
          <dd class="text-muted-foreground">Not yet resolved</dd>
        </div>
      </dl>
    </CollapsibleContent>
  </Collapsible>
</template>
