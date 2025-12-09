<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useField } from "vee-validate";
import { Input } from "@/components/ui/input";
import { computed, useId } from "vue";

const props = defineProps<{
  name: string;
  label: string;
  description?: string;
}>();

const { errors, meta } = useField(() => props.name);

const id = useId();
const errorId = `${id}-error`;

const isInvalid = computed(() => !!errors.value.length && !meta.valid);
</script>

<template>
  <Field :data-invalid="isInvalid">
    <FieldLabel :for="id">{{ label }}</FieldLabel>

    <Input
      v-bind="$attrs"
      :id
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? errorId : undefined"
    />

    <FieldDescription v-if="description">{{ description }}</FieldDescription>
    <FieldError v-if="isInvalid" :id="errorId" :errors />
  </Field>
</template>
