import { openModal } from './modal.js';

export function openConfirmModal({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm }) {
  const body = document.createElement('p');
  body.textContent = message;

  return openModal({
    title,
    body,
    confirmLabel,
    cancelLabel,
    onConfirm
  });
}
