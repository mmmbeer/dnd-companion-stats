export function renderHealth(view, onChange) {
  const root = document.getElementById('health');
  const { hitPoints, health } = view.stats;
  const maxHp = hitPoints?.max ?? 0;

  root.innerHTML = `
    <div class="panel-header">
      <h2>Health Points (HP)</h2>
    </div>
  `;

  const row = document.createElement('div');
  row.className = 'health-row';

  const currentInput = document.createElement('input');
  currentInput.type = 'number';
  currentInput.min = '0';
  currentInput.className = 'health-input';
  currentInput.value = Number.isFinite(health.current) ? health.current : maxHp;

  const divider = document.createElement('span');
  divider.className = 'health-divider';
  divider.textContent = '/';

  const maxValue = document.createElement('span');
  maxValue.className = 'health-max';
  maxValue.textContent = String(maxHp);

  const tempLabel = document.createElement('span');
  tempLabel.className = 'health-temp-label';
  tempLabel.textContent = 'Temp:';

  const tempInput = document.createElement('input');
  tempInput.type = 'number';
  tempInput.min = '0';
  tempInput.className = 'health-input';
  tempInput.value = Number.isFinite(health.temp) ? health.temp : 0;

  currentInput.addEventListener('input', () => {
    const value = Number(currentInput.value);
    onChange({ current: Number.isFinite(value) ? value : maxHp, temp: health.temp });
  });

  tempInput.addEventListener('input', () => {
    const value = Number(tempInput.value);
    onChange({ current: health.current, temp: Number.isFinite(value) ? value : 0 });
  });

  row.append(currentInput, divider, maxValue, tempLabel, tempInput);
  root.appendChild(row);
}
