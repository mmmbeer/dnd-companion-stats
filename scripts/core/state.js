export const STATE_VERSION = 3;
export const DEFAULT_COMPANION_ID = 'companion-1';

export function createCompanionInstance(id, typeId, name) {
  return {
    id,
    type: typeId,
    name,
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
    player: {
      level: 4
    },
    companions: {
      [DEFAULT_COMPANION_ID]: createCompanionInstance(
        DEFAULT_COMPANION_ID,
        defaultTypeId,
        defaultCompanionName
      )
    },
    activeCompanionId: DEFAULT_COMPANION_ID
  };
}

export function getActiveCompanion(state) {
  return state.companions[state.activeCompanionId];
}
