export function renderSkills(view) {
  const root = document.getElementById('skills');
  root.innerHTML = `
    <div class="panel-header">
      <h2>Skills</h2>
      <p class="panel-subtitle">Modifiers and bonuses</p>
    </div>
  `;

  const list = document.createElement('div');
  list.className = 'skills-list';

  for (const skill of view.skills) {
    const row = document.createElement('div');
    row.className = 'skill-row';

    const name = document.createElement('div');
    name.className = 'skill-name';
    const title = document.createElement('strong');
    title.textContent = skill.label;
    const ability = document.createElement('span');
    ability.textContent = skill.ability;
    name.append(title, ability);

    const tags = document.createElement('div');
    tags.className = 'skill-tags';
    if (skill.expertise) {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = 'E';
      tags.appendChild(tag);
    } else if (skill.proficient) {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = 'P';
      tags.appendChild(tag);
    }

    const values = document.createElement('div');
    values.className = 'skill-values';
    values.textContent = `Mod ${formatSigned(skill.modifier)} | Bonus ${formatSigned(skill.bonus)}`;

    row.append(name, tags, values);
    list.appendChild(row);
  }

  root.appendChild(list);
}

function formatSigned(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}
