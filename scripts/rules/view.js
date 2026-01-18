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
import {
  ACTION_DETAILS,
  ACTION_DETAILS_BY_TYPE,
  BASE_TRAITS,
  FEAT_DETAILS,
  SPECIAL_SKILL_DETAILS
} from '../data/featureDetails.js';

export function buildCompanionView(state, companion, companionType) {
  const playerLevel = state.player.level;
  const pb = proficiencyBonus(playerLevel);
  const abilityScores = getAbilityScores(companion, companionType);
  const abilityView = buildAbilityView(abilityScores);
  const feats = getKnownFeats(companion, companionType);
  const attacks = getKnownAttacks(companion, companionType);
  const specialSkills = getKnownSpecialSkills(companion, companionType);
  const savingThrowProficiencies = getSavingThrowProficiencies(companion, companionType);
  const skillProficiencies = getSkillProficiencies(companion, companionType);
  const saveDcValue = saveDC(pb, abilityScores.dex.score);
  const actionDetails = {
    ...ACTION_DETAILS,
    ...(ACTION_DETAILS_BY_TYPE[companionType.id] || {})
  };
  const traitDetails = companionType.traits?.length ? companionType.traits : BASE_TRAITS;

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
      actions: attacks.map((name) => actionDetails[name]).filter(Boolean),
      feats: feats.map((name) => FEAT_DETAILS[name]).filter(Boolean),
      specialSkills: specialSkills.map((name) => SPECIAL_SKILL_DETAILS[name]).filter(Boolean)
    },
    advancement: getAdvancementContext(companion, companionType, playerLevel)
  };
}
