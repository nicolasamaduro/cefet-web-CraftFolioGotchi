"strict mode"

export default class Notas {
  constructor(persistence,paginaEditavel){
    this.persistence = persistence;
    this.notasEl = document.querySelector('#notas');
    this.converter = new showdown.Converter();
    this.paginaEditavel=paginaEditavel;

    persistence.getNotes().then(notes=>{
      this.fileListNotas = notes;
      this.generateMdElements(this.notasEl, this.fileListNotas);
      if(this.notasEl.firstElementChild){
        this.notasEl.firstElementChild.classList.remove('hidden');
      }
    })
  }

  addMd(e){
    const md = e.target.classList.contains('conteudo')? e.target:e.target.parentElement;
    const textArea = md.firstElementChild;
    const conteudo = md.lastElementChild;
    if(textArea.classList.contains('hidden')){
      textArea.value = md.dataset.text;
    } else {
      md.dataset.text = textArea.value;
      conteudo.innerHTML = this.converter.makeHtml(md.dataset.text);
      let upNota = this.persistence.updateNota(md);
      Promise.all([upNota]).then(function(json){
        md.dataset.url = json[0].codigo
      })
    }
    textArea.classList.toggle('hidden');
    conteudo.classList.toggle('hidden');
  }

  generateMdElement(){
    const md = document.createElement('div');
    const textArea = document.createElement('textarea');
    const conteudo = document.createElement('div');
    conteudo.classList.add('user-markdown');
    textArea.classList.add('hidden');
    textArea.style.width = '90%';
    textArea.style.height = '90%';
    md.appendChild(textArea);
    md.appendChild(conteudo);
    md.classList.add('conteudo');
    md.classList.add('hidden');
    if (this.paginaEditavel){
    md.addEventListener('dblclick', e => this.addMd(e));
  }
    return md;
  }

  generateMdElements(parent, srcList){
    function fillMd(md, text, converter){
      md.dataset.text = text;
      md.lastElementChild.innerHTML = converter.makeHtml(text);
    }

    for(let s of srcList){
      const md = this.generateMdElement();
      md.dataset.url = s.codigo;
      fillMd(md, s.nota, this.converter);
      parent.appendChild(md);
    }
  }

  onClickPlus(insertBefore, dispatchTo){
    const md = this.generateMdElement();
    md.dataset.url = -1
    this.addMd({target:md});
    this.notasEl.insertBefore(md, insertBefore);
    dispatchTo.dispatchEvent(new Event('click'));
    md.firstElementChild.value = '';
  }

  prepareSentinelNodes(){
    const sentinelTop = this.notasEl.firstElementChild;
    const sentinelBot = this.notasEl.lastElementChild;
    const circleTop = sentinelTop.firstElementChild;
    const circleBot = sentinelBot.firstElementChild;
    circleTop.addEventListener('click', (e) => this.onClickPlus(this.notasEl.firstElementChild.nextElementSibling, this.notasEl.nextElementSibling));
    circleBot.addEventListener('click', (e) => this.onClickPlus(this.notasEl.lastElementChild, this.notasEl.previousElementSibling));
  }
}
