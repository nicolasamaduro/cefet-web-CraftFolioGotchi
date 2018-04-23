"strict mode"

const galeriaEl = document.querySelector('#galeria');
//vai vir do backend
const fileList = ['images/adamjensen.jpg','images/adamjensen2.jpg','images/jcdenton.png','images/k.jpg','images/neuromancer.jpg','images/replicant.jpg'];

function generateImgElement(parent, srcList, classList, addClickEvent){
  for(let s of srcList){
    const img = document.createElement('img');
    img.src = s;
    for(let c of classList){
      img.classList.add(c);
    }
    if(addClickEvent){
      img.addEventListener('click', activateGalery);
    }
    parent.appendChild(img);
  }
}

generateImgElement(galeriaEl, fileList, ['conteudo', 'hidden'], true);
galeriaEl.firstElementChild.classList.remove('hidden');

function activateGalery(e){
  if(!this.galeriaDiv){
    const galeriaJs = document.createElement('script');
    const galeriaCss = document.createElement('link');
    const titulo = document.createElement('h1')
    const voltarBtn = document.createElement('span');
    const galeriaDiv = document.createElement('div');
    galeriaJs.src = 'js/masonry.pkgd.min.js';
    galeriaCss.rel='stylesheet';
    galeriaCss.href='css/galeria.css';
    titulo.innerHTML = 'Galeria';
    voltarBtn.id='voltar-principal';

    generateImgElement(galeriaDiv, fileList, ['grid-item'], true);
    galeriaDiv.dataset.masonry='{ "itemSelector": ".grid-item", "columnWidth": 50, "gutter": 10}'
    galeriaDiv.appendChild(galeriaJs);
    galeriaDiv.appendChild(galeriaCss);
    galeriaDiv.appendChild(voltarBtn);
    this.galeriaDiv = galeriaDiv;
  }

  desabilitaPrincipal();
  bodyEl.prepend(this.galeriaDiv);
  const botaoVoltar = document.querySelector('#voltar-principal');
  botaoVoltar.addEventListener('click', habilitaPrincipal);
}
