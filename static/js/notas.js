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
      this.notasEl.firstElementChild.classList.remove('hidden');
    })
  }

  editMd(e){
    const md = e.target.classList.contains('conteudo')? e.target:e.target.parentElement;
    const textArea = md.firstElementChild;
    const conteudo = md.lastElementChild;
    if(textArea.classList.contains('hidden')){
      textArea.value = md.dataset.text;
    } else {
      md.dataset.text = textArea.value;
      conteudo.innerHTML = this.converter.makeHtml(md.dataset.text);
      this.persistence.updateNote(md);
    }
    textArea.classList.toggle('hidden');
    conteudo.classList.toggle('hidden');
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
      this.persistence.addNote(md);
    }
    textArea.classList.toggle('hidden');
    conteudo.classList.toggle('hidden');
  }

  generateMdElementAdd(){
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
    md.addEventListener('dblclick', e => this.editMd(e));
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

  prepareSentinelNodes(){
    const sentinelTop = this.notasEl.firstElementChild;
    const sentinelBot = this.notasEl.lastElementChild;
    const circleTop = sentinelTop.firstElementChild;
    const circleBot = sentinelBot.firstElementChild;
    if (circleTop &&circleBot){
      circleTop.addEventListener('click', (e) => {
        const md = this.generateMdElementAdd();
        //md.dataset.url = this.persistence.addNote(false);
        this.addMd({target:md});
        this.notasEl.insertBefore(md, this.notasEl.firstElementChild.nextElementSibling);
        this.notasEl.nextElementSibling.dispatchEvent(new Event('click'));
        md.firstElementChild.value = '';
      });
      circleBot.addEventListener('click', (e) => {
        const md = this.generateMdElementAdd();
        //md.dataset.url = this.persistence.addNote(true);
        this.addMd({target:md});
        this.notasEl.insertBefore(md, this.notasEl.lastElementChild);
        this.notasEl.previousElementSibling.dispatchEvent(new Event('click'));
        md.firstElementChild.value = '';
      })
    }
  }
}
