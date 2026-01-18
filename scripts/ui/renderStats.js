export function renderStats(view) {
  const root = document.getElementById('stats');
  const { armorClass, initiative, speed, saveDc } = view.stats;

  root.innerHTML = '';

  const table = document.createElement('div');
  table.className = 'stats-table';

  const statItems = [
    { label: 'Proficiency', sublabel: 'Bonus', value: `+${view.proficiencyBonus}` },
    { label: 'Speed', sublabel: '', value: `${speed} ft.` },
    { label: 'Initiative', sublabel: '', value: formatSigned(initiative) },
    { label: 'Armor', sublabel: 'Class', value: `${armorClass?.value ?? ''}` },
    { label: 'Save DC', sublabel: '', value: `${saveDc}` }
  ];

  for (const item of statItems) {
    const column = document.createElement('div');
    column.className = 'stats-column';

    const label = document.createElement('span');
    label.className = 'stats-label';
    label.textContent = item.label;

    const sublabel = document.createElement('span');
    sublabel.className = 'stats-sublabel';
    sublabel.textContent = item.sublabel;

    const value = document.createElement('strong');
    value.className = 'stats-value';
    value.textContent = item.value;

    column.append(label, sublabel, value);
    table.appendChild(column);
  }

  root.appendChild(table);
}

function formatSigned(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}
