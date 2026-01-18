import{abilityMod}from'../rules/abilities.js';
export function renderAbilities(state){
const root=document.getElementById('abilities');
root.innerHTML='<h2>Abilities</h2>';
for(const[k,v]of Object.entries(state.blinkDog.abilities)){
const d=document.createElement('div');
d.textContent=`${k.toUpperCase()}: ${v} (${abilityMod(v)>=0?'+':''}${abilityMod(v)})`;
root.appendChild(d);
}}