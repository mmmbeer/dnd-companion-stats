export function advancementType(level){
if(level<4)return null;
return level%2===0?'ASI':'CHOICE';
}
export function canApply(state){
const lvl=state.player.level;
return lvl>=4&&!state.blinkDog.advancementHistory[lvl];
}