import{abilityMod}from'../rules/abilities.js';
export function renderSummary(state){
const r=document.getElementById('summary');
r.innerHTML=`
<h2>Summary</h2>
<p>Proficiency Bonus: +${state.player.pb}</p>
<p>Blink Save DC: ${8+state.player.pb+abilityMod(state.blinkDog.abilities.dex)}</p>
<p>Feats: ${state.blinkDog.feats.join(', ')||'—'}</p>
<p>Attacks: ${state.blinkDog.attacks.join(', ')}</p>
<p>Skills: ${state.blinkDog.specialSkills.join(', ')||'—'}</p>
`;
}