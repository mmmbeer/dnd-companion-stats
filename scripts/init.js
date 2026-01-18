import {
  createCompanionInstance,
  createDefaultState,
  getActiveCompanion,
  getNextCompanionId
} from './core/state.js';
import { loadState, saveState } from './core/storage.js';
import { validateState } from './core/validation.js';
import { loadCompanionTypes } from './companions/loader.js';
import { getCompanionType, listCompanionTypes } from './companions/registry.js';
import { applyAdvancement, getAdvancementContext } from './rules/advancement.js';
import { buildCompanionView } from './rules/view.js';
import { renderAbilities } from './ui/renderAbilities.js';
import { renderAdvancement } from './ui/renderAdvancement.js';
import { renderStats } from './ui/renderStats.js';
import { renderSkills } from './ui/renderSkills.js';
import { renderFeatures } from './ui/renderFeatures.js';
import { openConfirmModal } from './ui/modals/confirmModal.js';
import { renderHealth } from './ui/renderHealth.js';
import { renderSavingThrows } from './ui/renderSavingThrows.js';
import { renderEmptyState } from './ui/renderEmptyState.js';
import { openAddCompanionModal } from './ui/modals/addCompanionModal.js';
import { openAdvancementModal } from './ui/modals/advancementModal.js';
import { getRandomCompanionName } from './data/nameRandomizer.js';

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
let randomizeNameButton = null;
let newCompanionButton = null;
let deleteCompanionButton = null;
let playerLevelInput = null;
let emptyStatePanel = null;
let abilitiesPanel = null;
let sheetBody = null;
let topbarTitle = null;
let topbarSubtitle = null;

function render() {
  const companion = getActiveCompanion(state);
  renderCompanionRoster();

  if (!companion) {
    setCompanionViewVisibility(false);
    updateTopbarTitle();
    renderEmptyState(openAddCompanionFlow);
    saveState(state, { validateState });
    return;
  }

  const companionType = getCompanionType(companion.type);
  if (!companionType) {
    console.error('Unknown companion type:', companion.type);
    return;
  }
  updateTopbarTitle(companion, companionType);
  setCompanionViewVisibility(true);
  ensureCompanionHealth(companion, companionType);
  const view = buildCompanionView(state, companion, companionType);
  renderHealth(view, (nextHealth) => {
    companion.health = {
      current: nextHealth.current,
      temp: nextHealth.temp
    };
    saveState(state, { validateState });
  });
  renderSavingThrows(view);
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

function ensureCompanionHealth(companion, companionType) {
  if (!companion.health || typeof companion.health !== 'object') {
    companion.health = { current: companionType.baseStats.hitPoints.max, temp: 0 };
    return;
  }
  if (!Number.isFinite(companion.health.current)) {
    companion.health.current = companionType.baseStats.hitPoints.max;
  }
  if (!Number.isFinite(companion.health.temp)) {
    companion.health.temp = 0;
  }
}

function ensureActiveCompanion() {
  const companionIds = Object.keys(state.companions || {});
  if (companionIds.length === 0) {
    state.activeCompanionId = null;
    return;
  }
  if (!state.activeCompanionId || !state.companions[state.activeCompanionId]) {
    state.activeCompanionId = companionIds[0];
  }
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

function countAdvancementEntriesAtOrAbove(level) {
  let count = 0;
  for (const companion of Object.values(state.companions)) {
    if (!companion.advancementHistory) continue;
    for (const entryLevel of Object.keys(companion.advancementHistory)) {
      const numericLevel = Number(entryLevel);
      if (Number.isFinite(numericLevel) && numericLevel >= level) {
        count += 1;
      }
    }
  }
  return count;
}

function applyPlayerLevelChange(nextLevel) {
  state.player.level = nextLevel;
  pruneAdvancementHistory(nextLevel);
  render();
  if (playerLevelInput) {
    playerLevelInput.value = state.player.level;
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
  const hasCompanions = companions.length > 0;
  companionSelect.disabled = !hasCompanions;
  companionNameInput.disabled = !hasCompanions;
  if (randomizeNameButton) {
    randomizeNameButton.disabled = !hasCompanions;
  }
  if (playerLevelInput) {
    playerLevelInput.disabled = !hasCompanions;
  }
  deleteCompanionButton.disabled = companions.length <= 1;

  if (hasCompanions) {
    companionSelect.value = state.activeCompanionId;
    const activeCompanion = getActiveCompanion(state);
    companionNameInput.value = activeCompanion?.name || '';
  } else {
    companionNameInput.value = '';
  }
}

function setCompanionViewVisibility(hasCompanion) {
  if (emptyStatePanel) emptyStatePanel.classList.toggle('is-hidden', hasCompanion);
  if (abilitiesPanel) abilitiesPanel.classList.toggle('is-hidden', !hasCompanion);
  if (sheetBody) sheetBody.classList.toggle('is-hidden', !hasCompanion);
}

function updateTopbarTitle(companion, companionType) {
  if (!topbarTitle || !topbarSubtitle) return;
  if (!companion || !companionType) {
    topbarTitle.textContent = 'Companion Sheet';
    topbarSubtitle.textContent = '';
    return;
  }
  const levelLabel = `L${state.player.level}`;
  topbarTitle.textContent = `${companion.name} - ${companionType.name} ${levelLabel} - Companion Sheet`;
  const subtag = companionType.traits?.[0]?.name ?? '';
  topbarSubtitle.textContent = subtag;
}

function setActiveCompanionName(value) {
  const activeCompanion = getActiveCompanion(state);
  if (!activeCompanion) return;
  const trimmed = value.trim();
  activeCompanion.name = trimmed || getBaseCompanionName(activeCompanion.type);
  if (companionNameInput) {
    companionNameInput.value = activeCompanion.name;
  }
  const selectedOption = companionSelect?.options[companionSelect.selectedIndex];
  if (selectedOption) {
    selectedOption.textContent = formatCompanionOption(activeCompanion);
  }
  const companionType = getCompanionType(activeCompanion.type);
  if (companionType) {
    updateTopbarTitle(activeCompanion, companionType);
  }
  saveState(state, { validateState });
}

function getAddCompanionDefaults(typeId) {
  const nextId = getNextCompanionId(state);
  const index = Number(nextId.split('-')[1]) || Object.keys(state.companions).length + 1;
  return getNumberedCompanionName(typeId, index);
}

function createCompanionFromInput({ typeId, name }) {
  const nextId = getNextCompanionId(state);
  const companion = createCompanionInstance(nextId, typeId, name);
  state.companions[nextId] = companion;
  state.activeCompanionId = nextId;
  return companion;
}

function requestPlayerLevelChange(nextLevel, onApplied) {
  if (nextLevel === state.player.level) {
    onApplied?.();
    return;
  }
  if (nextLevel < state.player.level) {
    const removedCount = countAdvancementEntriesAtOrAbove(nextLevel);
    if (removedCount > 0) {
      if (playerLevelInput) {
        playerLevelInput.value = state.player.level;
      }
      openConfirmModal({
        title: 'Lower Player Level',
        message: `Lowering to level ${nextLevel} will remove ${removedCount} advancement ${removedCount === 1 ? 'entry' : 'entries'} across companions. Continue?`,
        confirmLabel: 'Lower Level',
        cancelLabel: 'Cancel',
        onConfirm: () => {
          applyPlayerLevelChange(nextLevel);
          onApplied?.();
        }
      });
      return;
    }
  }
  applyPlayerLevelChange(nextLevel);
  onApplied?.();
}

function openCompanionAdvancementFlow(companion, companionType, playerLevel) {
  const startLevel = companionType.advancement.startsAtLevel;
  if (playerLevel < startLevel) return;
  const levels = [];
  for (let level = startLevel; level <= playerLevel; level += 1) {
    levels.push(level);
  }

  const advanceAtIndex = (index) => {
    if (index >= levels.length) {
      render();
      return;
    }
    const level = levels[index];
    const context = getAdvancementContext(companion, companionType, level);
    if (!context.type || !context.canAdvance) {
      advanceAtIndex(index + 1);
      return;
    }
    openAdvancementModal({
      companionName: companion.name,
      advancement: context,
      onConfirm: (action) => {
        const result = applyAdvancement(companion, companionType, level, action);
        if (!result.ok) {
          console.error(result.error);
          return;
        }
        companion.advancementHistory[level] = result.entry;
        render();
        advanceAtIndex(index + 1);
      },
      onCancel: () => {
        render();
      }
    });
  };

  advanceAtIndex(0);
}

function openAddCompanionFlow() {
  const types = listCompanionTypes();
  if (!types.length) {
    console.error('No companion types registered.');
    return;
  }
  const nameForType = (typeId) => getAddCompanionDefaults(typeId);
  openAddCompanionModal({
    types,
    defaultTypeId: defaultCompanionTypeId,
    defaultName: nameForType(defaultCompanionTypeId),
    defaultPlayerLevel: state.player.level || 1,
    nameForType,
    onConfirm: ({ typeId, name, playerLevel }) => {
      requestPlayerLevelChange(playerLevel, () => {
        const companion = createCompanionFromInput({ typeId, name });
        render();
        const companionType = getCompanionType(typeId);
        if (companionType) {
          openCompanionAdvancementFlow(companion, companionType, state.player.level);
        }
      });
    }
  });
}

function setupCompanionControls() {
  companionSelect = document.getElementById('companionSelect');
  companionNameInput = document.getElementById('companionName');
  randomizeNameButton = document.getElementById('randomizeCompanionName');
  newCompanionButton = document.getElementById('newCompanion');
  deleteCompanionButton = document.getElementById('deleteCompanion');
  playerLevelInput = document.getElementById('playerLevel');
  emptyStatePanel = document.getElementById('emptyState');
  abilitiesPanel = document.getElementById('abilities');
  sheetBody = document.querySelector('.sheet-body');
  topbarTitle = document.getElementById('topbarTitle');
  topbarSubtitle = document.getElementById('topbarSubtitle');

  companionSelect.onchange = (event) => {
    state.activeCompanionId = event.target.value;
    render();
  };

  companionNameInput.oninput = (event) => {
    setActiveCompanionName(event.target.value);
  };

  if (randomizeNameButton) {
    randomizeNameButton.onclick = () => {
      const activeCompanion = getActiveCompanion(state);
      if (!activeCompanion) return;
      const randomName = getRandomCompanionName(activeCompanion.type)
        ?? getBaseCompanionName(activeCompanion.type);
      setActiveCompanionName(randomName);
    };
  }

  newCompanionButton.onclick = () => {
    openAddCompanionFlow();
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
  ensureActiveCompanion();
  setupCompanionControls();
  if (playerLevelInput) {
    playerLevelInput.value = state.player.level;
    playerLevelInput.oninput = (event) => {
      const nextLevel = Number(event.target.value);
      if (!Number.isFinite(nextLevel)) return;
      requestPlayerLevelChange(nextLevel);
    };
  }

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
