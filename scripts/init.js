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
import { renderStats } from './ui/renderStats.js';
import { renderSkills } from './ui/renderSkills.js';
import { renderFeatures } from './ui/renderFeatures.js';
import { openConfirmModal } from './ui/modals/confirmModal.js';
import { openThemeModal } from './ui/modals/themeModal.js';
import { renderHealth } from './ui/renderHealth.js';
import { renderSavingThrows } from './ui/renderSavingThrows.js';
import { renderEmptyState } from './ui/renderEmptyState.js';
import { openAddCompanionModal } from './ui/modals/addCompanionModal.js';
import { openAdvancementModal } from './ui/modals/advancementModal.js';
import { getRandomCompanionName } from './data/nameRandomizer.js';

const THEMES = [
  { id: 'arcane-midnight', label: 'Arcane Midnight' },
  { id: 'feywild-verdancy', label: 'Feywild Verdancy' },
  { id: 'astral-ember', label: 'Astral Ember' },
  { id: 'void-sapphire', label: 'Void Sapphire' },
  { id: 'relic-stone', label: 'Relic Stone' }
];
const AVAILABLE_THEMES = new Set(THEMES.map((theme) => theme.id));

let state = null;
let defaultCompanionTypeId = null;
let companionSelect = null;
let companionNameInput = null;
let randomizeNameButton = null;
let newCompanionButton = null;
let deleteCompanionButton = null;
let playerLevelInput = null;
let levelUpButton = null;
let emptyStatePanel = null;
let abilitiesPanel = null;
let sheetBody = null;
let topbarTitle = null;
let companionTypeSelect = null;
let settingsButton = null;

function render() {
  const companion = getActiveCompanion(state);
  renderCompanionRoster();

  if (!companion) {
    setCompanionViewVisibility(false);
    updateTopbarTitle();
    updateLevelUpButton();
    renderEmptyState(openAddCompanionFlow);
    saveState(state, { validateState });
    return;
  }

  const companionType = getCompanionType(companion.type);
  if (!companionType) {
    console.error('Unknown companion type:', companion.type);
    return;
  }
  ensureCompanionLevel(companion);
  updateTopbarTitle(companion);
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
  renderFeatures(view, {
    onDeleteAdvancement: (level) =>
      requestAdvancementRemoval(companion, level),
    onReplaceAdvancement: (level) =>
      requestAdvancementReplacement(companion, companionType, level)
  });
  updateLevelUpButton(view.advancement);
  saveState(state, { validateState });
}

function applyAdvancementAction(companion, companionType, action) {
  const result = applyAdvancement(
    companion,
    companionType,
    companion.playerLevel,
    action
  );
  if (!result.ok) {
    console.error(result.error);
    return;
  }
  companion.advancementHistory[companion.playerLevel] = result.entry;
  render();
}

function ensureTheme() {
  if (!AVAILABLE_THEMES.has(state.theme)) {
    state.theme = 'arcane-midnight';
  }
  document.documentElement.dataset.theme = state.theme;
}

function ensureCompanionLevel(companion) {
  if (!Number.isFinite(companion.playerLevel)) {
    companion.playerLevel = 1;
  }
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

function populateCompanionTypeOptions() {
  if (!companionTypeSelect) return;
  const types = listCompanionTypes();
  companionTypeSelect.innerHTML = '';
  const sorted = [...types].sort((a, b) => a.name.localeCompare(b.name));
  for (const type of sorted) {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    companionTypeSelect.appendChild(option);
  }
}

function hasLeveledChanges(companion) {
  if (!companion) return false;
  const history = companion.advancementHistory;
  if (history && Object.keys(history).length > 0) return true;
  const overrides = companion.overrides;
  if (!overrides || typeof overrides !== 'object') return false;
  const abilityIncreases = overrides.abilityIncreases || {};
  if (Object.values(abilityIncreases).some((value) => Number(value) > 0)) {
    return true;
  }
  const overrideLists = ['feats', 'attacks', 'specialSkills'];
  return overrideLists.some(
    (key) => Array.isArray(overrides[key]) && overrides[key].length > 0
  );
}

function resetLeveledChanges(companion) {
  companion.advancementHistory = {};
  companion.overrides = {};
}

function pruneCompanionAdvancementHistory(companion, level) {
  if (!companion.advancementHistory) return;
  for (const entryLevel of Object.keys(companion.advancementHistory)) {
    const numericLevel = Number(entryLevel);
    if (Number.isFinite(numericLevel) && numericLevel >= level) {
      delete companion.advancementHistory[entryLevel];
    }
  }
}

function countAdvancementEntriesAtOrAbove(companion, level) {
  let count = 0;
  if (!companion.advancementHistory) return count;
  for (const entryLevel of Object.keys(companion.advancementHistory)) {
    const numericLevel = Number(entryLevel);
    if (Number.isFinite(numericLevel) && numericLevel >= level) {
      count += 1;
    }
  }
  return count;
}

function applyCompanionLevelChange(companion, nextLevel) {
  companion.playerLevel = nextLevel;
  pruneCompanionAdvancementHistory(companion, nextLevel);
  render();
  if (playerLevelInput) {
    playerLevelInput.value = String(companion.playerLevel);
  }
}

function requestAdvancementRemoval(companion, level) {
  const entry = companion.advancementHistory?.[level];
  if (!entry) return;
  openConfirmModal({
    title: 'Remove Advancement',
    message: `Remove the advancement recorded for level ${level}? This cannot be undone.`,
    confirmLabel: 'Remove',
    cancelLabel: 'Cancel',
    onConfirm: () => {
      delete companion.advancementHistory[level];
      render();
    }
  });
}

function requestAdvancementReplacement(companion, companionType, level) {
  const history = companion.advancementHistory || {};
  if (!history[level]) return;
  const tempHistory = { ...history };
  delete tempHistory[level];
  const tempCompanion = {
    ...companion,
    advancementHistory: tempHistory
  };
  const context = getAdvancementContext(tempCompanion, companionType, level);
  if (!context.type || !context.canAdvance) {
    openConfirmModal({
      title: 'Replace Advancement',
      message: context.blockedReason || 'No advancement available for this level.',
      confirmLabel: 'Ok',
      cancelLabel: 'Close',
      onConfirm: () => {}
    });
    return;
  }
  openAdvancementModal({
    companionName: companion.name,
    companionTypeId: companionType.id,
    advancement: context,
    onConfirm: (action) => {
      const result = applyAdvancement(tempCompanion, companionType, level, action);
      if (!result.ok) {
        console.error(result.error);
        return;
      }
      companion.advancementHistory[level] = result.entry;
      render();
    },
    onCancel: () => render()
  });
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
  if (companionTypeSelect) {
    companionTypeSelect.disabled = !hasCompanions;
  }
  if (randomizeNameButton) {
    randomizeNameButton.disabled = !hasCompanions;
  }
  if (playerLevelInput) {
    playerLevelInput.disabled = !hasCompanions;
  }
  if (levelUpButton) {
    levelUpButton.disabled = !hasCompanions;
  }
  deleteCompanionButton.disabled = companions.length <= 1;

  if (hasCompanions) {
    companionSelect.value = state.activeCompanionId;
    const activeCompanion = getActiveCompanion(state);
    companionNameInput.value = activeCompanion?.name || '';
    if (companionTypeSelect && activeCompanion) {
      companionTypeSelect.value = activeCompanion.type;
    }
    if (playerLevelInput && activeCompanion) {
      playerLevelInput.value = String(activeCompanion.playerLevel ?? 1);
    }
  } else {
    companionNameInput.value = '';
    if (playerLevelInput) {
      playerLevelInput.value = '';
    }
  }
}

function setCompanionViewVisibility(hasCompanion) {
  if (emptyStatePanel) emptyStatePanel.classList.toggle('is-hidden', hasCompanion);
  if (abilitiesPanel) abilitiesPanel.classList.toggle('is-hidden', !hasCompanion);
  if (sheetBody) sheetBody.classList.toggle('is-hidden', !hasCompanion);
}

function updateLevelUpButton(advancement) {
  if (!levelUpButton) return;
  const isReady = Boolean(advancement?.type && advancement?.canAdvance);
  levelUpButton.classList.toggle('is-hidden', !isReady);
  levelUpButton.classList.toggle('is-glowing', isReady);
}

function updateTopbarTitle(companion) {
  if (!topbarTitle) return;
  if (!companion) {
    topbarTitle.textContent = 'Companion Sheet';
    return;
  }
  topbarTitle.textContent = companion.name;
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
  updateTopbarTitle(activeCompanion);
  saveState(state, { validateState });
}

function getAddCompanionDefaults(typeId) {
  const nextId = getNextCompanionId(state);
  const index = Number(nextId.split('-')[1]) || Object.keys(state.companions).length + 1;
  return getNumberedCompanionName(typeId, index);
}

function createCompanionFromInput({ typeId, name, playerLevel }) {
  const nextId = getNextCompanionId(state);
  const companion = createCompanionInstance(nextId, typeId, name, playerLevel);
  state.companions[nextId] = companion;
  state.activeCompanionId = nextId;
  return companion;
}

function requestCompanionLevelChange(companion, nextLevel, onApplied) {
  if (!companion) return;
  const previousLevel = companion.playerLevel;
  if (nextLevel === companion.playerLevel) {
    onApplied?.();
    return;
  }
  if (nextLevel < companion.playerLevel) {
    const removedCount = countAdvancementEntriesAtOrAbove(companion, nextLevel);
    if (removedCount > 0) {
      if (playerLevelInput) {
        playerLevelInput.value = String(companion.playerLevel);
      }
      openConfirmModal({
        title: 'Lower Player Level',
        message: `Lowering to level ${nextLevel} will remove ${removedCount} advancement ${removedCount === 1 ? 'entry' : 'entries'} for ${companion.name}. Continue?`,
        confirmLabel: 'Lower Level',
        cancelLabel: 'Cancel',
        onConfirm: () => {
          applyCompanionLevelChange(companion, nextLevel);
          onApplied?.();
        }
      });
      return;
    }
  }
  applyCompanionLevelChange(companion, nextLevel);
  onApplied?.();
  if (nextLevel - previousLevel > 1) {
    const companionType = getCompanionType(companion.type);
    if (companionType) {
      openCompanionAdvancementFlow(companion, companionType, nextLevel);
    }
  }
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
      companionTypeId: companionType.id,
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
  const activeCompanion = getActiveCompanion(state);
  const defaultPlayerLevel = activeCompanion?.playerLevel ?? 1;
  openAddCompanionModal({
    types,
    defaultTypeId: defaultCompanionTypeId,
    defaultName: nameForType(defaultCompanionTypeId),
    defaultPlayerLevel,
    nameForType,
    onConfirm: ({ typeId, name, playerLevel }) => {
      const companion = createCompanionFromInput({ typeId, name, playerLevel });
      render();
      const companionType = getCompanionType(typeId);
      if (companionType) {
        openCompanionAdvancementFlow(companion, companionType, companion.playerLevel);
      }
    }
  });
}

function setupCompanionControls() {
  companionSelect = document.getElementById('companionSelect');
  companionNameInput = document.getElementById('companionName');
  companionTypeSelect = document.getElementById('companionTypeSelect');
  randomizeNameButton = document.getElementById('randomizeCompanionName');
  newCompanionButton = document.getElementById('newCompanion');
  deleteCompanionButton = document.getElementById('deleteCompanion');
  playerLevelInput = document.getElementById('playerLevel');
  levelUpButton = document.getElementById('levelUpButton');
  emptyStatePanel = document.getElementById('emptyState');
  abilitiesPanel = document.getElementById('abilities');
  sheetBody = document.querySelector('.sheet-body');
  topbarTitle = document.getElementById('topbarTitle');
  settingsButton = document.getElementById('openSettings');

  populateCompanionTypeOptions();

  companionSelect.onchange = (event) => {
    state.activeCompanionId = event.target.value;
    render();
  };

  companionNameInput.oninput = (event) => {
    setActiveCompanionName(event.target.value);
  };

  if (companionTypeSelect) {
    companionTypeSelect.onchange = (event) => {
      const activeCompanion = getActiveCompanion(state);
      if (!activeCompanion) return;
      const nextTypeId = event.target.value;
      if (nextTypeId === activeCompanion.type) return;
      if (!hasLeveledChanges(activeCompanion)) {
        activeCompanion.type = nextTypeId;
        render();
        return;
      }
      companionTypeSelect.value = activeCompanion.type;
      openConfirmModal({
        title: 'Change Companion Type',
        message: `${activeCompanion.name} has leveled features or changes. Switching types will reset their advancements back to base stats, attacks, features, and skills. Continue?`,
        confirmLabel: 'Change Type',
        cancelLabel: 'Cancel',
        onConfirm: () => {
          activeCompanion.type = nextTypeId;
          resetLeveledChanges(activeCompanion);
          if (companionTypeSelect) {
            companionTypeSelect.value = nextTypeId;
          }
          render();
        }
      });
    };
  }

  if (randomizeNameButton) {
    randomizeNameButton.onclick = () => {
      const activeCompanion = getActiveCompanion(state);
      if (!activeCompanion) return;
      const randomName = getRandomCompanionName(activeCompanion.type)
        ?? getBaseCompanionName(activeCompanion.type);
      setActiveCompanionName(randomName);
    };
  }

  if (levelUpButton) {
    levelUpButton.onclick = () => {
      const activeCompanion = getActiveCompanion(state);
      if (!activeCompanion) return;
      const companionType = getCompanionType(activeCompanion.type);
      if (!companionType) return;
      const context = getAdvancementContext(
        activeCompanion,
        companionType,
        activeCompanion.playerLevel
      );
      if (!context.type || !context.canAdvance) return;
      openAdvancementModal({
        companionName: activeCompanion.name,
        companionTypeId: companionType.id,
        advancement: context,
        onConfirm: (action) => applyAdvancementAction(activeCompanion, companionType, action),
        onCancel: () => render()
      });
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

  if (settingsButton) {
    settingsButton.onclick = () => {
      openThemeModal({
        themes: THEMES,
        currentTheme: state.theme,
        onConfirm: (nextTheme) => {
          state.theme = nextTheme;
          ensureTheme();
          saveState(state, { validateState });
        }
      });
    };
  }
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
    playerLevelInput.oninput = (event) => {
      const activeCompanion = getActiveCompanion(state);
      if (!activeCompanion) return;
      const nextLevel = Number(event.target.value);
      if (!Number.isFinite(nextLevel)) return;
      requestCompanionLevelChange(activeCompanion, nextLevel);
    };
  }

  render();
}

init();
