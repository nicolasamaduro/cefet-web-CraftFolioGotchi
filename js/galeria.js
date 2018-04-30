"strict mode"

class Galeria{
  constructor(galeriaEL, bodyEl, mainCss, removeList){
    this.galeriaEL = galeriaEL;
    this.bodyEl = bodyEl;
    this.mainCss = mainCss;
    this.removeList = removeList;
    this.fileList = ['images/adamjensen.jpg','images/adamjensen2.jpg','images/jcdenton.png','images/k.jpg','images/neuromancer.jpg','images/replicant.jpg'];
    this.fillWidget();
    this.fillGallery();
  }

  fillWidget(){
    for(let s of this.fileList){
      const conteudo = document.createElement('div');
      const img = document.createElement('img');
      img.src = s;
      conteudo.classList.add('conteudo');
      conteudo.classList.add('hidden');
      conteudo.addEventListener('click', (e) => this.activateGalery(e));
      conteudo.appendChild(img);
      this.galeriaEL.appendChild(conteudo);
    }
    this.galeriaEL.firstElementChild.classList.remove('hidden');
  }

  fillGallery(){
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

    for(let s of this.fileList){
      const img = document.createElement('img');
      img.src = s;
      img.classList.add('grid-item');
      galeriaDiv.appendChild(img);
    }
    galeriaDiv.dataset.masonry='{ "itemSelector": ".grid-item", "columnWidth": 50, "gutter": 10}'
    galeriaDiv.appendChild(galeriaJs);
    galeriaDiv.appendChild(galeriaCss);
    galeriaDiv.appendChild(voltarBtn);
    this.galeriaDiv = galeriaDiv;
  }

  activateGalery(e){
    this.mainCss.disabled = true;
    for(let r of this.removeList){
      r.remove();
    }
    bodyEl.prepend(this.galeriaDiv);
    const botaoVoltar = document.querySelector('#voltar-principal');
    botaoVoltar.addEventListener('click', (e) =>  habilitaPrincipal(e));
  }
}
