import { validateCompanionInstanceWithRegistry } from '../companions/registry.js';

const ACTION_TYPES = new Set(['asi', 'feat', 'attack', 'specialSkill']);

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function addError(errors, message) {
  errors.push(message);
}

function validateAdvancementHistory(history, errors, path) {
  if (!isPlainObject(history)) {
    addError(errors, `${path} must be an object.`);
    return;
  }
  for (const [level, entry] of Object.entries(history)) {
    if (!isPlainObject(entry)) {
      addError(errors, `${path}.${level} must be an object.`);
      continue;
    }
    if (!ACTION_TYPES.has(entry.type)) {
      addError(errors, `${path}.${level}.type is invalid.`);
      continue;
    }
    if (entry.type === 'asi') {
      if (typeof entry.ability !== 'string') {
        addError(errors, `${path}.${level}.ability is required for ASI.`);
      }
    } else if (typeof entry.value !== 'string') {
      addError(errors, `${path}.${level}.value is required for ${entry.type}.`);
    }
  }
}

export function validateState(state) {
  const errors = [];
  if (!isPlainObject(state)) {
    return { ok: false, errors: ['State must be an object.'] };
  }

  if (!Number.isFinite(state.version)) {
    addError(errors, 'state.version must be a number.');
  }

  if (typeof state.theme !== 'string') {
    addError(errors, 'state.theme must be a string.');
  }

  if (!isPlainObject(state.player) || !Number.isFinite(state.player.level)) {
    addError(errors, 'state.player.level must be a number.');
  }

  if (!isPlainObject(state.companions)) {
    addError(errors, 'state.companions must be an object.');
  } else {
    for (const [companionId, companion] of Object.entries(state.companions)) {
      const instanceResult = validateCompanionInstanceWithRegistry(companion);
      if (!instanceResult.ok) {
        for (const error of instanceResult.errors) {
          addError(errors, `companions.${companionId}: ${error}`);
        }
      }
      if (companion?.advancementHistory) {
        validateAdvancementHistory(
          companion.advancementHistory,
          errors,
          `companions.${companionId}.advancementHistory`
        );
      }
    }
  }

  const companionCount = isPlainObject(state.companions)
    ? Object.keys(state.companions).length
    : 0;
  if (companionCount === 0) {
    if (state.activeCompanionId !== null) {
      addError(errors, 'state.activeCompanionId must be null when no companions exist.');
    }
  } else if (typeof state.activeCompanionId !== 'string') {
    addError(errors, 'state.activeCompanionId must be a string.');
  } else if (state.companions && !state.companions[state.activeCompanionId]) {
    addError(errors, 'state.activeCompanionId must reference an existing companion.');
  }

  return { ok: errors.length === 0, errors };
}
