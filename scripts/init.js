import{DEFAULT_STATE}from'./state.js';
import{loadState,saveState}from'./storage.js';
import{proficiencyBonus}from'./rules/proficiency.js';
import{renderAbilities}from'./ui/renderAbilities.js';
import{renderAdvancement}from'./ui/renderAdvancement.js';
import{renderSummary}from'./ui/renderSummary.js';

let state=loadState(DEFAULT_STATE);

function recalc(){
state.player.pb=proficiencyBonus(state.player.level);
}

function applyAdvancement(action){
const lvl=state.player.level;
if(action.type==='ASI'){
if(state.blinkDog.abilities[action.value]>=20)return;
state.blinkDog.abilities[action.value]++;
}
else{
state.blinkDog[action.type].push(action.value);
}
state.blinkDog.advancementHistory[lvl]=action;
render();
}

function render(){
recalc();
renderAbilities(state);
renderAdvancement(state,applyAdvancement);
renderSummary(state);
saveState(state);
}

document.getElementById('playerLevel').value=state.player.level;
document.getElementById('playerLevel').oninput=e=>{
state.player.level=Number(e.target.value);
render();
};

document.getElementById('themeSelect').value=state.theme;
document.getElementById('themeSelect').onchange=e=>{
state.theme=e.target.value;
document.documentElement.dataset.theme=state.theme;
saveState(state);
};

document.documentElement.dataset.theme=state.theme;
render();