"strict mode"

const headEl = document.querySelector('head');
const bodyEl = document.querySelector('body');
const widgetContainerEl = document.querySelector('.widget-container');
const widgetsEl = document.querySelectorAll('.widget-container > .widget');

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

function getSentinelWidget(){
  if(!this.widget){
    const widget = document.createElement('div');
    //const h2 = document.createElement('h2');
    const plus = document.createElement('div');
    widget.classList.add('conteudo');
    widget.classList.add('sentinela');
    widget.classList.add('hidden');
    //h2.textContent = "Adicionar";
    plus.classList.add('circle');
    //widget.appendChild(h2);
    widget.appendChild(plus);
    this.widget = widget;
  }
  return this.widget.cloneNode(true);
};


for(let w of widgetsEl){
  const prevBtn = w.querySelector('.prev');
  const nextBtn = w.querySelector('.next');
  nextBtn.addEventListener('click', changeWidget);
  prevBtn.addEventListener('click', changeWidget);

  const contentList = w.querySelector('.lista-conteudo');

  contentList.prepend(getSentinelWidget());
  contentList.appendChild(getSentinelWidget());

  if(contentList.childElementCount == 2){
    contentList.firstElementChild.classList.remove('hidden');
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
  }
}

function desabilitaPrincipal(){
    mainCss.disabled = true;
    widgetContainerEl.remove();
}

function habilitaPrincipal(){
  mainCss.disabled = false;
  bodyEl.firstElementChild.remove();
  bodyEl.prepend(widgetContainerEl);
}
