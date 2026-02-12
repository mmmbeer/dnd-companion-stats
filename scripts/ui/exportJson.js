const EXPORT_FORMAT = 'dnd-companion.companion';
const EXPORT_VERSION = 1;

function sanitizeFilename(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'companion-export.json';
  const sanitized = trimmed.replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, ' ').trim();
  if (!sanitized) return 'companion-export.json';
  return `${sanitized}.json`;
}

function buildExportPayload(companion) {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    companion: {
      id: companion.id,
      name: companion.name,
      type: companion.type,
      playerLevel: companion.playerLevel,
      advancementHistory: companion.advancementHistory || {},
      overrides: companion.overrides || {},
      health: companion.health || undefined
    }
  };
}

export function exportCompanionToJson(companion) {
  if (!companion || typeof companion !== 'object') {
    throw new Error('No active companion to export.');
  }

  const payload = buildExportPayload(companion);
  const data = JSON.stringify(payload, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = sanitizeFilename(companion.name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
