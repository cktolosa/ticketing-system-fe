<script setup lang="ts">
import { computed, useId } from 'vue';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps<{
  label: string;
  placeholder: string;
  options: { id: number; name: string }[];
  errors: string[];
  modelValue: string | number;
  description?: string;
  disabled?: boolean;
}>();

const id = useId();
const errorId = `${id}-error`;

const isInvalid = computed(() => !!props.errors?.length);

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();
</script>

<template>
  <Field :data-invalid="isInvalid">
    <FieldLabel :for="id">{{ label }}</FieldLabel>
    <Select :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
      <SelectTrigger
        :disabled="disabled"
        :aria-invalid="isInvalid"
        :aria-describedby="isInvalid ? errorId : undefined"
      >
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="option in options" :key="option.id" :value="String(option.id)">
          {{ option.name }}
        </SelectItem>
      </SelectContent>
    </Select>
    <FieldDescription v-if="description">{{ description }}</FieldDescription>
    <FieldError v-if="isInvalid" :id="errorId" :errors="errors" />
  </Field>
</template>
