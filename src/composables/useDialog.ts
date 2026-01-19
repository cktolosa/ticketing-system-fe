import { ref } from 'vue';

export function useDialog() {
  const isOpen = ref(false);

  function handleOpen() {
    isOpen.value = true;
  }

  function handleClose() {
    isOpen.value = false;
  }

  function handleToggle() {
    isOpen.value = !isOpen.value;
  }

  return {
    isOpen,
    handleOpen,
    handleClose,
    handleToggle,
  };
}
