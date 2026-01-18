import { abilityMod } from './abilities.js';

export function saveDC(proficiencyBonus, dexScore) {
  return 8 + proficiencyBonus + abilityMod(dexScore);
}
