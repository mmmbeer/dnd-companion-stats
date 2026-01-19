export function renderFeatures(view, { onDeleteAdvancement, onReplaceAdvancement } = {}) {
  const root = document.getElementById('features');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Abilities and Actions</h2>
      <p class="panel-subtitle">Full descriptions</p>
    </div>
  `;

  const groups = document.createElement('div');
  groups.className = 'features-group';

  groups.appendChild(buildTextGroup('Traits', view.features.traits));
  groups.appendChild(buildTextGroup('Actions', view.features.actions));
  groups.appendChild(buildGroup('Feats', view.features.feats));
  groups.appendChild(buildGroup('Special Skills', view.features.specialSkills));
  groups.appendChild(
    buildAdvancementHistorySection(view, {
      onDeleteAdvancement,
      onReplaceAdvancement
    })
  );

  root.appendChild(groups);
}

function buildGroup(title, items) {
  const wrapper = document.createElement('div');
  const heading = document.createElement('h3');
  heading.textContent = title;
  wrapper.appendChild(heading);

  if (!items || items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'advancement-empty';
    empty.textContent = 'None.';
    wrapper.appendChild(empty);
    return wrapper;
  }

  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'feature-card';
    const name = document.createElement('h3');
    name.textContent = item.name;
    card.appendChild(name);
    for (const paragraph of item.description || []) {
      const text = document.createElement('p');
      text.textContent = paragraph;
      card.appendChild(text);
    }
    wrapper.appendChild(card);
  }

  return wrapper;
}

function buildTextGroup(title, items) {
  const wrapper = document.createElement('div');
  const heading = document.createElement('h3');
  heading.textContent = title;
  wrapper.appendChild(heading);

  if (!items || items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'advancement-empty';
    empty.textContent = 'None.';
    wrapper.appendChild(empty);
    return wrapper;
  }

  for (const item of items) {
    const paragraphs = item.description || [];
    const first = document.createElement('p');
    first.className = 'feature-entry';
    const name = document.createElement('span');
    name.className = 'feature-name';
    name.textContent = `${item.name}.`;
    first.appendChild(name);
    if (paragraphs[0]) {
      first.append(` ${paragraphs[0]}`);
    }
    wrapper.appendChild(first);
    for (const paragraph of paragraphs.slice(1)) {
      const extra = document.createElement('p');
      extra.className = 'feature-entry';
      extra.textContent = paragraph;
      wrapper.appendChild(extra);
    }
  }

  return wrapper;
}

function buildAdvancementHistorySection(view, { onDeleteAdvancement, onReplaceAdvancement }) {
  const wrapper = document.createElement('div');
  const heading = document.createElement('h3');
  heading.textContent = 'Advancement History';
  wrapper.appendChild(heading);

  const history = view.advancementHistory || {};
  const levels = Object.keys(history)
    .map((level) => Number(level))
    .filter((level) => Number.isFinite(level))
    .sort((a, b) => a - b);

  if (levels.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'advancement-empty';
    empty.textContent = 'No advancements recorded yet.';
    wrapper.appendChild(empty);
    return wrapper;
  }

  const list = document.createElement('div');
  list.className = 'advancement-history';

  for (const level of levels) {
    const entry = history[level];
    if (!entry) continue;
    const row = document.createElement('div');
    row.className = 'advancement-entry';

    const details = document.createElement('div');
    details.className = 'advancement-entry-details';

    const levelLabel = document.createElement('span');
    levelLabel.className = 'advancement-entry-level';
    levelLabel.textContent = `Level ${level}`;

    const description = document.createElement('span');
    description.className = 'advancement-entry-title';
    description.textContent = formatAdvancementEntry(entry);

    details.append(levelLabel, description);

    const actions = document.createElement('div');
    actions.className = 'advancement-entry-actions';

    const replaceButton = document.createElement('button');
    replaceButton.type = 'button';
    replaceButton.className = 'button-secondary button-icon button-icon-only';
    replaceButton.title = 'Change advancement';
    replaceButton.setAttribute('aria-label', 'Change advancement');
    if (typeof onReplaceAdvancement !== 'function') {
      replaceButton.disabled = true;
    } else {
      replaceButton.addEventListener('click', () => onReplaceAdvancement(level));
    }
    const replaceIcon = document.createElement('span');
    replaceIcon.className = 'icon icon-exchange';
    replaceIcon.setAttribute('aria-hidden', 'true');
    replaceButton.appendChild(replaceIcon);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button-secondary button-icon button-icon-only';
    deleteButton.title = 'Delete advancement';
    deleteButton.setAttribute('aria-label', 'Delete advancement');
    if (typeof onDeleteAdvancement !== 'function') {
      deleteButton.disabled = true;
    } else {
      deleteButton.addEventListener('click', () => onDeleteAdvancement(level));
    }
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'icon icon-trash';
    deleteIcon.setAttribute('aria-hidden', 'true');
    deleteButton.appendChild(deleteIcon);

    actions.append(replaceButton, deleteButton);
    row.append(details, actions);
    list.appendChild(row);
  }

  wrapper.appendChild(list);
  return wrapper;
}

function formatAdvancementEntry(entry) {
  if (!entry || typeof entry !== 'object') return 'Advancement';
  if (entry.type === 'asi') {
    const label = entry.ability ? entry.ability.toUpperCase() : 'Ability';
    return `Ability Increase: ${label} +1`;
  }
  if (entry.type === 'feat') {
    return `Feat: ${entry.value}`;
  }
  if (entry.type === 'attack') {
    return `Attack: ${entry.value}`;
  }
  if (entry.type === 'specialSkill') {
    return `Special Skill: ${entry.value}`;
  }
  return 'Advancement';
}
