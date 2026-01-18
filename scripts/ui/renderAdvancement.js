import { openAdvancementModal } from './modals/advancementModal.js';

export function renderAdvancement(view, onApply) {
  const root = document.getElementById('advancement');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Advancement</h2>
      <p class="panel-subtitle">Level-gated companion growth</p>
    </div>
  `;

  const advancement = view.advancement;
  if (!advancement.type) {
    root.innerHTML += '<p class="advancement-empty">No companion advancement yet.</p>';
    return;
  }

  if (!advancement.canAdvance) {
    root.innerHTML += `<p class="advancement-empty">${advancement.blockedReason || 'Advancement unavailable.'}</p>`;
    return;
  }

  const btn = document.createElement('button');
  btn.textContent = 'Advance Companion';
  btn.onclick = () => {
    openAdvancementModal({
      companionName: view.companionName,
      advancement,
      onConfirm: onApply
    });
  };
  root.appendChild(btn);
}
