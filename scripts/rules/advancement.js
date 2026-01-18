import {
  getAbilityScores,
  getKnownAttacks,
  getKnownFeats,
  getKnownSpecialSkills
} from './companion.js';

const CATEGORY_TO_ACTION = {
  feats: 'feat',
  attacks: 'attack',
  specialSkills: 'specialSkill'
};

const ACTION_TO_CATEGORY = {
  feat: 'feats',
  attack: 'attacks',
  specialSkill: 'specialSkills'
};

export function getAdvancementType(companionType, playerLevel) {
  if (playerLevel < companionType.advancement.startsAtLevel) return null;
  return playerLevel % 2 === 0 ? 'asi' : 'choice';
}

export function canAdvance(companion, companionType, playerLevel) {
  if (!getAdvancementType(companionType, playerLevel)) return false;
  return !companion.advancementHistory?.[playerLevel];
}

export function getAdvancementContext(companion, companionType, playerLevel) {
  const type = getAdvancementType(companionType, playerLevel);
  if (!type) {
    return {
      type: null,
      canAdvance: false,
      blockedReason: 'No advancement available yet.'
    };
  }

  const canApply = canAdvance(companion, companionType, playerLevel);
  if (type === 'asi') {
    const abilityScores = getAbilityScores(companion, companionType);
    const maxScore = companionType.advancement.even.maxScore;
    const abilityOptions = Object.entries(abilityScores).map(([ability, data]) => ({
      ability,
      label: ability.toUpperCase(),
      score: data.score,
      mod: data.mod,
      canIncrease: data.score < maxScore
    }));

    const hasOption = abilityOptions.some((option) => option.canIncrease);
    return {
      type,
      canAdvance: canApply && hasOption,
      blockedReason: !canApply
        ? 'Advancement already applied for this level.'
        : !hasOption
        ? 'No ability scores can be increased.'
        : '',
      maxScore,
      abilityOptions
    };
  }

  const knownFeats = getKnownFeats(companion, companionType);
  const knownAttacks = getKnownAttacks(companion, companionType);
  const knownSpecialSkills = getKnownSpecialSkills(companion, companionType);
  const choices = {};

  for (const category of companionType.advancement.odd.choices) {
    const list = companionType.lists[category] || [];
    const known =
      category === 'feats'
        ? knownFeats
        : category === 'attacks'
        ? knownAttacks
        : knownSpecialSkills;
    choices[category] = list.filter((option) => !known.includes(option));
  }

  const hasOptions = Object.values(choices).some((list) => list.length > 0);
  return {
    type,
    canAdvance: canApply && hasOptions,
    blockedReason: !canApply
      ? 'Advancement already applied for this level.'
      : !hasOptions
      ? 'No advancement choices remain.'
      : '',
    choices
  };
}

export function applyAdvancement(companion, companionType, playerLevel, action) {
  const context = getAdvancementContext(companion, companionType, playerLevel);
  if (!context.type) {
    return { ok: false, error: 'Not eligible for advancement.' };
  }
  if (!context.canAdvance) {
    return { ok: false, error: 'Advancement already applied.' };
  }

  if (context.type === 'asi') {
    if (!action || action.type !== 'asi') {
      return { ok: false, error: 'Invalid advancement action.' };
    }
    const option = context.abilityOptions.find(
      (entry) => entry.ability === action.ability
    );
    if (!option || !option.canIncrease) {
      return { ok: false, error: 'Ability score cannot be increased.' };
    }
    return { ok: true, entry: action };
  }

  if (!action || !ACTION_TO_CATEGORY[action.type]) {
    return { ok: false, error: 'Invalid advancement action.' };
  }
  const category = ACTION_TO_CATEGORY[action.type];
  const available = context.choices?.[category] || [];
  if (!available.includes(action.value)) {
    return { ok: false, error: 'Advancement choice not available.' };
  }
  return { ok: true, entry: action };
}

export function categoryToActionType(category) {
  return CATEGORY_TO_ACTION[category] || null;
}
