import { migrateState } from './migrations.js';

const KEY = 'blinkDogState';

export function loadState(defaultState) {
  const raw = localStorage.getItem(KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateState(parsed);
    if (!migrated) {
      console.error('State migration failed. Keeping stored data intact.');
      return structuredClone(defaultState);
    }
    return migrated;
  } catch (error) {
    console.error('Failed to parse stored state:', error);
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
