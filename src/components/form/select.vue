<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps<{
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
}>();

const { errors, meta } = useField(() => props.name);

const id = useId();
const errorId = `${id}-error`;

const isInvalid = computed(() => !!errors.value.length && !meta.valid);
</script>

<template>
  <Field :data-invalid="isInvalid">
    <FieldLabel :for="id">{{ label }}</FieldLabel>
    <Select v-bind="$attrs">
      <SelectTrigger>
        <SelectValue :placeholder />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup v-if="options && options.length > 0">
          <SelectItem v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectGroup>
        <slot v-else />
      </SelectContent>
    </Select>

    <FieldDescription v-if="description">{{ description }}</FieldDescription>
    <FieldError v-if="isInvalid" :id="errorId" :errors />
  </Field>
</template>
