export function renderSavingThrows(view) {
  const root = document.getElementById('savingThrows');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Saving Throws</h2>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'saving-throws-grid';

  for (const save of view.savingThrows) {
    const row = document.createElement('div');
    row.className = 'saving-throw-cell';

    const label = document.createElement('span');
    label.textContent = `${save.label}${save.proficient ? ' (P)' : ''}`;

    const value = document.createElement('strong');
    value.textContent = formatSigned(save.total);

    row.append(label, value);
    grid.appendChild(row);
  }

  root.appendChild(grid);
}

function formatSigned(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}
