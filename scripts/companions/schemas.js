const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const SKILL_LEVELS = new Set(['proficient', 'expertise']);

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isNumber(value) {
  return Number.isFinite(value);
}

function addError(errors, message) {
  errors.push(message);
}

export function validateCompanionType(type) {
  const errors = [];

  if (!isPlainObject(type)) {
    addError(errors, 'Companion type must be an object.');
    return { ok: false, errors };
  }

  if (typeof type.id !== 'string' || !type.id.trim()) {
    addError(errors, 'Companion type requires a non-empty id.');
  }

  if (typeof type.name !== 'string' || !type.name.trim()) {
    addError(errors, 'Companion type requires a non-empty name.');
  }

  if (!isPlainObject(type.baseStats)) {
    addError(errors, 'baseStats must be an object.');
  } else {
    const abilities = type.baseStats.abilities;
    if (!isPlainObject(abilities)) {
      addError(errors, 'baseStats.abilities must be an object.');
    } else {
      for (const key of ABILITY_KEYS) {
        if (!isNumber(abilities[key])) {
          addError(errors, `baseStats.abilities.${key} must be a number.`);
        }
      }
    }

    const armorClass = type.baseStats.armorClass;
    if (!isPlainObject(armorClass) || !isNumber(armorClass.value)) {
      addError(errors, 'baseStats.armorClass.value must be a number.');
    } else if (armorClass.note && typeof armorClass.note !== 'string') {
      addError(errors, 'baseStats.armorClass.note must be a string when provided.');
    }

    const hitPoints = type.baseStats.hitPoints;
    if (!isPlainObject(hitPoints) || !isNumber(hitPoints.max)) {
      addError(errors, 'baseStats.hitPoints.max must be a number.');
    } else if (hitPoints.formula && typeof hitPoints.formula !== 'string') {
      addError(errors, 'baseStats.hitPoints.formula must be a string when provided.');
    }

    if (!isNumber(type.baseStats.speed)) {
      addError(errors, 'baseStats.speed must be a number.');
    }

    if (!isStringArray(type.baseStats.saves)) {
      addError(errors, 'baseStats.saves must be an array of strings.');
    }

    const skills = type.baseStats.skills;
    if (!isPlainObject(skills)) {
      addError(errors, 'baseStats.skills must be an object.');
    } else {
      for (const [skill, value] of Object.entries(skills)) {
        if (!SKILL_LEVELS.has(value)) {
          addError(errors, `baseStats.skills.${skill} must be proficient or expertise.`);
        }
      }
    }
  }

  const advancement = type.advancement;
  if (!isPlainObject(advancement)) {
    addError(errors, 'advancement must be an object.');
  } else {
    if (!isNumber(advancement.startsAtLevel)) {
      addError(errors, 'advancement.startsAtLevel must be a number.');
    }

    const even = advancement.even;
    if (!isPlainObject(even) || even.type !== 'asi' || !isNumber(even.maxScore)) {
      addError(errors, 'advancement.even requires type "asi" and numeric maxScore.');
    }

    const odd = advancement.odd;
    if (!isPlainObject(odd) || !isStringArray(odd.choices)) {
      addError(errors, 'advancement.odd.choices must be an array of strings.');
    }
  }

  if (!isStringArray(type.baseAttacks)) {
    addError(errors, 'baseAttacks must be an array of strings.');
  }

  const lists = type.lists;
  if (!isPlainObject(lists)) {
    addError(errors, 'lists must be an object.');
  } else {
    if (!isStringArray(lists.feats)) addError(errors, 'lists.feats must be an array of strings.');
    if (!isStringArray(lists.attacks)) addError(errors, 'lists.attacks must be an array of strings.');
    if (!isStringArray(lists.specialSkills)) {
      addError(errors, 'lists.specialSkills must be an array of strings.');
    }
  }

  return { ok: errors.length === 0, errors };
}

export function validateCompanionInstance(instance) {
  const errors = [];

  if (!isPlainObject(instance)) {
    addError(errors, 'Companion instance must be an object.');
    return { ok: false, errors };
  }

  if (typeof instance.id !== 'string' || !instance.id.trim()) {
    addError(errors, 'Companion instance requires a non-empty id.');
  }

  if (typeof instance.type !== 'string' || !instance.type.trim()) {
    addError(errors, 'Companion instance requires a non-empty type.');
  }

  if (typeof instance.name !== 'string' || !instance.name.trim()) {
    addError(errors, 'Companion instance requires a non-empty name.');
  }

  if (instance.advancementHistory && !isPlainObject(instance.advancementHistory)) {
    addError(errors, 'Companion advancementHistory must be an object when provided.');
  }

  if (instance.overrides && !isPlainObject(instance.overrides)) {
    addError(errors, 'Companion overrides must be an object when provided.');
  }

  return { ok: errors.length === 0, errors };
}
