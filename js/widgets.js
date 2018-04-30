"strict mode"

const headEl = document.querySelector('head');
const bodyEl = document.querySelector('body');
const widgetContainerEl = document.querySelector('.widget-container');
const widgetsEl = document.querySelectorAll('.widget-container > .widget');
const galeriaEl = document.querySelector('#galeria');
const chaoEl = document.querySelector('.chao');

const mainCss = document.querySelector('link[href="css/widgets.css"]');

const historyHandler = new HistoryHandler(mainCss, widgetContainerEl, canvas, bodyEl);
const galeria = new Galeria(galeriaEl, historyHandler);
const fundo = new Fundo(widgetContainerEl, chaoEl);

window.addEventListener('popstate', historyHandler.handleEvent);

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

function pudim(e){
  console.log(e.target.nextElementSibling);
  const input = e.target.nextElementSibling;
  input.click();
}

function prepareWidgets(){
  function makeSentinel(){
    const sentinel = document.createElement('div');
    const input = document.createElement('input')
    const plus = document.createElement('div');
    input.type = 'file';
    input.classList.add('hidden');
    plus.classList.add('circle');
    plus.addEventListener('click', pudim);
    sentinel.classList.add('conteudo');
    sentinel.classList.add('sentinela');
    sentinel.classList.add('hidden');
    sentinel.appendChild(plus);
    sentinel.appendChild(input);
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
