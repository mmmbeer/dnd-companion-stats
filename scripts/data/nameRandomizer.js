import { BLINK_DOG_NAMES } from '../../data/names/blink-dogs.js';
import { FLUMPH_NAMES } from '../../data/names/flumph.js';
import { PSEUDODRAGON_NAMES } from '../../data/names/pseudo-dragons.js';
import { TRESSYM_NAMES } from '../../data/names/tressym.js';

const NAME_POOLS = new Map([
  ['blink_dog', BLINK_DOG_NAMES],
  ['pseudo_dragon', PSEUDODRAGON_NAMES],
  ['flumph', FLUMPH_NAMES],
  ['tressym', TRESSYM_NAMES]
]);

function pickRandomEntry(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickNameParts(list, count) {
  if (!list.length || count <= 0) return [];
  const picks = new Set();
  const target = Math.min(count, list.length);
  while (picks.size < target) {
    picks.add(pickRandomEntry(list));
  }
  return Array.from(picks);
}

export function getRandomCompanionName(typeId) {
  const pool = NAME_POOLS.get(typeId);
  if (!pool || pool.length === 0) return null;
  const partCount = Math.floor(Math.random() * 3) + 1;
  const parts = pickNameParts(pool, partCount);
  if (!parts.length) return null;
  return parts.join(' ');
}
