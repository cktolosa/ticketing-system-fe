import { watch } from 'vue';
import type { Ref } from 'vue';

export function useFormDialog<T extends Record<string, unknown>>(
  isOpen: Ref<boolean>,
  resetForm: (args: { values: T }) => void,
  getValues: () => T
) {
  watch(isOpen, (open) => {
    if (open) {
      resetForm({ values: getValues() });
    }
  });
}
