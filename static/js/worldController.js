"strict mode"
import Persistence from './persistence.js'
import Fundo from './fundo.js'
import Galeria from './galeria.js'
import Notas from './notas.js'
import {unpause, initGame} from './game.js'


const bodyEl = document.querySelector('body');
const headEl = document.querySelector('head');
const widgetContainerEl = document.querySelector('.widget-container');
const widgetsEl = document.querySelectorAll('.widget-container > .widget');
const galeriaEl = document.querySelector('#galeria');
const switchContainerEl = document.querySelector('.switch_container');
const chaoEl = document.querySelector('.chao');
const canvas = document.querySelector('canvas');
const modalEl = document.querySelector('#modal');
const ghostEl = document.querySelector('.ghosts');
const username = window.location.href.replace(/^.*\/([^/?]+)\/?\??.*$/g, '$1')

const mainCss = document.querySelector('link[href="/css/widgets.css"]');

const removeList = [ghostEl, modalEl, canvas, chaoEl, switchContainerEl, widgetContainerEl];
const paginaEditavel= isPaginaEditavel();

function escondeSeletor(){
    if (!paginaEditavel){
        switchContainerEl.classList.add('hidden');
    }
}
escondeSeletor();
prepareGhosts();

const persistence = new Persistence();
const galeria = new Galeria(persistence, galeriaEl, bodyEl, mainCss, removeList, habilitaPrincipal);
const notas = new Notas(persistence,paginaEditavel);
const fundo = new Fundo(widgetContainerEl, chaoEl,ghostEl);


persistence.executeAfterFetch(() => {
  prepareWidgets();
  notas.prepareSentinelNodes();
  galeria.prepareSentinelNodes();
});

function habilitaPrincipal(){
  mainCss.disabled = false;
  bodyEl.firstElementChild.remove();
  for (const r of removeList){
    bodyEl.prepend(r);
  }
  unpause();
}

function prepareGhosts(){
  fetch(`/usuario/${username}/obterGhost/`)
  .then( response=>response.json())
  .then(function(ghost) {
    initGame(ghost.ghost,widgetContainerEl, true);
  });

  ghostEl.childNodes.forEach(function(ghost){
    ghost.addEventListener('click',function(e){
      let novaSrc = e.target.getAttribute("src").replace('unicos','completos');
      initGame(novaSrc,false);
      fetch(`/usuario/${username}/alterarGhost/`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify({ghost:novaSrc})
      })
    })
  });
}

function changeWidget(e){
  const widgetEl = e.target.parentElement;
  const prevBtn = widgetEl.firstElementChild;
  const nextBtn = widgetEl.lastElementChild;
  const isPrev = e.target == prevBtn;
  const contentList = widgetEl.querySelector('.lista-conteudo');
  const currentActive = contentList.querySelector('.conteudo:not(.hidden)');
  let target;
  if(isPrev){
    target = contentList.querySelector('.conteudo.hidden + .conteudo:not(.hidden)')
    if(target){
      target = target.previousElementSibling;
    }
  } else {
    target = contentList.querySelector('.conteudo:not(.hidden) + .conteudo.hidden');
  }

  nextBtn.classList.remove('hidden');
  prevBtn.classList.remove('hidden');
  if(target.classList.contains('sentinela')){
    if(isPrev){
      prevBtn.classList.add('hidden');
    } else {
      nextBtn.classList.add('hidden');
    }
  }

  currentActive.classList.add('hidden');
  target.classList.remove('hidden');
}

function prepareWidgets(){
  function makeSentinel(){
    const sentinel = document.createElement('div');
    let plus;
    if (paginaEditavel){
        plus = document.createElement('div')
        plus.classList.add('circle');
    }
    sentinel.classList.add('conteudo');
    sentinel.classList.add('sentinela');
    sentinel.classList.add('hidden');
    if (paginaEditavel){
        sentinel.appendChild(plus);
    }
    return sentinel;
  }

  for(let w of widgetsEl){
    const prevBtn = w.firstElementChild;
    const contentList = prevBtn.nextElementSibling;
    const nextBtn = w.lastElementChild;

    nextBtn.addEventListener('click', changeWidget);
    prevBtn.addEventListener('click', changeWidget);
    contentList.prepend(makeSentinel());
    contentList.appendChild(makeSentinel());

    if(contentList.childElementCount == 2){
      contentList.firstElementChild.classList.remove('hidden');
      prevBtn.classList.add('hidden');
      nextBtn.classList.add('hidden');
    }
  }
}

function isPaginaEditavel(){
    let usarioLogadoStr = sessionStorage['usuarioLogado'];
    let paginalEditavel=false;
    if (usarioLogadoStr){
        const usarioLogado = JSON.parse(usarioLogadoStr);
        paginalEditavel = username == usarioLogado.codigo;
    }
    return paginalEditavel;
}

export default function removeConteudo(contentEl){
  if(contentEl.parentElement.id == 'galeria'){
    persistence.removeImage(contentEl.dataset.codigo);
  } else if(contentEl.parentElement.id == 'notas'){
    persistence.removeNota(contentEl.dataset.url);
  }
  let nextEl = contentEl.nextElementSibling;
  if(nextEl.classList.contains('sentinela')){
    nextEl = contentEl.previousElementSibling;
  }
  nextEl.classList.remove("hidden")
  contentEl.remove();
  changeWidget({target:nextEl.parentElement});
}
