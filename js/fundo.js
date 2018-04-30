"strict mode"

class Fundo{
  constructor(widgetContainerEl, chaoEL){
    this.widgetContainer = widgetContainerEl;
    this.chao = chaoEl;

    this.prepareEditSwitch();
    this.prepareModal();
  }

  prepareEditSwitch(){
    this.editSwitchEl = document.querySelector('.switch--shadow');
    this.editSwitchEl.checked=false;
    this.editSwitchEl.addEventListener('click', (e) => {
      if(e.target.checked){
        this.widgetContainer.style.border=('3px dashed #00bfff');
        this.chao.style.border=('2px dashed #ffffff');
      } else {
        this.widgetContainer.style.border=null;
        this.chao.style.border=null;
      }
    });
  }

  prepareModal(){
    this.modalEl = document.querySelector('#modal');

    this.widgetContainer.addEventListener('click', (e) => this.activateModal(e));
    this.chao.addEventListener('click', (e) => this.activateModal(e));
    this.modalEl.addEventListener('click', (e) => this.deactivateModal(e));

    this.prepareTabs();
  }

  prepareTabs(){
    this.modalTabsEl = this.modalEl.querySelectorAll('.modal-tabs > div');

    for(let t of this.modalTabsEl){
      t.formlink = document.querySelector(`[data-formname=${t.dataset.formlink}]`);
      t.formlink.classList.add('hidden');
      t.addEventListener('click', (e) => this.activateTab(e));
    }

    this.activeTab = this.modalTabsEl[0];
    this.activeTab.classList.add('active');
    this.activeTab.formlink.classList.remove('hidden');
    this.prepareInput();
  }

  prepareInput(){
    this.colorInputEl = this.modalEl.querySelector('[data-formname=color] input');
    this.gradientInputEl1 = this.modalEl.querySelector('[data-formname=gradient] input:first-child');
    this.gradientInputEl2 = this.modalEl.querySelector('[data-formname=gradient] input:last-child');
    this.imageInputEl = this.modalEl.querySelector('[data-formname=image] input');
    this.applyButtonEl = this.modalEl.querySelector('#modal button');

    this.colorInputEl.addEventListener('change', (e) => this.applyBgColor(e));
    this.gradientInputEl1.addEventListener('change', (e) => this.applyBgGradient(e));
    this.gradientInputEl2.addEventListener('change', (e) => this.applyBgGradient(e));
    this.imageInputEl.addEventListener('change', (e) => this.applyBgImage(e));
    this.applyButtonEl.addEventListener('click', (e) => this.buttonAction(e));
  }

  activateModal(e){
    if(e.eventPhase == Event.AT_TARGET && this.editSwitchEl.checked){
      this.modalEl.classList.add('active');
      this.editTarget = e.target;
    }
  }

  deactivateModal(e){
    if(e.eventPhase == Event.AT_TARGET){
      this.modalEl.classList.remove('active');
    }
  }

  activateTab(e){
    const tab = e.target;
    this.activeTab.classList.remove('active');
    this.activeTab.formlink.classList.add('hidden');
    this.activeTab = tab;
    this.activeTab.classList.add('active');
    this.activeTab.formlink.classList.remove('hidden');
  }

  applyBgColor(e){
    this.editTarget.style.backgroundImage=null;
    this.editTarget.style.backgroundColor=e.target.value;
  }

  applyBgGradient(e){
    let in1, in2;
    if(e.target.previousElementSibling){
      in1=e.target.previousElementSibling;
      in2=e.target;
    } else {
      in1=e.target;
      in2=e.target.nextElementSibling;
    }
    this.editTarget.style.backgroundImage=`linear-gradient(${in1.value},${in2.value})`;
  }

  applyBgImage(e){
    this.editTarget.style.backgroundImage=`url(${e.target.value})`;
    this.editTarget.style.backgroundSize='cover';
  }

  buttonAction(e){
    const formtype = this.activeTab.dataset.formlink;
    if(formtype == 'color'){
      this.applyBgColor({target:this.colorInputEl});
    } else if(formtype == 'gradient'){
      this.applyBgGradient({target:this.gradientInputEl1});
    } else {
      this.applyBgImage({target:this.imageInputEl});
    }
  }
}
