import { abilityMod } from './abilities.js';

export function skillBonus(abilityScore, proficiencyBonus, skill) {
  const base = abilityMod(abilityScore);
  if (!skill) return base;
  if (skill.expertise) return base + proficiencyBonus * 2;
  if (skill.proficient) return base + proficiencyBonus;
  return base;
}
