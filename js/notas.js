"strict mode"

class Notas {
  constructor(){
    this.notasEl = document.querySelector('#notas');
    this.converter = new showdown.Converter();
    this.fileListNotas = ['notas/nota1.md', 'notas/nota2.md'];

    this.generateMdElement(this.notasEl, this.fileListNotas, ['conteudo', 'hidden']);
    this.notasEl.firstElementChild.classList.remove('hidden');
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
    }
    textArea.classList.toggle('hidden');
    conteudo.classList.toggle('hidden');
  }

  generateMdElement(parent, srcList, classList){
    function fillMd(md, text, converter){
      md.dataset.text = text;
      md.lastElementChild.innerHTML = converter.makeHtml(text);
    }

    for(let s of srcList){
      const md = document.createElement('div');
      const textArea = document.createElement('textarea');
      const conteudo = document.createElement('div');
      conteudo.classList.add('user-markdown');
      textArea.classList.add('hidden');
      textArea.style.width = '90%';
      textArea.style.height = '90%';
      md.appendChild(textArea);
      md.appendChild(conteudo);
      fetch(s)
        .then((response) => {return response.text();})
        .then((text) => fillMd(md, text, this.converter));
      for(let c of classList){
        md.classList.add(c);
      }
      md.addEventListener('dblclick', e => this.editMd(e));

      parent.appendChild(md);
    }
  }
}
