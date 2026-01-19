export const STATE_VERSION = 4;
export const DEFAULT_COMPANION_ID = 'companion-1';

export function createCompanionInstance(id, typeId, name, playerLevel = 1) {
  return {
    id,
    type: typeId,
    name,
    playerLevel,
    advancementHistory: {},
    overrides: {}
  };
}

export function getNextCompanionId(state) {
  const companions = Object.keys(state.companions || {});
  const prefix = 'companion-';
  let maxId = 0;
  for (const id of companions) {
    if (!id.startsWith(prefix)) continue;
    const value = Number(id.slice(prefix.length));
    if (Number.isFinite(value)) {
      maxId = Math.max(maxId, value);
    }
  }
  return `${prefix}${maxId + 1}`;
}

export function createDefaultState(defaultTypeId, defaultCompanionName) {
  return {
    version: STATE_VERSION,
    theme: 'arcane-midnight',
    companions: {},
    activeCompanionId: null
  };
}

export function getActiveCompanion(state) {
  if (!state?.activeCompanionId) return null;
  return state.companions[state.activeCompanionId] || null;
}
