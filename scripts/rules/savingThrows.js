import { abilityMod } from './abilities.js';
import { ABILITY_ORDER } from './companion.js';

export function saveDC(proficiencyBonus, dexScore) {
  return 8 + proficiencyBonus + abilityMod(dexScore);
}

export function buildSavingThrowView(abilityScores, proficiencyBonus, proficientSaves) {
  const proficientSet = new Set(proficientSaves || []);
  return ABILITY_ORDER.map((ability) => {
    const score = abilityScores[ability]?.score ?? 10;
    const mod = abilityMod(score);
    const proficient = proficientSet.has(ability);
    return {
      key: ability,
      label: ability.toUpperCase(),
      mod,
      total: mod + (proficient ? proficiencyBonus : 0),
      proficient
    };
  });
}
