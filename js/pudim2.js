"strict mode"

const bodyEl = document.querySelector('body');
const widgetsEl = document.querySelectorAll('.widget-container > .widget');

console.log(widgetsEl.length);

function teste(e){
  console.log(e.target);
}

for(let w of widgetsEl){
  
}
