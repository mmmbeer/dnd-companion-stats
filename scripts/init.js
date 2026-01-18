import {
  createCompanionInstance,
  createDefaultState,
  getActiveCompanion,
  getNextCompanionId
} from './core/state.js';
import { loadState, saveState } from './core/storage.js';
import { validateState } from './core/validation.js';
import { loadCompanionTypes } from './companions/loader.js';
import { getCompanionType } from './companions/registry.js';
import { applyAdvancement } from './rules/advancement.js';
import { buildCompanionView } from './rules/view.js';
import { renderAbilities } from './ui/renderAbilities.js';
import { renderAdvancement } from './ui/renderAdvancement.js';
import { renderStats } from './ui/renderStats.js';
import { renderSkills } from './ui/renderSkills.js';
import { renderFeatures } from './ui/renderFeatures.js';
import { openConfirmModal } from './ui/modals/confirmModal.js';

const AVAILABLE_THEMES = new Set([
  'arcane-midnight',
  'feywild-verdancy',
  'astral-ember',
  'void-sapphire',
  'relic-stone'
]);

let state = null;
let defaultCompanionTypeId = null;
let companionSelect = null;
let companionNameInput = null;
let newCompanionButton = null;
let deleteCompanionButton = null;

function render() {
  const companion = getActiveCompanion(state);
  const companionType = getCompanionType(companion.type);
  if (!companionType) {
    console.error('Unknown companion type:', companion.type);
    return;
  }
  const view = buildCompanionView(state, companion, companionType);
  renderCompanionRoster();
  renderAbilities(view);
  renderSkills(view);
  renderStats(view);
  renderFeatures(view);
  renderAdvancement(view, (action) => applyAdvancementAction(companion, companionType, action));
  saveState(state, { validateState });
}

function applyAdvancementAction(companion, companionType, action) {
  const result = applyAdvancement(
    companion,
    companionType,
    state.player.level,
    action
  );
  if (!result.ok) {
    console.error(result.error);
    return;
  }
  companion.advancementHistory[state.player.level] = result.entry;
  render();
}

function ensureTheme() {
  if (!AVAILABLE_THEMES.has(state.theme)) {
    state.theme = 'arcane-midnight';
  }
  document.documentElement.dataset.theme = state.theme;
}

function formatCompanionOption(companion) {
  const typeName = getCompanionType(companion.type)?.name || companion.type;
  return `${companion.name} - ${typeName}`;
}

function getBaseCompanionName(typeId) {
  const typeName = getCompanionType(typeId)?.name || 'Companion';
  return typeName;
}

function getNumberedCompanionName(typeId, index) {
  return `${getBaseCompanionName(typeId)} ${index}`;
}

function pruneAdvancementHistory(level) {
  for (const companion of Object.values(state.companions)) {
    if (!companion.advancementHistory) continue;
    for (const entryLevel of Object.keys(companion.advancementHistory)) {
      const numericLevel = Number(entryLevel);
      if (Number.isFinite(numericLevel) && numericLevel >= level) {
        delete companion.advancementHistory[entryLevel];
      }
    }
  }
}

function renderCompanionRoster() {
  if (!companionSelect || !companionNameInput || !newCompanionButton || !deleteCompanionButton) {
    return;
  }

  const companions = Object.values(state.companions);
  companionSelect.innerHTML = '';
  for (const companion of companions) {
    const option = document.createElement('option');
    option.value = companion.id;
    option.textContent = formatCompanionOption(companion);
    companionSelect.appendChild(option);
  }
  companionSelect.value = state.activeCompanionId;

  const activeCompanion = getActiveCompanion(state);
  companionNameInput.value = activeCompanion.name;

  deleteCompanionButton.disabled = companions.length <= 1;
}

function setupCompanionControls() {
  companionSelect = document.getElementById('companionSelect');
  companionNameInput = document.getElementById('companionName');
  newCompanionButton = document.getElementById('newCompanion');
  deleteCompanionButton = document.getElementById('deleteCompanion');

  companionSelect.onchange = (event) => {
    state.activeCompanionId = event.target.value;
    render();
  };

  companionNameInput.oninput = (event) => {
    const activeCompanion = getActiveCompanion(state);
    const trimmed = event.target.value.trim();
    activeCompanion.name = trimmed || getBaseCompanionName(activeCompanion.type);
    const selectedOption = companionSelect.options[companionSelect.selectedIndex];
    if (selectedOption) {
      selectedOption.textContent = formatCompanionOption(activeCompanion);
    }
    saveState(state, { validateState });
  };

  newCompanionButton.onclick = () => {
    const nextId = getNextCompanionId(state);
    const index = Number(nextId.split('-')[1]) || Object.keys(state.companions).length + 1;
    const name = getNumberedCompanionName(defaultCompanionTypeId, index);
    const companion = createCompanionInstance(nextId, defaultCompanionTypeId, name);
    state.companions[nextId] = companion;
    state.activeCompanionId = nextId;
    render();
  };

  deleteCompanionButton.onclick = () => {
    const companionIds = Object.keys(state.companions);
    if (companionIds.length <= 1) return;
    const activeId = state.activeCompanionId;
    const activeName = state.companions[activeId]?.name || 'this companion';
    openConfirmModal({
      title: 'Delete Companion',
      message: `Delete ${activeName}? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        delete state.companions[activeId];
        const remainingIds = Object.keys(state.companions);
        state.activeCompanionId = remainingIds[0];
        render();
      }
    });
  };
}

async function init() {
  let loadResult = null;
  try {
    loadResult = await loadCompanionTypes();
  } catch (error) {
    console.error('Failed to load companion types.', error);
    return;
  }

  defaultCompanionTypeId = loadResult.defaultCompanionTypeId;
  const defaultType = getCompanionType(defaultCompanionTypeId);
  if (!defaultCompanionTypeId || !defaultType) {
    console.error('No default companion type available.');
    return;
  }
  const defaultName = defaultType?.name || 'Companion';
  const defaultState = createDefaultState(defaultCompanionTypeId, defaultName);

  state = loadState(defaultState, {
    migration: {
      defaultCompanionType: defaultType,
      defaultCompanionTypeId
    },
    validateState
  });

  ensureTheme();
  setupCompanionControls();

  const playerLevelInput = document.getElementById('playerLevel');
  playerLevelInput.value = state.player.level;
  playerLevelInput.oninput = (event) => {
    const nextLevel = Number(event.target.value);
    if (!Number.isFinite(nextLevel)) return;
    state.player.level = nextLevel;
    pruneAdvancementHistory(nextLevel);
    render();
  };

  const themeSelect = document.getElementById('themeSelect');
  themeSelect.value = state.theme;
  themeSelect.onchange = (event) => {
    state.theme = event.target.value;
    ensureTheme();
    saveState(state, { validateState });
  };

  render();
}

init();
