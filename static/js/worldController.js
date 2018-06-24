"strict mode"
import Persistence from './persistence.js'
import Fundo from './fundo.js'
import Galeria from './galeria.js'
import Notas from './notas.js'
import initGame from './game.js'


const bodyEl = document.querySelector('body');
const headEl = document.querySelector('head');
const widgetContainerEl = document.querySelector('.widget-container');
const widgetsEl = document.querySelectorAll('.widget-container > .widget');
const galeriaEl = document.querySelector('#galeria');
const switchContainerEl = document.querySelector('.switch_container');
const chaoEl = document.querySelector('.chao');
const canvas = document.querySelector('canvas');
const modalEl = document.querySelector('#modal');

const mainCss = document.querySelector('link[href="/css/widgets.css"]');

const removeList = [modalEl, canvas, chaoEl, switchContainerEl, widgetContainerEl];

const persistence = new Persistence();
const galeria = new Galeria(persistence, galeriaEl, bodyEl, mainCss, removeList, habilitaPrincipal);
const notas = new Notas(persistence);
const fundo = new Fundo(widgetContainerEl, chaoEl);

initGame();

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
    const plus = document.createElement('div');
    plus.classList.add('circle');
    sentinel.classList.add('conteudo');
    sentinel.classList.add('sentinela');
    sentinel.classList.add('hidden');
    sentinel.appendChild(plus);
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

prepareWidgets();
notas.prepareSentinelNodes();
galeria.prepareSentinelNodes();

craftFolioGotchiApp.controller('WorldController',
    function($http,$mdDialog) {
        var worldCrtl=this;
        function inicializar(){            
            let regex = /[0-9]*$/gm;
            let match = regex.exec(window.location.href);
            let codigoPagina=0;
            worldCrtl.paginalEditavel=false;
            if (match){
                codigoPagina = match[0];
            }              
            let usarioLogadoStr =sessionStorage['usuarioLogado'];
            let usarioLogado;
            if (usarioLogadoStr){
                usarioLogado = JSON.parse(usarioLogadoStr);
                if (codigoPagina == usarioLogado.codigo){
                    worldCrtl.paginalEditavel = true;
                }
            }
        }        
        inicializar();  
        
    }
);
