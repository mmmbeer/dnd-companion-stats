import { DEFAULT_STATE, getActiveCompanion } from './core/state.js';
import { loadState, saveState } from './core/storage.js';
import { getCompanionType } from './data/companionTypes.js';
import { applyAdvancement } from './rules/advancement.js';
import { buildCompanionView } from './rules/view.js';
import { renderAbilities } from './ui/renderAbilities.js';
import { renderAdvancement } from './ui/renderAdvancement.js';
import { renderStats } from './ui/renderStats.js';
import { renderSkills } from './ui/renderSkills.js';
import { renderFeatures } from './ui/renderFeatures.js';

let state = loadState(DEFAULT_STATE);
const AVAILABLE_THEMES = new Set([
  'arcane-midnight',
  'feywild-verdancy',
  'astral-ember',
  'void-sapphire',
  'relic-stone'
]);

if (!AVAILABLE_THEMES.has(state.theme)) {
  state.theme = 'arcane-midnight';
}

function render() {
  const companion = getActiveCompanion(state);
  const companionType = getCompanionType(companion.type);
  if (!companionType) {
    console.error('Unknown companion type:', companion.type);
    return;
  }
  const view = buildCompanionView(state, companion, companionType);
  renderAbilities(view);
  renderSkills(view);
  renderStats(view);
  renderFeatures(view);
  renderAdvancement(view, (action) => applyAdvancementAction(companion, companionType, action));
  saveState(state);
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
  document.documentElement.dataset.theme = state.theme;
  saveState(state);
};

document.documentElement.dataset.theme = state.theme;
render();
