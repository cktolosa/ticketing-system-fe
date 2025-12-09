<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useField } from "vee-validate";
import { computed, useId } from "vue";
import { Textarea } from "@/components/ui/textarea";

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

    <Textarea
      :id
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? errorId : undefined"
      rows="5"
      v-bind="$attrs"
    />

    <FieldDescription v-if="description">{{ description }}</FieldDescription>
    <FieldError v-if="isInvalid" :id="errorId" :errors />
  </Field>
</template>
