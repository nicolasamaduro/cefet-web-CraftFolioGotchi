"strict mode"

export default class Galeria{
  constructor(persistence, galeriaEl, bodyEl, mainCss, removeList, deactivateFunction){
    this.persistence = persistence;
    this.galeriaEl = galeriaEl;
    this.bodyEl = bodyEl;
    this.mainCss = mainCss;
    this.removeList = removeList;
    this.deactivateGalery = deactivateFunction;
    this.fReader = new FileReader();

    this.persistence.getImages().then((json) => {
      this.fileList=json;
      this.fillWidget();
      this.fillGallery();
    })
  }

  generateContent(src){
    const conteudo = document.createElement('div');
    const img = document.createElement('img');
    img.src = src;
    conteudo.classList.add('conteudo');
    conteudo.classList.add('hidden');
    conteudo.addEventListener('click', (e) => this.activateGalery(e));
    conteudo.appendChild(img);
    return conteudo;
  }

  fillWidget(){
    for(let s of this.fileList){
      this.galeriaEl.appendChild(this.generateContent(s));
    }
    this.galeriaEl.firstElementChild.classList.remove('hidden');
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
    this.bodyEl.prepend(this.galeriaDiv);
    const botaoVoltar = document.querySelector('#voltar-principal');
    botaoVoltar.addEventListener('click', (e) =>  this.deactivateGalery(e));
  }

  prepareSentinelNodes(){
    const sentinelTop = this.galeriaEl.firstElementChild;
    const sentinelBot = this.galeriaEl.lastElementChild;
    const circleTop = sentinelTop.firstElementChild;
    const circleBot = sentinelBot.firstElementChild;
    const inputTop = document.createElement('input');
    inputTop.type = 'file';
    inputTop.accept='image/png, image/jpeg';
    inputTop.classList.add('hidden');
    const inputBot = inputTop.cloneNode();
    sentinelTop.appendChild(inputTop);
    sentinelBot.appendChild(inputBot);
    circleTop.addEventListener('click', e => inputTop.click(e));
    circleBot.addEventListener('click', e => inputBot.click(e));
    inputTop.addEventListener('change', e => {
      const content = this.generateContent('');
      this.fReader.readAsDataURL(e.target.files[0]);
      this.fReader.addEventListener('load', e => {
        const img = content.querySelector('img');
        img.src = e.target.result;
        persistence.addImage(img.src, false);
      });
      this.galeriaEl.insertBefore(content, this.galeriaEl.firstElementChild.nextElementSibling);
      this.galeriaEl.nextElementSibling.dispatchEvent(new Event('click'));
    });
    inputBot.addEventListener('change', e => {
      const content = this.generateContent('');
      this.fReader.readAsDataURL(e.target.files[0]);
      this.fReader.addEventListener('load', e => {
        const img = content.querySelector('img');
        img.src = e.target.result;
        persistence.addImage(img.src, true);
      });
      this.galeriaEl.insertBefore(content, this.galeriaEl.lastElementChild);
      this.galeriaEl.previousElementSibling.dispatchEvent(new Event('click'));
    })
  }
}
