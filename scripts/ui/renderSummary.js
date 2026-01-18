export function renderSummary(view) {
  const root = document.getElementById('summary');
  const feats = view.feats.join(', ') || 'None';
  const attacks = view.attacks.join(', ') || 'None';
  const skills = view.specialSkills.join(', ') || 'None';

  root.innerHTML = `
<h2>Summary</h2>
<p>Companion: ${view.companionName}</p>
<p>Proficiency Bonus: +${view.proficiencyBonus}</p>
<p>Blink Save DC: ${view.saveDc}</p>
<p>Feats: ${feats}</p>
<p>Attacks: ${attacks}</p>
<p>Skills: ${skills}</p>
`;
}
