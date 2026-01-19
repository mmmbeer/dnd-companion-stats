import { proficiencyBonus } from './proficiency.js';
import { saveDC, buildSavingThrowView } from './savingThrows.js';
import {
  buildAbilityView,
  getAbilityScores,
  getKnownAttacks,
  getKnownFeats,
  getKnownSpecialSkills,
  getSavingThrowProficiencies,
  getSkillProficiencies
} from './companion.js';
import { getAdvancementContext } from './advancement.js';
import { buildSkillView } from './skills.js';

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

function buildFeatureIndex(entries) {
  const map = new Map();
  for (const entry of normalizeFeatureEntries(entries)) {
    map.set(entry.name, entry);
  }
  return map;
}

export function buildCompanionView(state, companion, companionType) {
  const playerLevel = Number(companion.playerLevel) || 1;
  const pb = proficiencyBonus(playerLevel);
  const abilityScores = getAbilityScores(companion, companionType);
  const abilityView = buildAbilityView(abilityScores);
  const feats = getKnownFeats(companion, companionType);
  const attacks = getKnownAttacks(companion, companionType);
  const specialSkills = getKnownSpecialSkills(companion, companionType);
  const savingThrowProficiencies = getSavingThrowProficiencies(companion, companionType);
  const skillProficiencies = getSkillProficiencies(companion, companionType);
  const saveDcValue = saveDC(pb, abilityScores.dex.score);
  const attackIndex = buildFeatureIndex([
    ...(companionType.baseAttacks || []),
    ...(companionType.lists?.attacks || [])
  ]);
  const featIndex = buildFeatureIndex(companionType.lists?.feats || []);
  const specialSkillIndex = buildFeatureIndex(companionType.lists?.specialSkills || []);
  const traitDetails = companionType.traits || [];

  const armorClass = companionType.baseStats.armorClass;
  const hitPoints = companionType.baseStats.hitPoints;
  const speed = companionType.baseStats.speed;
  const currentHealth = Number.isFinite(companion.health?.current)
    ? companion.health.current
    : hitPoints.max;
  const tempHealth = Number.isFinite(companion.health?.temp) ? companion.health.temp : 0;

  return {
    playerLevel,
    proficiencyBonus: pb,
    companionName: companion.name,
    companionTypeId: companionType.id,
    advancementHistory: companion.advancementHistory || {},
    feats,
    attacks,
    specialSkills,
    saveDc: saveDcValue,
    abilities: abilityView,
    savingThrows: buildSavingThrowView(abilityScores, pb, savingThrowProficiencies),
    skills: buildSkillView(abilityScores, pb, skillProficiencies),
    stats: {
      speed,
      armorClass,
      hitPoints,
      initiative: abilityScores.dex.mod,
      saveDc: saveDcValue,
      health: {
        current: currentHealth,
        max: hitPoints.max,
        temp: tempHealth
      }
    },
    features: {
      traits: traitDetails,
      actions: attacks.map((name) => attackIndex.get(name) || { name, description: [] }),
      feats: feats.map((name) => featIndex.get(name) || { name, description: [] }),
      specialSkills: specialSkills.map((name) => specialSkillIndex.get(name) || {
        name,
        description: []
      })
    },
    advancement: getAdvancementContext(companion, companionType, playerLevel)
  };
}
