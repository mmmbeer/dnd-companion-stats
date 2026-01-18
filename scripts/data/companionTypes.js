import { FEATS } from './feats.js';
import { ATTACKS } from './attacks.js';
import { SPECIAL_SKILLS } from './skills.js';

export const DEFAULT_COMPANION_TYPE_ID = 'blink_dog';

export const COMPANION_TYPES = {
  blink_dog: {
    id: 'blink_dog',
    name: 'Blink Dog',
    baseStats: {
      abilities: {
        str: 12,
        dex: 16,
        con: 12,
        int: 8,
        wis: 14,
        cha: 11
      },
      armorClass: {
        value: 14,
        note: 'natural agility'
      },
      hitPoints: {
        max: 27,
        formula: '5d8 + 5'
      },
      speed: 40,
      saves: ['dex', 'wis'],
      skills: {
        perception: 'proficient',
        stealth: 'proficient'
      }
    },
    advancement: {
      startsAtLevel: 4,
      even: {
        type: 'asi',
        maxScore: 20
      },
      odd: {
        choices: ['feats', 'attacks', 'specialSkills']
      }
    },
    baseAttacks: ['Bite'],
    lists: {
      feats: FEATS,
      attacks: ATTACKS,
      specialSkills: SPECIAL_SKILLS
    }
  }
};
