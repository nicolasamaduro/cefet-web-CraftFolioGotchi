"strict mode"

const notasEl = document.querySelector('#notas');
const converter = new showdown.Converter();

const fileListNotas = ['notas/nota1.md', 'notas/nota2.md'];

function editMd(e){
  const md = e.target.classList.contains('conteudo')? e.target:e.target.parentElement;
  const textArea = md.firstElementChild;
  const conteudo = md.lastElementChild;
  if(textArea.classList.contains('hidden')){
    textArea.value = md.dataset.text;
  } else {
    md.dataset.text = textArea.value;
    conteudo.innerHTML = converter.makeHtml(md.dataset.text);
  }
  textArea.classList.toggle('hidden');
  conteudo.classList.toggle('hidden');
}

function generateMdElement(parent, srcList, classList, addDblClickEvent){
  function fillMd(md, text){
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
      .then((text) => fillMd(md, text));
    for(let c of classList){
      md.classList.add(c);
    }
    if(addDblClickEvent){
      md.addEventListener('dblclick', editMd);
    }

    parent.appendChild(md);
  }
}

generateMdElement(notasEl, fileListNotas, ['conteudo', 'hidden'], true);
notasEl.firstElementChild.classList.remove('hidden');
