import { openModal } from './modal.js';

export function openThemeModal({ themes, currentTheme, onConfirm, onCancel }) {
  const body = document.createElement('div');
  body.className = 'option-list';

  let selectedTheme = currentTheme;
  const buttons = new Map();

  const modal = openModal({
    title: 'Theme Settings',
    body,
    confirmLabel: 'Apply Theme',
    cancelLabel: 'Cancel',
    onConfirm: () => {
      if (!selectedTheme) return;
      onConfirm?.(selectedTheme);
    },
    onCancel
  });

  modal.setConfirmEnabled(Boolean(selectedTheme));

  for (const theme of themes) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-button';
    button.textContent = theme.label || theme.id;
    if (theme.id === selectedTheme) {
      button.classList.add('is-selected');
    }
    button.addEventListener('click', () => {
      selectedTheme = theme.id;
      modal.setConfirmEnabled(true);
      for (const [id, entry] of buttons.entries()) {
        entry.classList.toggle('is-selected', id === selectedTheme);
      }
    });
    buttons.set(theme.id, button);
    body.appendChild(button);
  }
}
