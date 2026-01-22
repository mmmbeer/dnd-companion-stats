import { buildCompanionView } from '../rules/view.js';

const PDF_URL = new URL('../../docs/5E_CharacterSheet_Fillable.pdf', import.meta.url);
const DEFAULT_EXPORT_NAME = 'companion-character-sheet.pdf';

const ABILITY_FIELD_MAP = {
  str: { score: 'STR', mod: 'STRmod' },
  dex: { score: 'DEX', mod: 'DEXmod ' },
  con: { score: 'CON', mod: 'CONmod' },
  int: { score: 'INT', mod: 'INTmod' },
  wis: { score: 'WIS', mod: 'WISmod' },
  cha: { score: 'CHA', mod: 'CHamod' }
};

const SKILL_FIELD_MAP = {
  acrobatics: 'Acrobatics',
  animalHandling: 'Animal',
  arcana: 'Arcana',
  athletics: 'Athletics',
  deception: 'Deception ',
  history: 'History ',
  insight: 'Insight',
  intimidation: 'Intimidation',
  investigation: 'Investigation ',
  medicine: 'Medicine',
  nature: 'Nature',
  perception: 'Perception ',
  performance: 'Performance',
  persuasion: 'Persuasion',
  religion: 'Religion',
  sleightOfHand: 'SleightofHand',
  stealth: 'Stealth ',
  survival: 'Survival'
};

const SAVING_THROW_FIELD_MAP = {
  str: 'ST Strength',
  dex: 'ST Dexterity',
  con: 'ST Constitution',
  int: 'ST Intelligence',
  wis: 'ST Wisdom',
  cha: 'ST Charisma'
};

const SAVING_THROW_CHECKBOX_MAP = {
  str: 'Check Box 11',
  dex: 'Check Box 18',
  con: 'Check Box 19',
  int: 'Check Box 20',
  wis: 'Check Box 21',
  cha: 'Check Box 22'
};

const SKILL_CHECKBOX_MAP = {
  acrobatics: 'Check Box 23',
  animalHandling: 'Check Box 24',
  arcana: 'Check Box 25',
  athletics: 'Check Box 26',
  deception: 'Check Box 27',
  history: 'Check Box 28',
  insight: 'Check Box 29',
  intimidation: 'Check Box 30',
  investigation: 'Check Box 31',
  medicine: 'Check Box 32',
  nature: 'Check Box 33',
  perception: 'Check Box 34',
  performance: 'Check Box 35',
  persuasion: 'Check Box 36',
  religion: 'Check Box 37',
  sleightOfHand: 'Check Box 38',
  stealth: 'Check Box 39',
  survival: 'Check Box 40'
};

const WEAPON_FIELDS = [
  { name: 'Wpn Name', atk: 'Wpn1 AtkBonus', dmg: 'Wpn1 Damage' },
  { name: 'Wpn Name 2', atk: 'Wpn2 AtkBonus ', dmg: 'Wpn2 Damage ' },
  { name: 'Wpn Name 3', atk: 'Wpn3 AtkBonus  ', dmg: 'Wpn3 Damage ' }
];

function getPdfLib() {
  const pdfLib = window.PDFLib;
  if (!pdfLib) {
    throw new Error('PDFLib is not available.');
  }
  return pdfLib;
}

function formatSigned(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '';
  return numeric >= 0 ? `+${numeric}` : String(numeric);
}

function formatNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '';
  return String(numeric);
}

function sanitizeFilename(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return DEFAULT_EXPORT_NAME;
  const sanitized = trimmed.replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, ' ').trim();
  if (!sanitized) return DEFAULT_EXPORT_NAME;
  return `${sanitized}.pdf`;
}

function setFieldFontSize(form, name, size) {
  try {
    const field = form.getTextField(name);
    field.setFontSize(size);
  } catch (error) {
    try {
      const field = form.getField(name);
      if (typeof field?.setFontSize === 'function') {
        field.setFontSize(size);
      }
    } catch (innerError) {
      // Ignore missing fields.
    }
  }
}

function setTextField(form, name, value) {
  if (value === null || value === undefined) return;
  const text = String(value);
  if (!text) return;
  try {
    const field = form.getTextField(name);
    field.setText(text);
  } catch (error) {
    try {
      const field = form.getField(name);
      if (typeof field?.setText === 'function') {
        field.setText(text);
      }
    } catch (innerError) {
      // Ignore missing fields.
    }
  }
}

function setCheckField(form, name, checked) {
  if (!name) return;
  try {
    const field = form.getCheckBox(name);
    if (checked) {
      field.check();
    } else {
      field.uncheck();
    }
  } catch (error) {
    try {
      const field = form.getField(name);
      if (!field) return;
      if (checked && typeof field.check === 'function') {
        field.check();
      } else if (!checked && typeof field.uncheck === 'function') {
        field.uncheck();
      }
    } catch (innerError) {
      // Ignore missing fields.
    }
  }
}

function extractArmorClassValue(armorClass) {
  if (Number.isFinite(armorClass)) return armorClass;
  if (!armorClass || typeof armorClass !== 'object') return '';
  if (Number.isFinite(armorClass.value)) return armorClass.value;
  if (Number.isFinite(armorClass.base)) return armorClass.base;
  return '';
}

function parseHitBonus(lines) {
  const line = (lines || []).find((entry) => /to hit/i.test(entry)) || '';
  const match = line.match(/([+-]\d+)\s*to hit/i);
  return match ? match[1] : '';
}

function parseDamage(lines) {
  const line = (lines || []).find((entry) => /^Hit:/i.test(entry)) || '';
  if (!line) return '';
  const parenMatch = line.match(/\(([^)]+)\)/);
  if (parenMatch) {
    return parenMatch[1].replace(/\s+/g, ' ').trim();
  }
  const diceMatch = line.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);
  if (diceMatch) {
    return diceMatch[1].replace(/\s+/g, ' ').trim();
  }
  return '';
}

function formatAttackSummary(action) {
  if (!action) return '';
  const hitBonus = parseHitBonus(action.description || []);
  const damage = parseDamage(action.description || []);
  const parts = [action.name];
  if (hitBonus) parts.push(`${hitBonus} to hit`);
  if (damage) parts.push(`${damage} damage`);
  return parts.join(', ');
}

function formatFeatureBlock(label, entries) {
  if (!Array.isArray(entries) || entries.length === 0) return '';
  const lines = [`${label}:`];
  for (const entry of entries) {
    if (!entry?.name) continue;
    lines.push(`- ${entry.name}`);
    const descriptions = Array.isArray(entry.description) ? entry.description : [];
    for (const description of descriptions) {
      if (description) {
        lines.push(`  ${description}`);
      }
    }
  }
  return lines.join('\n');
}

function buildFeaturesText(view) {
  const blocks = [
    formatFeatureBlock('Traits', view.features?.traits || []),
    formatFeatureBlock('Feats', view.features?.feats || []),
    formatFeatureBlock('Special Skills', view.features?.specialSkills || [])
  ].filter(Boolean);
  return blocks.join('\n\n');
}

function buildAdvancementHistoryText(view) {
  const history = view.advancementHistory || {};
  const entries = Object.entries(history)
    .map(([level, entry]) => ({
      level: Number(level),
      entry
    }))
    .filter((item) => Number.isFinite(item.level) && item.entry)
    .sort((a, b) => a.level - b.level);

  if (!entries.length) return '';

  const lines = ['Advancement History:'];
  for (const item of entries) {
    const entry = item.entry || {};
    let detail = '';
    if (entry.type === 'asi') {
      detail = `ASI +1 ${String(entry.ability || '').toUpperCase()}`;
    } else if (entry.type === 'feat') {
      detail = `Feat — ${entry.value || ''}`;
    } else if (entry.type === 'attack') {
      detail = `Attack — ${entry.value || ''}`;
    } else if (entry.type === 'specialSkill') {
      detail = `Special Skill — ${entry.value || ''}`;
    } else if (entry.type) {
      detail = `${entry.type} — ${entry.value || ''}`;
    }
    lines.push(`Level ${item.level}: ${detail}`.trim());
  }

  return lines.join('\n');
}

function buildAttacksText(view) {
  const actions = view.features?.actions || [];
  if (!actions.length) return '';
  return actions.map((action) => formatAttackSummary(action)).filter(Boolean).join('\n');
}

function getPassivePerception(view) {
  const perception = (view.skills || []).find((skill) => skill.key === 'perception');
  if (!perception) return '';
  const total = Number(perception.bonus);
  if (!Number.isFinite(total)) return '';
  return total + 10;
}

function setSkillFields(form, view) {
  for (const skill of view.skills || []) {
    const fieldName = SKILL_FIELD_MAP[skill.key];
    if (!fieldName) continue;
    setTextField(form, fieldName, formatSigned(skill.bonus));
    const checkboxName = SKILL_CHECKBOX_MAP[skill.key];
    if (checkboxName) {
      setCheckField(form, checkboxName, skill.proficient || skill.expertise);
    }
  }
}

function setSavingThrowFields(form, view) {
  for (const save of view.savingThrows || []) {
    const fieldName = SAVING_THROW_FIELD_MAP[save.key];
    if (!fieldName) continue;
    setTextField(form, fieldName, formatSigned(save.total));
    const checkboxName = SAVING_THROW_CHECKBOX_MAP[save.key];
    if (checkboxName) {
      setCheckField(form, checkboxName, save.proficient);
    }
  }
}

function setAttackFields(form, view) {
  const actions = view.features?.actions || [];
  WEAPON_FIELDS.forEach((fieldSet, index) => {
    const action = actions[index];
    if (!action) return;
    setTextField(form, fieldSet.name, action.name);
    const hitBonus = parseHitBonus(action.description || []);
    const damage = parseDamage(action.description || []);
    if (hitBonus) {
      setTextField(form, fieldSet.atk, hitBonus);
    }
    if (damage) {
      setTextField(form, fieldSet.dmg, damage);
    }
  });
}

export async function exportCompanionToPdf({ state, companion, companionType }) {
  if (!companion || !companionType) {
    throw new Error('No active companion to export.');
  }

  const view = buildCompanionView(state, companion, companionType);
  const { PDFDocument, StandardFonts } = getPdfLib();

  const response = await fetch(PDF_URL);
  if (!response.ok) {
    throw new Error('Failed to load the character sheet PDF.');
  }

  const pdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const armorClass = extractArmorClassValue(view.stats?.armorClass);
  const dexAbility = view.abilities?.find((ability) => ability.key === 'dex');
  const dexMod = dexAbility?.mod ?? view.stats?.initiative;

  setTextField(form, 'CharacterName', view.companionName);
  setTextField(form, 'CharacterName 2', view.companionName);
  setTextField(form, 'ClassLevel', `Companion Level ${view.playerLevel}`);
  setTextField(form, 'Race ', companionType.name || view.companionTypeId);
  setTextField(form, 'Background', 'Companion');
  setTextField(form, 'Alignment', '');
  setTextField(form, 'PlayerName', '');

  setTextField(form, 'AC', formatNumber(armorClass));
  setTextField(form, 'Initiative', formatSigned(view.stats?.initiative));
  setTextField(form, 'Speed', formatNumber(view.stats?.speed));
  setTextField(form, 'HPMax', formatNumber(view.stats?.health?.max));
  setTextField(form, 'HPCurrent', formatNumber(view.stats?.health?.current));
  setTextField(form, 'HPTemp', formatNumber(view.stats?.health?.temp));

  const hitDice = String(view.stats?.hitPoints?.formula || '').match(/(\d+)d(\d+)/i);
  if (hitDice) {
    setTextField(form, 'HDTotal', hitDice[1]);
    setTextField(form, 'HD', `d${hitDice[2]}`);
  }

  setTextField(form, 'ProfBonus', formatSigned(view.proficiencyBonus));
  setTextField(form, 'Passive', formatNumber(getPassivePerception(view)));

  for (const ability of view.abilities || []) {
    const mapping = ABILITY_FIELD_MAP[ability.key];
    if (!mapping) continue;
    setTextField(form, mapping.score, formatNumber(ability.score));
    setTextField(form, mapping.mod, formatSigned(ability.mod));
  }

  setSkillFields(form, view);
  setSavingThrowFields(form, view);

  const featuresText = buildFeaturesText(view);
  if (featuresText) {
    setFieldFontSize(form, 'Features and Traits', 10);
    setTextField(form, 'Features and Traits', featuresText);
  }

  const attacksText = buildAttacksText(view);
  if (attacksText) {
    setFieldFontSize(form, 'AttacksSpellcasting', 10);
    setTextField(form, 'AttacksSpellcasting', attacksText);
  }

  setAttackFields(form, view);

  const advancementText = buildAdvancementHistoryText(view);
  if (advancementText) {
    setFieldFontSize(form, 'Feat+Traits', 10);
    setTextField(form, 'Feat+Traits', advancementText);
  }

  if (Number.isFinite(view.saveDc)) {
    setTextField(form, 'SpellSaveDC  2', formatNumber(view.saveDc));
  }
  if (Number.isFinite(dexMod) && Number.isFinite(view.proficiencyBonus)) {
    setTextField(form, 'SpellAtkBonus 2', formatSigned(dexMod + view.proficiencyBonus));
    setTextField(form, 'SpellcastingAbility 2', 'DEX');
    setTextField(form, 'Spellcasting Class 2', 'Fey');
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(font);

  const filledBytes = await pdfDoc.save();
  const blob = new Blob([filledBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = sanitizeFilename(view.companionName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
