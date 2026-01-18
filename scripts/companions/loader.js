import { registerCompanionTypes } from './registry.js';

const MANIFEST_URL = new URL('../../data/companions/manifest.json', import.meta.url);

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.json();
}

function validateManifest(manifest) {
  if (!isPlainObject(manifest)) {
    return { ok: false, errors: ['Manifest must be an object.'] };
  }
  if (typeof manifest.defaultCompanionTypeId !== 'string') {
    return { ok: false, errors: ['Manifest requires defaultCompanionTypeId.'] };
  }
  if (!Array.isArray(manifest.types) || !manifest.types.every((entry) => typeof entry === 'string')) {
    return { ok: false, errors: ['Manifest requires a types array of strings.'] };
  }
  return { ok: true, errors: [] };
}

export async function loadCompanionTypes() {
  const manifest = await fetchJson(MANIFEST_URL);
  const manifestResult = validateManifest(manifest);
  if (!manifestResult.ok) {
    console.error('Companion manifest invalid.', manifestResult.errors);
    return { ok: false, defaultCompanionTypeId: null, registered: [] };
  }

  const types = [];
  for (const entry of manifest.types) {
    const url = new URL(entry, MANIFEST_URL);
    try {
      const data = await fetchJson(url);
      types.push(data);
    } catch (error) {
      console.error(`Failed to load companion type from ${entry}.`, error);
    }
  }

  const registerResult = registerCompanionTypes(types);
  if (!registerResult.ok) {
    console.error('Companion type registration errors.', registerResult.errors);
  }

  return {
    ok: registerResult.ok,
    defaultCompanionTypeId: manifest.defaultCompanionTypeId,
    registered: registerResult.registered
  };
}
