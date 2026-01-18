export function renderAbilities(view) {
  const root = document.getElementById('abilities');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Ability Scores</h2>
      <p class="panel-subtitle">Modifier over score</p>
    </div>
  `;

  const labelRow = document.createElement('div');
  labelRow.className = 'ability-table ability-row-labels';

  const modRow = document.createElement('div');
  modRow.className = 'ability-table ability-row-mods';

  const scoreRow = document.createElement('div');
  scoreRow.className = 'ability-table ability-row-scores';

  for (const ability of view.abilities) {
    const labelCell = document.createElement('div');
    labelCell.className = 'ability-cell ability-label';
    labelCell.textContent = ability.label;
    labelRow.appendChild(labelCell);

    const modCell = document.createElement('div');
    modCell.className = 'ability-cell ability-mod';
    const sign = ability.mod >= 0 ? '+' : '';
    modCell.textContent = `${sign}${ability.mod}`;
    modRow.appendChild(modCell);

    const scoreCell = document.createElement('div');
    scoreCell.className = 'ability-cell ability-score';
    scoreCell.textContent = ability.score;
    scoreRow.appendChild(scoreCell);
  }

  root.append(labelRow, modRow, scoreRow);
}
