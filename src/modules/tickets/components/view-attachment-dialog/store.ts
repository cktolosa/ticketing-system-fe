import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useDialog } from '@/composables/useDialog';

import type { Attachment } from '../../types';

export const useViewAttachmentDialogStore = defineStore('view-attachment-dialog', () => {
  // dialog state & controls
  const { isOpen, handleOpen, handleClose, handleToggle } = useDialog();

  // initializing attachment
  const attachment = ref<Attachment | null>();

  function handleInitialize(payload: Attachment) {
    attachment.value = payload;
  }

  function handleClear() {
    attachment.value = null;
  }

  function storeHandleToggle() {
    handleClear();
    handleToggle();
  }

  return {
    isOpen,
    handleOpen,
    handleClose,
    // overwriting `useDialog`'s handleToggle with the local's storeHandleToggle
    // since I do not want to think of another name for `handleToggle`
    handleToggle: storeHandleToggle,

    attachment,
    handleInitialize,
    handleClear,
  };
});
