import { abilityMod } from './abilities.js';

export const ABILITY_ORDER = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

function listFromHistory(advancementHistory, actionType) {
  if (!advancementHistory) return [];
  const items = [];
  for (const entry of Object.values(advancementHistory)) {
    if (entry?.type === actionType && entry.value) {
      items.push(entry.value);
    }
  }
  return items;
}

function listNames(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((entry) => (typeof entry === 'string' ? entry : entry?.name))
    .filter(Boolean);
}

export function getAbilityScores(companion, companionType) {
  const baseAbilities = companionType.baseStats.abilities;
  const abilityIncreases = companion.overrides?.abilityIncreases || {};
  const advancementHistory = companion.advancementHistory || {};
  const increasesFromHistory = {};

  for (const entry of Object.values(advancementHistory)) {
    if (entry?.type === 'asi' && entry.ability) {
      increasesFromHistory[entry.ability] =
        (increasesFromHistory[entry.ability] || 0) + 1;
    }
  }

  const abilityScores = {};
  for (const ability of ABILITY_ORDER) {
    const baseScore = baseAbilities[ability];
    const overrideIncrease = abilityIncreases[ability] || 0;
    const historyIncrease = increasesFromHistory[ability] || 0;
    const score = baseScore + overrideIncrease + historyIncrease;
    abilityScores[ability] = {
      score,
      mod: abilityMod(score)
    };
  }
  return abilityScores;
}

export function getKnownFeats(companion, companionType) {
  const overrides = companion.overrides?.feats || [];
  const fromHistory = listFromHistory(companion.advancementHistory, 'feat');
  return Array.from(new Set([...overrides, ...fromHistory]));
}

export function getKnownAttacks(companion, companionType) {
  const base = listNames(companionType.baseAttacks || []);
  const overrides = companion.overrides?.attacks || [];
  const fromHistory = listFromHistory(companion.advancementHistory, 'attack');
  return Array.from(new Set([...base, ...overrides, ...fromHistory]));
}

export function getKnownSpecialSkills(companion, companionType) {
  const overrides = companion.overrides?.specialSkills || [];
  const fromHistory = listFromHistory(companion.advancementHistory, 'specialSkill');
  return Array.from(new Set([...overrides, ...fromHistory]));
}

export function getSavingThrowProficiencies(companion, companionType) {
  const base = new Set(companionType.baseStats.saves || []);
  const feats = getKnownFeats(companion, companionType);
  if (feats.includes('Fey Resilience')) {
    base.add('con');
  }
  return Array.from(base);
}

export function getSkillProficiencies(companion, companionType) {
  const profs = {};
  const baseSkills = companionType.baseStats.skills || {};
  for (const [skill, value] of Object.entries(baseSkills)) {
    if (value === 'expertise') {
      profs[skill] = { proficient: true, expertise: true };
    } else if (value === 'proficient') {
      profs[skill] = { proficient: true, expertise: false };
    }
  }

  const feats = getKnownFeats(companion, companionType);
  if (feats.includes('Planar Tracker')) {
    profs.survival = { proficient: true, expertise: profs.survival?.expertise || false };
  }
  if (feats.includes('Interplanar Tracker')) {
    profs.survival = { proficient: true, expertise: true };
  }
  return profs;
}

export function buildAbilityView(abilityScores) {
  return ABILITY_ORDER.map((ability) => ({
    key: ability,
    label: ability.toUpperCase(),
    score: abilityScores[ability].score,
    mod: abilityScores[ability].mod
  }));
}
