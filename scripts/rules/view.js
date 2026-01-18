import { proficiencyBonus } from './proficiency.js';
import { saveDC } from './savingThrows.js';
import {
  buildAbilityView,
  getAbilityScores,
  getKnownAttacks,
  getKnownFeats,
  getKnownSpecialSkills
} from './companion.js';
import { getAdvancementContext } from './advancement.js';

export function buildCompanionView(state, companion, companionType) {
  const playerLevel = state.player.level;
  const pb = proficiencyBonus(playerLevel);
  const abilityScores = getAbilityScores(companion, companionType);
  const abilityView = buildAbilityView(abilityScores);
  const feats = getKnownFeats(companion, companionType);
  const attacks = getKnownAttacks(companion, companionType);
  const specialSkills = getKnownSpecialSkills(companion, companionType);

  return {
    playerLevel,
    proficiencyBonus: pb,
    companionName: companion.name,
    abilities: abilityView,
    saveDc: saveDC(pb, abilityScores.dex.score),
    feats,
    attacks,
    specialSkills,
    advancement: getAdvancementContext(companion, companionType, playerLevel)
  };
}
