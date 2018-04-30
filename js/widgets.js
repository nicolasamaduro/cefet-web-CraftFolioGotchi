"strict mode"

const headEl = document.querySelector('head');
const bodyEl = document.querySelector('body');
const widgetContainerEl = document.querySelector('.widget-container');

const mainCss = document.querySelector('link[href="css/widgets.css"]');

function changeWidget(e){
  const widgetEl = e.target.parentElement;
  const prevBtn = widgetEl.querySelector('.prev');
  const nextBtn = widgetEl.querySelector('.next');
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
  const widgetsEl = document.querySelectorAll('.widget-container > .widget');
  const sentinel = document.createElement('div');
  const plus = document.createElement('div');
  sentinel.classList.add('conteudo');
  sentinel.classList.add('sentinela');
  sentinel.classList.add('hidden');
  plus.classList.add('circle');
  sentinel.appendChild(plus);

  for(let w of widgetsEl){
    const prevBtn = w.querySelector('.prev');
    const nextBtn = w.querySelector('.next');
    nextBtn.addEventListener('click', changeWidget);
    prevBtn.addEventListener('click', changeWidget);

    const contentList = w.querySelector('.lista-conteudo');

    contentList.prepend(sentinel.cloneNode(true));
    contentList.appendChild(sentinel.cloneNode(true));

    if(contentList.childElementCount == 2){
      contentList.firstElementChild.classList.remove('hidden');
      prevBtn.classList.add('hidden');
      nextBtn.classList.add('hidden');
    }
  }
}

function desabilitaPrincipal(){
  mainCss.disabled = true;
  widgetContainerEl.remove();
  canvas.remove();
}

function habilitaPrincipal(){
  mainCss.disabled = false;
  bodyEl.firstElementChild.remove();
  bodyEl.prepend(widgetContainerEl);
  bodyEl.appendChild(canvas);
}

function handleHistory(e){
  if(e.state){
    let at = e.state.at;
    if(at == 'galeria'){
      console.log('load g');
      activateGalery();
    } else {
      habilitaPrincipal();
    }
  } else {
    habilitaPrincipal();
  }
}

prepareWidgets();

window.addEventListener('popstate', handleHistory);