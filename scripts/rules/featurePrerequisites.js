const PREREQUISITE_LINE_PATTERN = /^Prerequisites?:\s*(.+)$/i;
const LEVEL_PREREQUISITE_PATTERN = /\b(?:companion\s+)?level\s+(\d+)\b/i;
const FEATURE_SUFFIX_PATTERN = /\b(?:feat|trait|reaction|action|attack|special\s+skill|skill)s?\b/gi;

function splitPrerequisiteTokens(text) {
  return String(text)
    .split(/[;,]/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function normalizePrerequisiteFeatureName(value) {
  return String(value)
    .replace(/^\s*the\s+/i, '')
    .replace(FEATURE_SUFFIX_PATTERN, '')
    .replace(/[.]+$/g, '')
    .trim();
}

export function parseFeaturePrerequisites(option) {
  const prerequisites = [];
  if (!option || typeof option !== 'object') return prerequisites;

  const explicit = option.prerequisites;
  if (Array.isArray(explicit)) {
    for (const entry of explicit) {
      if (!entry || typeof entry !== 'object') continue;
      if (entry.type === 'level' && Number.isFinite(entry.value)) {
        prerequisites.push({ type: 'level', value: entry.value });
      }
      if (entry.type === 'feature' && typeof entry.value === 'string' && entry.value.trim()) {
        prerequisites.push({
          type: 'feature',
          value: normalizePrerequisiteFeatureName(entry.value)
        });
      }
    }
  }

  const lines = Array.isArray(option.description) ? option.description : [];
  for (const line of lines) {
    const match = String(line).match(PREREQUISITE_LINE_PATTERN);
    if (!match) continue;
    for (const token of splitPrerequisiteTokens(match[1])) {
      const levelMatch = token.match(LEVEL_PREREQUISITE_PATTERN);
      if (levelMatch) {
        prerequisites.push({ type: 'level', value: Number(levelMatch[1]) });
        continue;
      }
      const featureName = normalizePrerequisiteFeatureName(token);
      if (featureName) {
        prerequisites.push({ type: 'feature', value: featureName });
      }
    }
  }
  return prerequisites;
}

