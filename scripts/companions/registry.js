import { validateCompanionInstance, validateCompanionType } from './schemas.js';

const REGISTRY = new Map();

export function registerCompanionTypes(types) {
  const errors = [];
  if (!Array.isArray(types)) {
    return { ok: false, errors: ['Companion types must be an array.'], registered: [] };
  }

  const registered = [];
  for (const type of types) {
    const result = validateCompanionType(type);
    if (!result.ok) {
      errors.push(
        `Companion type "${type?.id || 'unknown'}" failed validation: ${result.errors.join(', ')}`
      );
      continue;
    }
    if (REGISTRY.has(type.id)) {
      errors.push(`Duplicate companion type id "${type.id}".`);
      continue;
    }
    REGISTRY.set(type.id, type);
    registered.push(type);
  }

  return { ok: errors.length === 0, errors, registered };
}

export function getCompanionType(typeId) {
  return REGISTRY.get(typeId) || null;
}

export function listCompanionTypes() {
  return Array.from(REGISTRY.values());
}

export function validateCompanionInstanceWithRegistry(instance) {
  const base = validateCompanionInstance(instance);
  if (!base.ok) return base;
  if (!REGISTRY.has(instance.type)) {
    return {
      ok: false,
      errors: [`Companion instance type "${instance.type}" is not registered.`]
    };
  }
  return base;
}
