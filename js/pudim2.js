"strict mode"

const bodyEl = document.querySelector('body');
const widgetsEl = document.querySelectorAll('.widget-container > .widget');

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

  console.log(target);

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

let sentinelWidget = document.createElement('div');
sentinelWidget.classList.add('conteudo');
sentinelWidget.classList.add('sentinela');
sentinelWidget.classList.add('hidden');
let sentinelH2 = document.createElement('h2');
sentinelH2.textContent = "Adicionar";
let sentinelPlus = document.createElement('div');
sentinelPlus.classList.add('circle');
sentinelWidget.appendChild(sentinelH2);
sentinelWidget.appendChild(sentinelPlus);


for(let w of widgetsEl){
  const prevBtn = w.querySelector('.prev');
  const nextBtn = w.querySelector('.next');
  nextBtn.addEventListener('click', changeWidget);
  prevBtn.addEventListener('click', changeWidget);

  const contentList = w.querySelector('.lista-conteudo');

  contentList.prepend(sentinelWidget.cloneNode(true));
  contentList.appendChild(sentinelWidget.cloneNode(true));
}
