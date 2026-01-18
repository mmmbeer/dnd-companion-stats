export const BASE_TRAITS = [
  {
    name: 'Fey Nature',
    description: [
      'The blink dog has advantage on saving throws against being charmed, and magic cannot put it to sleep.'
    ]
  },
  {
    name: 'Keen Hearing and Smell',
    description: [
      'The blink dog has advantage on Wisdom (Perception) checks that rely on hearing or smell.'
    ]
  },
  {
    name: 'Companion Bond',
    description: [
      'The blink dog acts on its master\'s initiative. It obeys the master\'s verbal commands (no action required).',
      'If the master is incapacitated, the blink dog acts to defend them to the best of its ability.'
    ]
  },
  {
    name: 'Blink Step (1/Short Rest)',
    description: [
      'As a bonus action, the blink dog magically teleports up to 20 feet to an unoccupied space it can see.'
    ]
  }
];

export const ACTION_DETAILS = {
  Bite: {
    name: 'Bite',
    description: [
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      'Hit: 7 (1d8 + 3) piercing damage.'
    ]
  },
  'Phase Pounce': {
    name: 'Phase Pounce',
    description: [
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      'Hit: 1d10 + 3 slashing damage.',
      'If the blink dog teleported this turn or moved at least 20 feet straight toward the target, the target must succeed on a Strength saving throw or be knocked prone.',
      'On a failure, the blink dog can make a Bite attack as a bonus action.'
    ]
  },
  'Flurry of Claws': {
    name: 'Flurry of Claws',
    description: [
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      'Hit: 2d6 + 3 slashing damage.',
      'This attack ignores resistance to nonmagical slashing damage.'
    ]
  },
  'Blink Ram': {
    name: 'Blink Ram',
    description: [
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      'Hit: 1d8 + 3 bludgeoning damage.',
      'Immediately before making this attack, the blink dog can teleport up to 30 feet in a straight line toward the target.',
      'On a hit, the target must succeed on a Strength saving throw or be pushed 10 feet and knocked prone.'
    ]
  },
  'Displacement Rake': {
    name: 'Displacement Rake',
    description: [
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      'Hit: 1d6 + 3 slashing damage plus 1d6 force damage.',
      'Until the start of the blink dog\'s next turn, the target has disadvantage on attack rolls against the blink dog or its master.'
    ]
  }
};

export const FEAT_DETAILS = {
  'Phase Skirmisher': {
    name: 'Phase Skirmisher',
    description: [
      'When the blink dog uses Blink Step, it can make one Bite attack against a creature within 5 feet of its destination as part of the same bonus action.',
      'This attack does not provoke opportunity attacks.',
      'If the attack hits, the target cannot take reactions until the start of its next turn.'
    ]
  },
  'Pack Harrier': {
    name: 'Pack Harrier',
    description: [
      'The blink dog gains Pack Tactics.',
      'When the blink dog hits a creature that is within 5 feet of one of its allies, that creature has disadvantage on the next opportunity attack it makes before the end of its next turn.'
    ]
  },
  'Fey Phase Guard': {
    name: 'Fey Phase Guard',
    description: [
      'When the blink dog is targeted by an attack it can see, it can use its reaction to teleport up to 30 feet to an unoccupied space it can see.',
      'This reaction can be used a number of times equal to the blink dog\'s proficiency bonus per long rest.'
    ]
  },
  'Planar Tracker': {
    name: 'Planar Tracker',
    description: [
      'The blink dog gains proficiency in the Survival skill.',
      'It has advantage on Wisdom (Survival) checks made to track creatures on the same plane of existence.',
      'It always knows its own planar location.'
    ]
  },
  'Interplanar Tracker': {
    name: 'Interplanar Tracker',
    description: [
      'Prerequisite: Planar Tracker.',
      'The blink dog gains expertise in Survival.',
      'It has advantage on Wisdom (Survival) checks made to track creatures across planar boundaries.',
      'Once per long rest, the blink dog can determine the plane of existence and approximate location of a creature it has seen within the last month.'
    ]
  },
  'Blink Grip': {
    name: 'Blink Grip',
    description: [
      'When the blink dog hits a creature with its Bite, the target is grappled (escape DC = 8 + PB + Dex modifier) until the end of the blink dog\'s next turn.',
      'As a bonus action, the blink dog can make a Bite attack against a creature grappled by this feature.'
    ]
  },
  'Fey Resilience': {
    name: 'Fey Resilience',
    description: [
      'The blink dog gains proficiency in Constitution saving throws.',
      'When the blink dog is reduced to 0 hit points but not killed outright, it instead drops to 1 hit point and immediately shifts to the Feywild (or another plane it has previously visited).',
      'After 1 minute, it returns to the space it left or the nearest unoccupied space.',
      'Once this feature is used, it cannot be used again until the blink dog finishes a long rest.'
    ]
  },
  'Echo Blink': {
    name: 'Echo Blink',
    description: [
      'When the blink dog uses Blink Step, it leaves behind a perfect afterimage in the space it left until the start of its next turn.',
      'The first attack roll made against the blink dog before then is made with disadvantage.',
      'Alternatively, the blink dog\'s master can use their reaction to cause the afterimage to distract a creature within 5 feet of it, imposing disadvantage on that creature\'s next attack roll.'
    ]
  }
};

export const SPECIAL_SKILL_DETAILS = {
  'Flickering Hover': {
    name: 'Flickering Hover',
    description: [
      'The blink dog can hover a few inches above the ground.',
      'While hovering, it ignores nonmagical difficult terrain, does not trigger pressure plates or tripwires, and leaves no tracks unless it chooses to.'
    ]
  },
  'Fey Distraction': {
    name: 'Fey Distraction',
    description: [
      'As a bonus action, the blink dog creates illusory sights and sounds around itself or an ally within 10 feet.',
      'Each creature of the blink dog\'s choice within 30 feet must succeed on a Wisdom saving throw or have disadvantage on the next attack roll it makes before the end of its next turn.'
    ]
  },
  'Phase Sense': {
    name: 'Phase Sense',
    description: [
      'The blink dog can sense the presence of teleportation magic, planar travel, or invisible creatures within 30 feet.',
      'This sense reveals direction and distance but not precise location.'
    ]
  },
  'Blink Anchor': {
    name: 'Blink Anchor',
    description: [
      'When a creature within 30 feet uses teleportation or extradimensional movement, the blink dog can use its reaction to mark the creature for up to 1 minute.',
      'While marked, the blink dog always knows the creature\'s location and can teleport adjacent to it once before the mark ends.',
      'The mark ends early if the blink dog marks another creature or the creature dies.'
    ]
  },
  'Blinkcasting': {
    name: 'Blinkcasting',
    description: [
      'The blink dog gains innate fey magic.',
      'It learns one spell from the list below each time its proficiency bonus increases. These spells are innate abilities, not spellcasting.',
      'Spell List: Faerie Fire, Fog Cloud, Color Spray, Alter Self, Darkness, Invisibility, Enlarge/Reduce, Web, Enthrall, Detect Thoughts, Blur, Suggestion, Sleep, Longstrider, Charm Person.',
      'Each spell can be cast once per long rest unless otherwise specified.'
    ]
  }
};
