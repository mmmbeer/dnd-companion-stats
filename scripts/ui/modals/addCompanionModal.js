import { openModal } from './modal.js';
import { getRandomCompanionName } from '../../data/nameRandomizer.js';

function clampLevel(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) return null;
  return Math.min(20, Math.max(1, Math.floor(level)));
}

export function openAddCompanionModal({
  types,
  defaultTypeId,
  defaultName,
  defaultPlayerLevel,
  nameForType,
  onConfirm
}) {
  const sortedTypes = [...types].sort((a, b) => a.name.localeCompare(b.name));
  let selectedTypeId = defaultTypeId || sortedTypes[0]?.id || '';
  let nameTouched = false;

  const body = document.createElement('div');
  body.className = 'modal-form';

  const typeField = document.createElement('label');
  typeField.className = 'field';
  const typeLabel = document.createElement('span');
  typeLabel.textContent = 'Type';
  const typeSelect = document.createElement('select');
  for (const type of sortedTypes) {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    if (type.id === selectedTypeId) {
      option.selected = true;
    }
    typeSelect.appendChild(option);
  }
  typeField.append(typeLabel, typeSelect);

  const nameField = document.createElement('label');
  nameField.className = 'field';
  const nameLabel = document.createElement('span');
  nameLabel.textContent = 'Name';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.maxLength = 40;
  nameInput.value = defaultName || '';
  nameField.append(nameLabel, nameInput);

  const nameRow = document.createElement('div');
  nameRow.className = 'field-row';
  nameRow.append(nameField);

  const randomizeNameButton = document.createElement('button');
  randomizeNameButton.type = 'button';
  randomizeNameButton.className = 'button-secondary';
  randomizeNameButton.textContent = 'Randomize';
  nameRow.append(randomizeNameButton);

  const levelField = document.createElement('label');
  levelField.className = 'field';
  const levelLabel = document.createElement('span');
  levelLabel.textContent = 'Player Level';
  const levelInput = document.createElement('input');
  levelInput.type = 'number';
  levelInput.min = '1';
  levelInput.max = '20';
  levelInput.value = String(defaultPlayerLevel ?? 1);
  levelField.append(levelLabel, levelInput);

  body.append(typeField, nameRow, levelField);

  const modal = openModal({
    title: 'Add Companion',
    body,
    confirmLabel: 'Add Companion',
    cancelLabel: 'Cancel',
    onConfirm: () => {
      const trimmedName = nameInput.value.trim();
      const level = clampLevel(levelInput.value);
      if (!selectedTypeId || !trimmedName || level === null) return;
      onConfirm?.({
        typeId: selectedTypeId,
        name: trimmedName,
        playerLevel: level
      });
    }
  });

  function updateConfirmState() {
    const trimmedName = nameInput.value.trim();
    const level = clampLevel(levelInput.value);
    modal.setConfirmEnabled(Boolean(selectedTypeId && trimmedName && level !== null));
  }

  typeSelect.addEventListener('change', (event) => {
    selectedTypeId = event.target.value;
    if (!nameTouched) {
      if (nameForType) {
        nameInput.value = nameForType(selectedTypeId);
      } else {
        const type = sortedTypes.find((entry) => entry.id === selectedTypeId);
        if (type) {
          nameInput.value = type.name;
        }
      }
    }
    updateConfirmState();
  });

  nameInput.addEventListener('input', () => {
    nameTouched = true;
    updateConfirmState();
  });

  randomizeNameButton.addEventListener('click', () => {
    const randomName = getRandomCompanionName(selectedTypeId)
      ?? nameForType?.(selectedTypeId)
      ?? '';
    if (!randomName) return;
    nameInput.value = randomName;
    nameTouched = true;
    updateConfirmState();
  });

  levelInput.addEventListener('input', updateConfirmState);

  updateConfirmState();
}
