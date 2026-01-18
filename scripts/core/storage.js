import { migrateState } from './migrations.js';

const KEY = 'blinkDogState';

export function loadState(defaultState, options = {}) {
  const raw = localStorage.getItem(KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateState(parsed, options.migration);
    if (!migrated) {
      console.error('State migration failed. Keeping stored data intact.');
      return structuredClone(defaultState);
    }
    if (options.validateState) {
      const validation = options.validateState(migrated);
      if (!validation.ok) {
        console.error('Stored state failed validation. Keeping stored data intact.', validation.errors);
        return structuredClone(defaultState);
      }
    }
    return migrated;
  } catch (error) {
    console.error('Failed to parse stored state:', error);
    return structuredClone(defaultState);
  }
}

export function saveState(state, options = {}) {
  if (options.validateState) {
    const validation = options.validateState(state);
    if (!validation.ok) {
      console.error('Refusing to save invalid state.', validation.errors);
      return false;
    }
  }
  localStorage.setItem(KEY, JSON.stringify(state));
  return true;
}
