<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId, useSlots } from 'vue';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const props = defineProps<{
  name: string;
  label: string;
  description?: string;
}>();

const { errors, meta } = useField(() => props.name);

const id = useId();
const errorId = `${id}-error`;

const isInvalid = computed(() => !!errors.value.length && !meta.valid);

const slots = useSlots();
</script>

<template>
  <Field :data-invalid="isInvalid">
    <FieldLabel :for="id">{{ label }}</FieldLabel>
    <div class="relative">
      <Input
        :id
        :aria-invalid="isInvalid"
        :aria-describedby="isInvalid ? errorId : undefined"
        v-bind="$attrs"
        :class="slots.append ? 'pr-12' : ''"
      />

      <div v-if="slots.append" class="absolute top-1/2 right-2 -translate-y-1/2">
        <slot name="append" />
      </div>
    </div>

    <FieldDescription v-if="description">{{ description }}</FieldDescription>
    <FieldError v-if="isInvalid" :id="errorId" :errors />
  </Field>
</template>
