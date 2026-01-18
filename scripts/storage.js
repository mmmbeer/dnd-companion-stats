const KEY="blinkDogState";
export function loadState(def){const r=localStorage.getItem(KEY);return r?JSON.parse(r):structuredClone(def);}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));}