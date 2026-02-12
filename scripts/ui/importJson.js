function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clampPlayerLevel(value) {
  const numeric = Math.floor(toNumber(value, 1));
  if (numeric < 1) return 1;
  if (numeric > 20) return 20;
  return numeric;
}

function normalizeHealth(health) {
  if (!isPlainObject(health)) return undefined;
  return {
    current: toNumber(health.current, 0),
    temp: toNumber(health.temp, 0)
  };
}

function getCompanionFromPayload(payload) {
  if (isPlainObject(payload.companion)) {
    return payload.companion;
  }
  return payload;
}

export async function readCompanionImportFile(file) {
  if (!file) {
    throw new Error('No JSON file selected.');
  }

  const text = await file.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error('Selected file is not valid JSON.');
  }

  if (!isPlainObject(parsed)) {
    throw new Error('Import JSON must contain an object.');
  }

  const source = getCompanionFromPayload(parsed);
  if (!isPlainObject(source)) {
    throw new Error('Import JSON does not contain a valid companion object.');
  }

  const typeId = String(source.type || '').trim();
  if (!typeId) {
    throw new Error('Import JSON is missing companion type.');
  }

  const name = String(source.name || '').trim() || 'Imported Companion';

  return {
    type: typeId,
    name,
    playerLevel: clampPlayerLevel(source.playerLevel),
    advancementHistory: isPlainObject(source.advancementHistory)
      ? source.advancementHistory
      : {},
    overrides: isPlainObject(source.overrides) ? source.overrides : {},
    health: normalizeHealth(source.health)
  };
}
