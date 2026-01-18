export function renderAbilities(view) {
  const root = document.getElementById('abilities');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Abilities</h2>
      <p class="panel-subtitle">Base scores + advancements</p>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'ability-grid';

  for (const ability of view.abilities) {
    const card = document.createElement('div');
    card.className = 'ability-card';

    const label = document.createElement('div');
    label.className = 'ability-label';
    label.textContent = ability.label;

    const score = document.createElement('div');
    score.className = 'ability-score';
    score.textContent = ability.score;

    const mod = document.createElement('div');
    mod.className = 'ability-mod';
    const sign = ability.mod >= 0 ? '+' : '';
    mod.textContent = `${sign}${ability.mod}`;

    card.append(label, score, mod);
    grid.appendChild(card);
  }

  root.appendChild(grid);
}
