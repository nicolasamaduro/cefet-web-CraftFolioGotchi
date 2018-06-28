"strict mode"
import {pause} from './game.js'

export default class Galeria{
  constructor(persistence, galeriaEl, bodyEl, mainCss, removeList, deactivateFunction){
    this.fileListPromise = persistence.getImages()
    this.persistence = persistence;
    this.galeriaEl = galeriaEl;
    this.bodyEl = bodyEl;
    this.mainCss = mainCss;
    this.removeList = removeList;
    this.deactivateGalery = deactivateFunction;
    this.fReaderTargetImg = undefined;
    this.fReader = new FileReader();
    this.fReader.addEventListener('load', e => {
      const targetImg = this.fReaderTargetImg
      targetImg.src = e.target.result;
      this.persistence.addImage(targetImg.src)
      .then(res => res.text())
      .then(url => {
        this.addToGallery(url);
        targetImg.parentElement.dataset.url = url.replace(/^.*\/([^/]+)\/?$/,'$1');
      })
    });

    this.fileListPromise.then((json) => {
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
    conteudo.dataset.url = src.replace(/^.*\/([^/]+)\/?$/,'$1');
    conteudo.addEventListener('click', (e) => this.activateGalery(e));
    conteudo.appendChild(img);
    return conteudo;
  }

  fillWidget(){
    for(let s of this.fileList){
      this.galeriaEl.appendChild(this.generateContent(s));
    }
    if (this.galeriaEl.firstElementChild){
      this.galeriaEl.firstElementChild.classList.remove('hidden');
    }
  }

  addToGallery(s){
    const img = document.createElement('img');
    img.src = s;
    img.classList.add('grid-item');
    this.galeriaDiv.prepend(img);
  }

  fillGallery(){
    const galeriaJs = document.createElement('script');
    const galeriaCss = document.createElement('link');
    const titulo = document.createElement('h1')
    const voltarBtn = document.createElement('span');
    this.galeriaDiv = document.createElement('div');
    galeriaJs.src = '/js/masonry.pkgd.min.js';
    galeriaCss.rel='stylesheet';
    galeriaCss.href='/css/galeria.css';
    titulo.innerHTML = 'Galeria';
    voltarBtn.id='voltar-principal';

    for(let s of this.fileList){
      this.addToGallery(s)
    }
    this.galeriaDiv.dataset.masonry='{"itemSelector": ".grid-item", "columnWidth": 50, "gutter": 10}'
    this.galeriaDiv.appendChild(galeriaJs);
    this.galeriaDiv.appendChild(galeriaCss);
    this.galeriaDiv.appendChild(voltarBtn);
  }

  activateGalery(e){
    pause();
    this.mainCss.disabled = true;
    for(let r of this.removeList){
      r.remove();
    }
    this.bodyEl.prepend(this.galeriaDiv);
    const botaoVoltar = document.querySelector('#voltar-principal');
    botaoVoltar.addEventListener('click', (e) =>  this.deactivateGalery(e));
  }

  onFormChange(e, insertBefore, dispatchTo){
    const content = this.generateContent('');
    this.fReaderTargetImg = content.querySelector('img');
    this.fReader.readAsDataURL(e.target.files[0]);
    this.galeriaEl.insertBefore(content, insertBefore);
    dispatchTo.dispatchEvent(new Event('click'));
  }

  prepareSentinelNodes(){
    const sentinelTop = this.galeriaEl.firstElementChild;
    const sentinelBot = this.galeriaEl.lastElementChild;
    const circleTop = sentinelTop.firstElementChild;
    const circleBot = sentinelBot.firstElementChild;
    const inputTop = document.createElement('input');
    inputTop.type = 'file';
    inputTop.accept='image/*';
    inputTop.classList.add('hidden');
    const inputBot = inputTop.cloneNode();
    sentinelTop.appendChild(inputTop);
    sentinelBot.appendChild(inputBot);
    circleTop.addEventListener('click', e => inputTop.click(e));
    circleBot.addEventListener('click', e => inputBot.click(e));

    inputTop.addEventListener('change', e => this.onFormChange(e, this.galeriaEl.firstElementChild.nextElementSibling, this.galeriaEl.nextElementSibling));
    inputBot.addEventListener('change', e => this.onFormChange(e, this.galeriaEl.lastElementChild, this.galeriaEl.previousElementSibling));
  }
}
