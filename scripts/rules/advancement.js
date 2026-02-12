import {
  getAbilityScores,
  getKnownAttacks,
  getKnownFeats,
  getKnownSpecialSkills
} from './companion.js';
import {
  normalizePrerequisiteFeatureName,
  parseFeaturePrerequisites
} from './featurePrerequisites.js';

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

const DEFAULT_SKILL_CHOICES = ['specialSkills'];
const DEFAULT_FEAT_ATTACK_CHOICES = ['feats', 'attacks'];

function normalizeFeatureEntries(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((entry) => {
      if (typeof entry === 'string') {
        return { name: entry, description: [] };
      }
      if (entry && typeof entry === 'object' && typeof entry.name === 'string') {
        return {
          name: entry.name,
          description: Array.isArray(entry.description) ? entry.description : []
        };
      }
      return null;
    })
    .filter((entry) => entry && entry.name);
}

function getKnownFeatureNameSet(companion, companionType) {
  const known = new Set();
  const baseTraitNames = normalizeFeatureEntries(companionType.traits || []).map(
    (entry) => entry.name
  );
  const knownFeats = getKnownFeats(companion, companionType);
  const knownAttacks = getKnownAttacks(companion, companionType);
  const knownSpecialSkills = getKnownSpecialSkills(companion, companionType);
  for (const name of [...baseTraitNames, ...knownFeats, ...knownAttacks, ...knownSpecialSkills]) {
    const normalized = normalizePrerequisiteFeatureName(name);
    if (normalized) known.add(normalized);
  }
  return known;
}

function isFeatOptionEligible(companion, companionType, playerLevel, option) {
  const prerequisites = parseFeaturePrerequisites(option);
  if (!prerequisites.length) return true;
  const knownFeatures = getKnownFeatureNameSet(companion, companionType);
  for (const prerequisite of prerequisites) {
    if (prerequisite.type === 'level') {
      if (playerLevel < prerequisite.value) {
        return false;
      }
      continue;
    }
    if (prerequisite.type === 'feature' && !knownFeatures.has(prerequisite.value)) {
      return false;
    }
  }
  return true;
}

function getAdvancementDefinition(companionType, playerLevel) {
  const advancement = companionType.advancement || {};
  const asi = advancement.abilityScoreIncreases;
  if (Array.isArray(asi?.levels) && asi.levels.includes(playerLevel)) {
    return { type: 'asi', maxScore: asi.maxScore };
  }
  const skill = advancement.skills;
  if (Array.isArray(skill?.levels) && skill.levels.includes(playerLevel)) {
    const categories =
      Array.isArray(skill.choices) && skill.choices.length
        ? skill.choices
        : DEFAULT_SKILL_CHOICES;
    return { type: 'choice', categories };
  }
  const featOrAttack = advancement.featsOrAttacks;
  if (Array.isArray(featOrAttack?.levels) && featOrAttack.levels.includes(playerLevel)) {
    const categories =
      Array.isArray(featOrAttack.choices) && featOrAttack.choices.length
        ? featOrAttack.choices
        : DEFAULT_FEAT_ATTACK_CHOICES;
    return { type: 'choice', categories };
  }
  return null;
}

export function getAdvancementType(companionType, playerLevel) {
  const definition = getAdvancementDefinition(companionType, playerLevel);
  return definition ? definition.type : null;
}

export function canAdvance(companion, companionType, playerLevel) {
  if (!getAdvancementType(companionType, playerLevel)) return false;
  return !companion.advancementHistory?.[playerLevel];
}

export function getAdvancementContext(companion, companionType, playerLevel) {
  const definition = getAdvancementDefinition(companionType, playerLevel);
  if (!definition) {
    return {
      type: null,
      canAdvance: false,
      blockedReason: 'No advancement available at this level.'
    };
  }

  const canApply = canAdvance(companion, companionType, playerLevel);
  if (definition.type === 'asi') {
    const abilityScores = getAbilityScores(companion, companionType);
    const maxScore = Number.isFinite(definition.maxScore) ? definition.maxScore : 20;
    const abilityOptions = Object.entries(abilityScores).map(([ability, data]) => ({
      ability,
      label: ability.toUpperCase(),
      score: data.score,
      mod: data.mod,
      canIncrease: data.score < maxScore
    }));

    const hasOption = abilityOptions.some((option) => option.canIncrease);
    return {
      type: 'asi',
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

  for (const category of definition.categories || []) {
    const list = normalizeFeatureEntries(companionType.lists?.[category] || []);
    const known =
      category === 'feats'
        ? knownFeats
        : category === 'attacks'
        ? knownAttacks
        : knownSpecialSkills;
    choices[category] = list.filter((option) => {
      if (known.includes(option.name)) return false;
      if (category !== 'feats') return true;
      return isFeatOptionEligible(companion, companionType, playerLevel, option);
    });
  }

  const hasOptions = Object.values(choices).some((list) => list.length > 0);
  return {
    type: 'choice',
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
  const availableNames = available.map((entry) => entry.name);
  if (!availableNames.includes(action.value)) {
    return { ok: false, error: 'Advancement choice not available.' };
  }
  if (action.type === 'feat') {
    const selected = available.find((entry) => entry.name === action.value);
    if (!selected || !isFeatOptionEligible(companion, companionType, playerLevel, selected)) {
      return { ok: false, error: 'Feat prerequisites not met.' };
    }
  }
  return { ok: true, entry: action };
}

export function categoryToActionType(category) {
  return CATEGORY_TO_ACTION[category] || null;
}

export function getAdvancementLevels(companionType) {
  const levels = new Set();
  const advancement = companionType.advancement || {};
  const buckets = [
    advancement.abilityScoreIncreases,
    advancement.skills,
    advancement.featsOrAttacks
  ];
  for (const bucket of buckets) {
    if (!Array.isArray(bucket?.levels)) continue;
    for (const level of bucket.levels) {
      if (Number.isFinite(level)) {
        levels.add(level);
      }
    }
  }
  return Array.from(levels).sort((a, b) => a - b);
}
