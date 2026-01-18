import { DEFAULT_COMPANION_TYPE_ID } from '../data/companionTypes.js';

export const STATE_VERSION = 2;
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

export function createDefaultState() {
  return {
    version: STATE_VERSION,
    theme: 'light',
    player: {
      level: 4
    },
    companions: {
      [DEFAULT_COMPANION_ID]: createCompanionInstance(
        DEFAULT_COMPANION_ID,
        DEFAULT_COMPANION_TYPE_ID,
        'Blink Dog'
      )
    },
    activeCompanionId: DEFAULT_COMPANION_ID
  };
}

export const DEFAULT_STATE = createDefaultState();

export function getActiveCompanion(state) {
  return state.companions[state.activeCompanionId];
}
