export function renderEmptyState(onAddCompanion) {
  const root = document.getElementById('emptyState');
  if (!root) return;

  root.innerHTML = `
    <div class="panel-header">
      <h2>Add a Companion</h2>
      <p class="panel-subtitle">Create your first companion to get started.</p>
    </div>
    <div class="empty-state-body">
      <p>Choose a companion type, name it, and set the player level to begin tracking advancement.</p>
    </div>
  `;

  const actions = document.createElement('div');
  actions.className = 'empty-state-actions';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Add Companion';
  button.addEventListener('click', () => {
    onAddCompanion?.();
  });
  actions.appendChild(button);
  root.appendChild(actions);
}
