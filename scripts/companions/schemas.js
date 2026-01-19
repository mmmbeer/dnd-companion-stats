const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const SKILL_LEVELS = new Set(['proficient', 'expertise']);

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isStringArrayOrEmpty(value) {
  return value === undefined || isStringArray(value);
}

function isNumberArray(value) {
  return Array.isArray(value) && value.every((entry) => Number.isFinite(entry));
}

function isFeatureEntry(entry) {
  return (
    isPlainObject(entry)
    && typeof entry.name === 'string'
    && entry.name.trim()
    && isStringArrayOrEmpty(entry.description)
  );
}

function isFeatureEntryArray(value) {
  return Array.isArray(value) && value.every((entry) => isFeatureEntry(entry));
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
    const asi = advancement.abilityScoreIncreases;
    if (!isPlainObject(asi) || !isNumberArray(asi.levels) || !isNumber(asi.maxScore)) {
      addError(
        errors,
        'advancement.abilityScoreIncreases requires levels and numeric maxScore.'
      );
    }

    const skills = advancement.skills;
    if (!isPlainObject(skills) || !isNumberArray(skills.levels) || !isStringArray(skills.choices)) {
      addError(errors, 'advancement.skills requires levels and choices.');
    }

    const featsOrAttacks = advancement.featsOrAttacks;
    if (
      !isPlainObject(featsOrAttacks)
      || !isNumberArray(featsOrAttacks.levels)
      || !isStringArray(featsOrAttacks.choices)
    ) {
      addError(errors, 'advancement.featsOrAttacks requires levels and choices.');
    }
  }

  if (!isFeatureEntryArray(type.baseAttacks)) {
    addError(errors, 'baseAttacks must be an array of named entries with descriptions.');
  }

  const lists = type.lists;
  if (!isPlainObject(lists)) {
    addError(errors, 'lists must be an object.');
  } else {
    if (!isFeatureEntryArray(lists.feats)) {
      addError(errors, 'lists.feats must be an array of named entries with descriptions.');
    }
    if (!isFeatureEntryArray(lists.attacks)) {
      addError(errors, 'lists.attacks must be an array of named entries with descriptions.');
    }
    if (!isFeatureEntryArray(lists.specialSkills)) {
      addError(errors, 'lists.specialSkills must be an array of named entries with descriptions.');
    }
  }

  if (type.traits !== undefined) {
    if (!Array.isArray(type.traits)) {
      addError(errors, 'traits must be an array when provided.');
    } else {
      type.traits.forEach((trait, index) => {
        if (!isPlainObject(trait)) {
          addError(errors, `traits[${index}] must be an object.`);
          return;
        }
        if (typeof trait.name !== 'string' || !trait.name.trim()) {
          addError(errors, `traits[${index}].name must be a non-empty string.`);
        }
        if (!isStringArrayOrEmpty(trait.description)) {
          addError(errors, `traits[${index}].description must be an array of strings.`);
        }
      });
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
