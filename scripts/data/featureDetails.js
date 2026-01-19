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
    name: 'Blink Step',
    description: [
      'As a bonus action, the blink dog magically teleports up to 20 feet to an unoccupied space it can see up to its proficiency bonus per long rest.'
    ]
  }
];

export const ACTION_DETAILS_BY_TYPE = {
  pseudo_dragon: {
    Bite: {
      name: 'Bite',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 5 (1d6 + 3) piercing damage.'
      ]
    },
    Sting: {
      name: 'Sting',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature.',
        'Hit: 4 (1d4 + 2) piercing damage, and the target must succeed on a Constitution saving throw or be poisoned for 1 hour.',
        'If the saving throw fails by 5 or more, the target falls unconscious while poisoned in this way.',
        'The target wakes if it takes damage or another creature uses an action to shake it awake.'
      ]
    },
    'Precision Sting': {
      name: 'Precision Sting',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d4 + 3 piercing damage plus venom.',
        'On a failed save, the target\'s speed is reduced to 0 until the end of its next turn.'
      ]
    },
    'Wing Buffet': {
      name: 'Wing Buffet',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d6 + 3 bludgeoning damage.',
        'The target must succeed on a Strength saving throw or be pushed 10 feet.'
      ]
    },
    'Venom Mark': {
      name: 'Venom Mark',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature.',
        'Hit: 1d4 + 3 piercing damage.',
        'Until the end of the pseudodragon\'s next turn, the pseudodragon and its master have advantage on the first attack roll made against the target.'
      ]
    },
    'Psychic Needle': {
      name: 'Psychic Needle',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d6 + 3 psychic damage.',
        'The target has disadvantage on the next concentration check it makes before the end of its next turn.'
      ]
    }
  },
  flumph: {
    Tentacle: {
      name: 'Tentacle',
      description: [
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
        'Hit: 5 (1d6 + 2) bludgeoning damage.'
      ]
    },
    'Stench Spray': {
      name: 'Stench Spray',
      description: [
        'Recharge 5-6.',
        'Each creature in a 15-foot cone must succeed on a Constitution saving throw or be poisoned until the end of its next turn.'
      ]
    },
    'Psychic Pulse': {
      name: 'Psychic Pulse',
      description: [
        'Ranged Psionic Attack: +4 to hit, range 30 ft., one target.',
        'Hit: 1d8 psychic damage.',
        'The target has disadvantage on its next attack roll before the end of its next turn.'
      ]
    },
    'Disorienting Tentacle': {
      name: 'Disorienting Tentacle',
      description: [
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
        'Hit: 1d6 + 2 bludgeoning damage.',
        'The target\'s speed is reduced to 0 until the start of its next turn.'
      ]
    },
    'Mind Ripple': {
      name: 'Mind Ripple',
      description: [
        'Psionic Burst: Each creature of the flumph\'s choice within 10 feet must succeed on a Wisdom saving throw or take 1d6 psychic damage.',
        'On a failed save, the target has disadvantage on its next saving throw before the end of its next turn.'
      ]
    },
    'Psychic Rebound': {
      name: 'Psychic Rebound',
      description: [
        'Reaction.',
        'When a creature within 15 feet hits the flumph or its master with an attack, the attacker takes psychic damage equal to the flumph\'s proficiency bonus.',
        'The attacker has disadvantage on its next attack roll.'
      ]
    }
  },
  tressym: {
    Claws: {
      name: 'Claws',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 5 (1d4 + 3) slashing damage.'
      ]
    },
    'Arcane Disrupting Claws': {
      name: 'Arcane Disrupting Claws',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d6 + 3 slashing damage.',
        'If the target is concentrating on a spell, it has disadvantage on the concentration saving throw caused by this damage.'
      ]
    },
    'Wing Slash': {
      name: 'Wing Slash',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d4 + 3 slashing damage.',
        'The target cannot take reactions until the start of its next turn.'
      ]
    },
    'Arcane Pounce': {
      name: 'Arcane Pounce',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d8 + 3 slashing damage.',
        'If the tressym flew at least 20 feet straight toward the target this turn, the target must succeed on a Dexterity saving throw or be knocked prone.'
      ]
    },
    Spellrake: {
      name: 'Spellrake',
      description: [
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
        'Hit: 1d4 + 3 slashing damage plus 1d6 force damage.',
        'Until the start of the tressym\'s next turn, the target has disadvantage on spell attack rolls.'
      ]
    }
  }
};

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
  },
  'Draconic Watcher': {
    name: 'Draconic Watcher',
    description: [
      'The pseudodragon gains advantage on initiative rolls.',
      'In addition, it cannot be surprised while conscious.'
    ]
  },
  'Venom Savant': {
    name: 'Venom Savant',
    description: [
      'When a creature fails its saving throw against the pseudodragon\'s Sting, the poisoned condition lasts an additional hour.',
      'If the creature falls unconscious, it has disadvantage on the saving throw made to resist waking early.'
    ]
  },
  'Winged Interference': {
    name: 'Winged Interference',
    description: [
      'When a creature within 5 feet of the pseudodragon attacks the pseudodragon\'s master, the pseudodragon can use its reaction to impose disadvantage on the attack roll by distracting the attacker.',
      'Uses equal to proficiency bonus per long rest.'
    ]
  },
  'Arcane Eavesdropper': {
    name: 'Arcane Eavesdropper',
    description: [
      'The pseudodragon can sense active spellcasting, magical effects, or spell concentration within 30 feet.',
      'This sense reveals direction and approximate strength but not spell details.'
    ]
  },
  'Psychic Link': {
    name: 'Psychic Link',
    description: [
      'The range of the pseudodragon\'s telepathy with its master increases to 1 mile, provided both are on the same plane.',
      'Once per long rest, the pseudodragon can relay a brief sensory snapshot to its master as a reaction.'
    ]
  },
  'Draconic Resilience': {
    name: 'Draconic Resilience',
    description: [
      'The pseudodragon gains proficiency in Constitution saving throws.',
      'When reduced to 0 hit points but not killed outright, it instead drops to 1 hit point and becomes invisible until the end of its next turn.',
      'Once used, this feature cannot be used again until a long rest.'
    ]
  },
  'Venom Control': {
    name: 'Venom Control',
    description: [
      'When the pseudodragon hits a creature with Sting, it may choose to suppress the unconscious effect and instead impose disadvantage on the creature\'s next saving throw before the end of its next turn.'
    ]
  },
  'Psychic Dampener': {
    name: 'Psychic Dampener',
    description: [
      'Enemies within 10 feet of the flumph have disadvantage on the first attack roll they make each turn.'
    ]
  },
  'Empathic Shield': {
    name: 'Empathic Shield',
    description: [
      'When an ally within 30 feet takes damage, the flumph can use its reaction to reduce the damage by 1d8 + the flumph\'s proficiency bonus.',
      'This reaction can be used a number of times equal to the flumph\'s proficiency bonus per long rest.'
    ]
  },
  'Thought Static': {
    name: 'Thought Static',
    description: [
      'Creatures poisoned by the flumph\'s Stench Spray have disadvantage on Wisdom saving throws until the end of their next turn.'
    ]
  },
  'Aberrant Insight': {
    name: 'Aberrant Insight',
    description: [
      'The flumph gains expertise in Insight.',
      'It also has advantage on Insight checks made to detect hostile intent or emotional manipulation.'
    ]
  },
  'Mind Anchor': {
    name: 'Mind Anchor',
    description: [
      'While the flumph is within 10 feet of its master, neither can be charmed or frightened.'
    ]
  },
  'Psionic Recoil': {
    name: 'Psionic Recoil',
    description: [
      'When the flumph succeeds on a saving throw against a spell or magical effect, the caster takes psychic damage equal to the flumph\'s proficiency bonus.'
    ]
  },
  'Spell Sniffer': {
    name: 'Spell Sniffer',
    description: [
      'The range of Spell Sense increases to 60 feet.',
      'In addition, the tressym can distinguish illusions from other magical effects.'
    ]
  },
  'Illusion Breaker': {
    name: 'Illusion Breaker',
    description: [
      'When the tressym touches an illusion, the illusion is revealed to all creatures within 10 feet until the end of the tressym\'s next turn.'
    ]
  },
  'Arcane Interference': {
    name: 'Arcane Interference',
    description: [
      'When a creature within 30 feet casts a spell, the tressym can use its reaction to impose disadvantage on one attack roll or saving throw caused by that spell.',
      'This reaction can be used a number of times equal to the tressym\'s proficiency bonus per long rest.'
    ]
  },
  'Vigilant Perch': {
    name: 'Vigilant Perch',
    description: [
      'While perched on its master, the tressym grants advantage on initiative rolls.',
      'It also grants advantage on the first saving throw against a spell the master makes each combat.'
    ]
  },
  'Nine Lives': {
    name: 'Nine Lives',
    description: [
      'When the tressym is reduced to 0 hit points but not killed outright, it instead drops to 1 hit point and becomes invisible until the end of its next turn.',
      'Once this feature is used, it cannot be used again until the tressym finishes a long rest.'
    ]
  },
  'Arcane Tail Lash': {
    name: 'Arcane Tail Lash',
    description: [
      'When a creature within 5 feet of the tressym casts a spell, the tressym can make a Claws attack against that creature as a reaction.'
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
  },
  'Silent Flight': {
    name: 'Silent Flight',
    description: [
      'The pseudodragon\'s flight does not provoke opportunity attacks.'
    ]
  },
  'Venom Sense': {
    name: 'Venom Sense',
    description: [
      'The pseudodragon can sense poison, venomous creatures, or poisoned conditions within 30 feet.'
    ]
  },
  'Arcane Perch': {
    name: 'Arcane Perch',
    description: [
      'While perched on its master, the pseudodragon grants advantage on one saving throw against a spell once per long rest.',
      'The pseudodragon chooses when this benefit applies.'
    ]
  },
  'Subtle Invisibility': {
    name: 'Subtle Invisibility',
    description: [
      'As a bonus action, the pseudodragon becomes invisible until the start of its next turn or until it makes an attack.',
      'Uses equal to proficiency bonus per long rest.'
    ]
  },
  'Draconic Focus': {
    name: 'Draconic Focus',
    description: [
      'Once per long rest, when the pseudodragon forces a saving throw, it can impose disadvantage on that saving throw.'
    ]
  },
  'Empathic Scan': {
    name: 'Empathic Scan',
    description: [
      'As a bonus action, the flumph learns the emotional state and hostile intent of creatures within 30 feet until the start of its next turn.'
    ]
  },
  'Psychic Veil': {
    name: 'Psychic Veil',
    description: [
      'Once per long rest, the flumph and its master become invisible to creatures relying on telepathy, empathy, or psychic senses for 1 minute.'
    ]
  },
  'Hover Guard': {
    name: 'Hover Guard',
    description: [
      'While the flumph is adjacent to its master, the master has advantage on saving throws against charm and fear effects.'
    ]
  },
  'Mental Static': {
    name: 'Mental Static',
    description: [
      'Creatures within 10 feet of the flumph have disadvantage on the first concentration check they make each round.'
    ]
  },
  'Silent Watcher': {
    name: 'Silent Watcher',
    description: [
      'The tressym does not trigger magical alarms, glyphs, or wards while flying, unless it chooses to.'
    ]
  },
  'Arcane Alert': {
    name: 'Arcane Alert',
    description: [
      'As a bonus action, the tressym warns an ally within 30 feet.',
      'That ally gains advantage on the next saving throw it makes against a spell before the end of its next turn.'
    ]
  },
  'Illusion Sense': {
    name: 'Illusion Sense',
    description: [
      'The tressym automatically knows when it sees an illusion, though it must still act normally to reveal or interact with it.'
    ]
  },
  'Spell Anchor': {
    name: 'Spell Anchor',
    description: [
      'When a creature within 30 feet teleports or uses magical movement, the tressym can use its reaction to mark that creature for 1 minute.',
      'While marked, the tressym always knows the creature\'s location.',
      'The mark ends early if the tressym marks another creature or the creature dies.'
    ]
  }
};
