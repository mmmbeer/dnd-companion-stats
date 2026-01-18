export function renderCompanions({ companions, activeCompanionId, getTypeName, onSelect }) {
  const root = document.getElementById('companions');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Companions</h2>
      <p class="panel-subtitle">Active roster</p>
    </div>
  `;

  if (!companions || companions.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'advancement-empty';
    empty.textContent = 'No companions available.';
    root.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'companions-list';

  for (const companion of companions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'companion-button';
    const isActive = companion.id === activeCompanionId;
    if (isActive) {
      button.classList.add('is-active');
      button.setAttribute('aria-current', 'true');
    }

    const label = document.createElement('div');
    label.className = 'companion-label';

    const name = document.createElement('strong');
    name.className = 'companion-name';
    name.textContent = companion.name;

    const type = document.createElement('span');
    type.className = 'companion-type';
    type.textContent = getTypeName(companion.type);

    label.append(name, type);
    button.appendChild(label);

    if (isActive) {
      const activeTag = document.createElement('span');
      activeTag.className = 'companion-active';
      activeTag.textContent = 'Active';
      button.appendChild(activeTag);
    }

    button.addEventListener('click', () => onSelect(companion.id));
    list.appendChild(button);
  }

  root.appendChild(list);
}
