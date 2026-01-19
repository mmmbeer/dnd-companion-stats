export function renderSummary(view) {
  const root = document.getElementById('summary');
  if (!root) return;
  const feats = (view.feats || []).join(', ') || 'None';
  const attacks = (view.attacks || []).join(', ') || 'None';
  const traits = (view.specialSkills || []).join(', ') || 'None';

  root.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-label">Proficiency</span>
        <span class="stat-value">+${view.proficiencyBonus}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Blink Save DC</span>
        <span class="stat-value">${view.saveDc}</span>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-list">
        <h3>Feats</h3>
        <p>${feats}</p>
      </div>
      <div class="summary-list">
        <h3>Actions</h3>
        <p>${attacks}</p>
      </div>
      <div class="summary-list">
        <h3>Traits</h3>
        <p>${traits}</p>
      </div>
    </div>
  `;
}
