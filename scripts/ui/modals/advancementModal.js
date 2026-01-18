import { openModal } from './modal.js';
import { categoryToActionType } from '../../rules/advancement.js';

const CATEGORY_LABELS = {
  feats: 'Feats',
  attacks: 'Attacks',
  specialSkills: 'Skills'
};

export function openAdvancementModal({ companionName, advancement, onConfirm }) {
  let selectedAbility = null;
  let selectedCategory = null;
  let selectedChoice = null;

  const body = document.createElement('div');
  const modal = openModal({
    title: `Advance ${companionName}`,
    body,
    confirmLabel: 'Confirm Advancement',
    cancelLabel: 'Cancel',
    onConfirm: () => {
      if (advancement.type === 'asi' && selectedAbility) {
        onConfirm({ type: 'asi', ability: selectedAbility });
      }
      if (advancement.type === 'choice' && selectedCategory && selectedChoice) {
        const actionType = categoryToActionType(selectedCategory);
        onConfirm({ type: actionType, value: selectedChoice });
      }
    }
  });

  modal.setConfirmEnabled(false);

  function renderAsi() {
    body.innerHTML = '';
    const hint = document.createElement('p');
    hint.textContent = 'Select one ability to increase by +1.';
    body.appendChild(hint);

    const grid = document.createElement('div');
    grid.className = 'option-grid';

    for (const option of advancement.abilityOptions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = `${option.label} (${option.score}, ${option.mod >= 0 ? '+' : ''}${option.mod})`;
      button.disabled = !option.canIncrease;
      if (selectedAbility === option.ability) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        selectedAbility = option.ability;
        modal.setConfirmEnabled(true);
        renderAsi();
      });
      grid.appendChild(button);
    }

    body.appendChild(grid);
  }

  function renderChoice() {
    body.innerHTML = '';
    const hint = document.createElement('p');
    hint.textContent = 'Choose a category, then select a specific option.';
    body.appendChild(hint);

    const categoryRow = document.createElement('div');
    categoryRow.className = 'option-row';

    for (const category of Object.keys(advancement.choices)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = CATEGORY_LABELS[category] || category;
      if (selectedCategory === category) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        selectedCategory = category;
        selectedChoice = null;
        modal.setConfirmEnabled(false);
        renderChoice();
      });
      categoryRow.appendChild(button);
    }

    body.appendChild(categoryRow);

    if (!selectedCategory) return;

    const list = advancement.choices[selectedCategory] || [];
    const options = document.createElement('div');
    options.className = 'option-grid';

    for (const option of list) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = option;
      if (selectedChoice === option) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        selectedChoice = option;
        modal.setConfirmEnabled(true);
        renderChoice();
      });
      options.appendChild(button);
    }

    body.appendChild(options);
  }

  if (advancement.type === 'asi') {
    renderAsi();
  } else {
    renderChoice();
  }
}
