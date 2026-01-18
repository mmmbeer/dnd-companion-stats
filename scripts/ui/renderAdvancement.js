import{advancementType,canApply}from'../rules/advancement.js';
import{FEATS}from'../data/feats.js';
import{ATTACKS}from'../data/attacks.js';
import{SPECIAL_SKILLS}from'../data/skills.js';

export function renderAdvancement(state,onApply){
const root=document.getElementById('advancement');
root.innerHTML='<h2>Advancement</h2>';

const type=advancementType(state.player.level);
if(!type){root.innerHTML+='<p>No companion advancement yet.</p>';return;}

if(!canApply(state)){
root.innerHTML+='<p>Advancement already applied for this level.</p>';
return;
}

if(type==='ASI'){
for(const a in state.blinkDog.abilities){
const btn=document.createElement('button');
btn.textContent=`+1 ${a.toUpperCase()}`;
btn.onclick=()=>onApply({type:'ASI',value:a});
root.appendChild(btn);
}
return;
}

const makeGroup=(label,list,key)=>{
const h=document.createElement('h3');
h.textContent=label;
root.appendChild(h);
list.filter(v=>!state.blinkDog[key].includes(v)).forEach(v=>{
const b=document.createElement('button');
b.textContent=v;
b.onclick=()=>onApply({type:key,value:v});
root.appendChild(b);
});
};

makeGroup('Feats',FEATS,'feats');
makeGroup('Attacks',ATTACKS,'attacks');
makeGroup('Skills',SPECIAL_SKILLS,'specialSkills');
}