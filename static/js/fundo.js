"strict mode"

export default class Fundo{
  constructor(widgetContainerEl, chaoEl,ghostEl){
    this.chao = chaoEl;
    this.widgetContainer = widgetContainerEl;

    this.ghostEl =ghostEl;

    this.prepareEditSwitch();
    this.prepareModal();
    this.setInitialBackground();

  }

  limpaMensagemDeRetorno() {
    let messagemRetorno=  document.querySelector('.messagem-retorno');
    messagemRetorno.classList.remove("alert-danger");
    messagemRetorno.classList.remove("alert-success");
    messagemRetorno.textContent='';
  }

  setInitialBackground(){
    this.username = window.location.href.replace(/^.*\/([^/?]+)\/?\??.*$/g, '$1')
    fetch(`/fundo/${this.username}/obter`)
    .then( response=>response.json())
    .then((fundo) => {
      if (fundo.tipo_atual=="cor"){
        this.widgetContainer.style.backgroundColor=fundo.cor1;
      } else if (fundo.tipo_atual=="gradiente"){
        this.widgetContainer.style.backgroundImage=`linear-gradient(${fundo.cor1},${fundo.cor2})`;
      } else {
        this.widgetContainer.style.backgroundImage=`url(${fundo.urlImage})`;
        this.widgetContainer.style.backgroundSize='cover';
      }
      if (fundo.tipo_atual_chao=="cor"){
        this.chao.style.backgroundColor=fundo.cor1_chao;
      } else if (fundo.tipo_atual_chao=="gradiente"){
        this.chao.style.backgroundImage=`linear-gradient(${fundo.cor1_chao},${fundo.cor2_chao})`;
      } else {
        this.chao.style.backgroundImage=`url(${fundo.urlImage_chao})`;
        this.chao.style.backgroundSize='cover';
      }
    })
  }

  prepareEditSwitch(){
    this.editSwitchEl = document.querySelector('.switch--shadow');
    this.editSwitchEl.checked=false;
    this.editSwitchEl.addEventListener('click', (e) => {
      if(e.target.checked){
        this.widgetContainer.style.border=('3px dashed #00bfff');
        this.chao.style.border=('2px dashed #ffffff');
        this.ghostEl.classList.remove("hidden");
        this.widgetContainer.classList.add("widget-container-editando");
      } else {
        this.ghostEl.classList.add("hidden");
        this.widgetContainer.classList.remove("widget-container-editando");
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
      t.addEventListener('click', (e) => {this.activateTab(e); this.limpaMensagemDeRetorno();});
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
    this.limpaMensagemDeRetorno();
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
    this.limpaMensagemDeRetorno();
    let payload = null;
    const formtype = this.activeTab.dataset.formlink;
    if(formtype == 'color'){
      this.applyBgColor({target:this.colorInputEl});
      if (this.editTarget.classList.value=='widget-container'){
        payload = {
          cor1: this.colorInputEl.value,
          tipo_atual:'cor'
        };
      }else{
        payload = {
          cor1_chao: this.colorInputEl.value,
          tipo_atual_chao:'cor'
        };
      }
    } else if(formtype == 'gradient'){
      this.applyBgGradient({target:this.gradientInputEl1});
      if (this.editTarget.classList.value=='widget-container'){
        payload = {
          cor1: this.gradientInputEl1.value,
          cor2: this.gradientInputEl2.value,
          tipo_atual:'gradiente'
        };
      }else{
        payload = {
          cor1_chao: this.gradientInputEl1.value,
          cor2_chao: this.gradientInputEl2.value,
          tipo_atual_chao:'gradiente'
        };
      }
    } else {
      this.applyBgImage({target:this.imageInputEl});
      if (this.editTarget.classList.value=='widget-container'){
        payload = {
          urlImage:this.imageInputEl.value,
          tipo_atual:'imagem'
        };
      }else{
        payload = {
          urlImage_chao: this.imageInputEl.value,
          tipo_atual_chao:'imagem'
        };
      }
    }

    fetch(`/fundo/${this.username}/cadastrar/`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( payload )
      }).then(res=>res)
      .then(res => {
        let messagemRetorno=  document.querySelector('.messagem-retorno');
        if (res.status==200){
          messagemRetorno.classList.add("alert-success");
          messagemRetorno.textContent='Sucesso ao salvar fundo';
        }else{
          messagemRetorno.classList.add("alert-danger");
          messagemRetorno.textContent='Falha ao alterar fundo';
        }
      });
    }


  }
