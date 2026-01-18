export function renderAbilities(view) {
  const root = document.getElementById('abilities');
  root.innerHTML = '<h2>Abilities</h2>';
  for (const ability of view.abilities) {
    const row = document.createElement('div');
    const sign = ability.mod >= 0 ? '+' : '';
    row.textContent = `${ability.label}: ${ability.score} (${sign}${ability.mod})`;
    root.appendChild(row);
  }
}
