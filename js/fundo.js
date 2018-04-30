const modalEl = document.querySelector('#modal');
const editSwitchEl = document.querySelector('.switch--shadow');

const modalTabsEl = document.querySelectorAll('.modal-tabs > div');
const colorInputEl = document.querySelector('[data-formname=color] input');
const gradientInputEl1 = document.querySelector('[data-formname=gradient] input:first-child');
const gradientInputEl2 = document.querySelector('[data-formname=gradient] input:last-child');
const imageInputEl = document.querySelector('[data-formname=image] input');
const applyButtonEl = document.querySelector('#modal button');

const chaoEl = document.querySelector('.chao');

let activeTab;
let editTarget;

editSwitchEl.checked=false;
editSwitchEl.addEventListener('click', (e) => {
  if(e.target.checked){
    widgetContainerEl.style.border=('3px dashed #00bfff');
    chaoEl.style.border=('2px dashed #ffffff');
  } else {
    widgetContainerEl.style.border=null;
    chaoEl.style.border=null;
  }
});

function activeModal(e){
  if(e.eventPhase == Event.AT_TARGET && editSwitchEl.checked){
    modalEl.classList.add('active');
    editTarget = e.target;
  }
}

widgetContainerEl.addEventListener('click', activeModal);
chaoEl.addEventListener('click', activeModal);

modalEl.addEventListener('click', function(e){
  if(e.eventPhase == Event.AT_TARGET){
    modalEl.classList.remove('active');
  }
})

function applyBgColor(e){
  editTarget.style.backgroundImage=null;
  editTarget.style.backgroundColor=e.target.value;
}

function applyBgGradient(e){
  let in1, in2;
  if(e.target.previousElementSibling){
    in1=e.target.previousElementSibling;
    in2=e.target;
  } else {
    in1=e.target;
    in2=e.target.nextElementSibling;
  }
  editTarget.style.backgroundImage=`linear-gradient(${in1.value},${in2.value})`;
}

function applyBgImage(e){
  editTarget.style.backgroundImage=`url(${e.target.value})`;
  editTarget.style.backgroundSize='cover';
}

function activateTab(e){
  const tab = e.target;
  if(activeTab){
    activeTab.classList.remove('active');
    activeTab.formlink.classList.add('hidden');
  }
  activeTab = tab;
  activeTab.classList.add('active');
  activeTab.formlink.classList.remove('hidden');
}

function prepareTabs(){
  for(t of modalTabsEl){
    t.formlink = document.querySelector(`[data-formname=${t.dataset.formlink}]`);
    t.formlink.classList.add('hidden');
    t.addEventListener('click', activateTab);
  }
}

prepareTabs();

activateTab.activeTab = modalTabsEl[1];
activateTab({target:modalTabsEl[0]});

colorInputEl.addEventListener('change', applyBgColor);
gradientInputEl1.addEventListener('change', applyBgGradient);
gradientInputEl2.addEventListener('change', applyBgGradient);
imageInputEl.addEventListener('change', applyBgImage);
applyButtonEl.addEventListener('click', function(e){
  const formtype = activeTab.dataset.formlink;
  if(formtype == 'color'){
    applyBgColor({target:colorInputEl});
  } else if(formtype == 'gradient'){
    applyBgGradient({target:gradientInputEl1});
  } else {
    applyBgImage({target:imageInputEl});
  }
});
