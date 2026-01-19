function ensureModalRoot() {
  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }
  return root;
}

export function openModal({
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  className,
  extraActions = []
}) {
  const root = ensureModalRoot();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';
  if (className) {
    modal.classList.add(className);
  }

  const header = document.createElement('div');
  header.className = 'modal-header';
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  header.appendChild(titleEl);

  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal-body';
  if (body) bodyEl.appendChild(body);

  const footer = document.createElement('div');
  footer.className = 'modal-footer';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'button-secondary button-icon';
  const cancelIcon = document.createElement('span');
  cancelIcon.className = 'icon icon-close';
  cancelIcon.setAttribute('aria-hidden', 'true');
  const cancelText = document.createTextNode(cancelLabel);
  cancelBtn.append(cancelIcon, cancelText);

  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.className = 'button-primary';
  confirmBtn.textContent = confirmLabel;

  const actionButtons = Array.isArray(extraActions) ? extraActions : [];
  const extraButtons = actionButtons.map((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = action.className || 'button-secondary';
    button.textContent = action.label || 'Action';
    button.disabled = Boolean(action.disabled);
    button.addEventListener('click', () => {
      if (button.disabled) return;
      const result = action.onClick?.();
      if (result === false) return;
      close();
    });
    return button;
  });

  footer.append(cancelBtn, ...extraButtons, confirmBtn);
  modal.append(header, bodyEl, footer);
  overlay.appendChild(modal);
  root.appendChild(overlay);

  function close() {
    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
  }

  function onOverlayClick(event) {
    if (event.target === overlay) {
      onCancel?.();
      close();
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onCancel?.();
      close();
    }
  }

  cancelBtn.addEventListener('click', () => {
    onCancel?.();
    close();
  });

  confirmBtn.addEventListener('click', () => {
    if (confirmBtn.disabled) return;
    onConfirm?.();
    close();
  });

  overlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onKeyDown);

  return {
    setConfirmEnabled(enabled) {
      confirmBtn.disabled = !enabled;
    },
    setExtraEnabled(index, enabled) {
      const button = extraButtons[index];
      if (!button) return;
      button.disabled = !enabled;
    },
    setBody(newBody) {
      bodyEl.innerHTML = '';
      if (newBody) bodyEl.appendChild(newBody);
    }
  };
}
