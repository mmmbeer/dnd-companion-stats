export function renderFeatures(view) {
  const root = document.getElementById('features');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Abilities and Actions</h2>
      <p class="panel-subtitle">Full descriptions</p>
    </div>
  `;

  const groups = document.createElement('div');
  groups.className = 'features-group';

  groups.appendChild(buildGroup('Traits', view.features.traits));
  groups.appendChild(buildGroup('Actions', view.features.actions));
  groups.appendChild(buildGroup('Feats', view.features.feats));
  groups.appendChild(buildGroup('Special Skills', view.features.specialSkills));

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
