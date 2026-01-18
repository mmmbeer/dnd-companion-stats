import { abilityMod } from './abilities.js';
import { SKILL_DEFINITIONS } from '../data/skillCatalog.js';

export function skillBonus(abilityScore, proficiencyBonus, skill) {
  const base = abilityMod(abilityScore);
  if (!skill) return base;
  if (skill.expertise) return base + proficiencyBonus * 2;
  if (skill.proficient) return base + proficiencyBonus;
  return base;
}

export function buildSkillView(abilityScores, proficiencyBonus, proficiencies) {
  return SKILL_DEFINITIONS.map((skill) => {
    const proficiency = proficiencies[skill.key] || {};
    const abilityScore = abilityScores[skill.ability]?.score ?? 10;
    const modifier = abilityMod(abilityScore);
    const bonus = skillBonus(abilityScore, proficiencyBonus, proficiency);
    return {
      key: skill.key,
      label: skill.label,
      ability: skill.ability.toUpperCase(),
      modifier,
      bonus,
      proficient: Boolean(proficiency.proficient),
      expertise: Boolean(proficiency.expertise)
    };
  });
}
