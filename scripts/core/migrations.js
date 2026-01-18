import { STATE_VERSION, DEFAULT_COMPANION_ID } from './state.js';
import { COMPANION_TYPES, DEFAULT_COMPANION_TYPE_ID } from '../data/companionTypes.js';

const LEGACY_ACTION_MAP = {
  ASI: 'asi',
  feats: 'feat',
  attacks: 'attack',
  specialSkills: 'specialSkill'
};

function migrateAdvancementHistory(history) {
  if (!history || typeof history !== 'object') return {};
  const migrated = {};
  for (const [level, entry] of Object.entries(history)) {
    if (!entry || typeof entry !== 'object') continue;
    const mappedType = LEGACY_ACTION_MAP[entry.type] || entry.type;
    if (mappedType === 'asi') {
      migrated[level] = {
        type: 'asi',
        ability: entry.ability || entry.value
      };
      continue;
    }
    if (mappedType === 'feat' || mappedType === 'attack' || mappedType === 'specialSkill') {
      migrated[level] = {
        type: mappedType,
        value: entry.value
      };
    }
  }
  return migrated;
}

function buildAbilityIncreases(baseAbilities, legacyAbilities) {
  const increases = {};
  if (!legacyAbilities || typeof legacyAbilities !== 'object') return increases;
  for (const [ability, baseScore] of Object.entries(baseAbilities)) {
    const legacyScore = Number(legacyAbilities[ability]);
    if (!Number.isFinite(legacyScore)) continue;
    const diff = legacyScore - baseScore;
    if (diff > 0) {
      increases[ability] = diff;
    }
  }
  return increases;
}

function normalizeLegacyList(list) {
  if (!Array.isArray(list)) return [];
  return Array.from(new Set(list.filter(Boolean)));
}

function migrateV1ToV2(stateV1) {
  const companionType = COMPANION_TYPES[DEFAULT_COMPANION_TYPE_ID];
  const legacyCompanion = stateV1.blinkDog || {};
  const baseAbilities = companionType.baseStats.abilities;
  const abilityIncreases = buildAbilityIncreases(baseAbilities, legacyCompanion.abilities);
  const legacyFeats = normalizeLegacyList(legacyCompanion.feats);
  const legacyAttacks = normalizeLegacyList(legacyCompanion.attacks).filter(
    (attack) => attack.toLowerCase() !== 'bite'
  );
  const legacySpecialSkills = normalizeLegacyList(legacyCompanion.specialSkills);

  return {
    version: 2,
    theme: stateV1.theme || 'light',
    player: {
      level: Number(stateV1.player?.level) || 1
    },
    companions: {
      [DEFAULT_COMPANION_ID]: {
        id: DEFAULT_COMPANION_ID,
        type: DEFAULT_COMPANION_TYPE_ID,
        name: 'Blink Dog',
        advancementHistory: migrateAdvancementHistory(legacyCompanion.advancementHistory),
        overrides: {
          abilityIncreases,
          feats: legacyFeats,
          attacks: legacyAttacks,
          specialSkills: legacySpecialSkills
        }
      }
    },
    activeCompanionId: DEFAULT_COMPANION_ID
  };
}

export function migrateState(state) {
  if (!state || typeof state !== 'object') return null;
  const version = Number(state.version) || 1;
  if (version === STATE_VERSION) return state;
  if (version === 1) return migrateV1ToV2(state);
  console.error('Unsupported state version:', version);
  return null;
}
