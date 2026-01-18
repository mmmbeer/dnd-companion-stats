export function renderStats(view) {
  const root = document.getElementById('stats');
  const { armorClass, hitPoints, initiative, speed, saveDc, health } = view.stats;

  root.innerHTML = `
    <div class="panel-header">
      <h2>Combat Stats</h2>
      <p class="panel-subtitle">${view.companionName}</p>
    </div>
  `;

  const statRow = document.createElement('div');
  statRow.className = 'stat-row';

  const statItems = [
    { label: 'Proficiency', value: `+${view.proficiencyBonus}` },
    { label: 'Speed', value: `${speed} ft.` },
    { label: 'Initiative', value: formatSigned(initiative) },
    { label: 'Armor Class', value: armorClass?.note ? `${armorClass.value} (${armorClass.note})` : `${armorClass.value}` },
    { label: 'Blink Save DC', value: `${saveDc}` }
  ];

  for (const item of statItems) {
    const chip = document.createElement('div');
    chip.className = 'stat-chip';
    const label = document.createElement('span');
    label.textContent = item.label;
    const value = document.createElement('strong');
    value.textContent = item.value;
    chip.append(label, value);
    statRow.appendChild(chip);
  }

  const healthGrid = document.createElement('div');
  healthGrid.className = 'health-grid';
  const healthItems = [
    { label: 'Current', value: `${health.current}` },
    { label: 'Max', value: hitPoints?.formula ? `${health.max} (${hitPoints.formula})` : `${health.max}` },
    { label: 'Temp', value: `${health.temp}` }
  ];

  for (const item of healthItems) {
    const card = document.createElement('div');
    card.className = 'health-card';
    const label = document.createElement('span');
    label.textContent = item.label;
    const value = document.createElement('strong');
    value.textContent = item.value;
    card.append(label, value);
    healthGrid.appendChild(card);
  }

  const savingWrap = document.createElement('div');
  savingWrap.className = 'saving-throws';
  const savingTitle = document.createElement('h3');
  savingTitle.textContent = 'Saving Throws';
  savingWrap.appendChild(savingTitle);

  for (const save of view.savingThrows) {
    const row = document.createElement('div');
    row.className = 'saving-throw-row';
    const label = document.createElement('span');
    label.textContent = `${save.label} ${save.proficient ? '(P)' : ''}`.trim();
    const value = document.createElement('strong');
    value.textContent = formatSigned(save.total);
    row.append(label, value);
    savingWrap.appendChild(row);
  }

  root.append(statRow, healthGrid, savingWrap);
}

function formatSigned(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}
