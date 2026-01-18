import { createDefaultState, getActiveCompanion } from './core/state.js';
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
import { renderCompanions } from './ui/renderCompanions.js';

const AVAILABLE_THEMES = new Set([
  'arcane-midnight',
  'feywild-verdancy',
  'astral-ember',
  'void-sapphire',
  'relic-stone'
]);

let state = null;
let defaultCompanionTypeId = null;

function render() {
  const companion = getActiveCompanion(state);
  const companionType = getCompanionType(companion.type);
  if (!companionType) {
    console.error('Unknown companion type:', companion.type);
    return;
  }
  const view = buildCompanionView(state, companion, companionType);
  renderCompanions({
    companions: Object.values(state.companions),
    activeCompanionId: state.activeCompanionId,
    getTypeName: (typeId) => getCompanionType(typeId)?.name || typeId,
    onSelect: (id) => {
      if (state.activeCompanionId === id) return;
      state.activeCompanionId = id;
      render();
    }
  });
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

  const playerLevelInput = document.getElementById('playerLevel');
  playerLevelInput.value = state.player.level;
  playerLevelInput.oninput = (event) => {
    state.player.level = Number(event.target.value);
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
