"strict mode"
import removeConteudo from './worldController.js'

export default class{
  constructor(audioEl, persistence){
    this.fileListPromise = persistence.getAudios();
    this.persistence = persistence;
    this.audioEl = audioEl;
    this.widgetContainer = audioEl.parentElement;
    this.playBtn = this.widgetContainer.querySelector('.play');
    this.pauseBtn = this.widgetContainer.querySelector('.pause');
    this.prevBtn = this.widgetContainer.querySelector('.prev');
    this.nextBtn = this.widgetContainer.querySelector('.next');
    this.removerBtn = this.widgetContainer.querySelector('.remover');
    this.currentPlayingEl = undefined;

    this.playBtn.addEventListener('click', e => {
      const conteudo = this.audioEl.querySelector('.conteudo:not(.sentinela):not(.hidden)');
      if(conteudo){
        const audioEl = conteudo.querySelector('audio');
        if(this.currentPlayingEl != audioEl){
          this.parar()
        }
        this.currentPlayingEl = audioEl;
        this.currentPlayingEl.play();
      } else {
        this.currentPlayingEl = undefined;
      }
    })

    this.pauseBtn.addEventListener('click', e => {
      if(this.currentPlayingEl.play()){
        this.currentPlayingEl.pause();
      }
    })

    this.removerBtn.addEventListener('click', e => {
      const conteudo = this.audioEl.querySelector('.conteudo:not(.sentinela):not(.hidden)');
      if(conteudo){
        this.parar();
        removeConteudo(conteudo);
      }
    })

    this.fReaderTargetAudio = undefined;
    this.fReader = new FileReader();
    this.fReader.addEventListener('load', e => {
      const targetAudio = this.fReaderTargetAudio
      const targetTitle = this.fReaderTargetTitle
      targetAudio.src = e.target.result;
      this.persistence.addAudio(targetAudio.src, targetTitle)
      .then(res => res.text())
      .then(url => {
        targetAudio.parentElement.dataset.url = url.replace(/^.*\/([^/]+)\/?$/,'$1');
      })
    });

    this.fileListPromise.then((json) => {
      this.fileList=json;
      this.fillWidget();
    })
  }

  parar(){
    if(this.currentPlayingEl){
      this.currentPlayingEl.pause();
      this.currentPlayingEl.fastSeek(0);
    }
    if(this.iid){
      clearInterval(this.iid);
      this.iid = undefined;
    }
  }

  rolar(){
    const p = this.audioEl.querySelector('.conteudo:not(.hidden) > p');
    if(this.iid){
      clearInterval(this.iid);
      this.iid = undefined;
    }
    if(p && p.scrollWidth > p.offsetWidth){
      p.textContent += ' '
      this.iid = setInterval(deslocaTexto, 400, p);
    }
  }

  generateContent(src, nome){
    const conteudo = document.createElement('div');
    const audio = document.createElement('audio');
    const titulo = document.createElement('p');
    audio.src = src;
    conteudo.classList.add('conteudo');
    conteudo.classList.add('hidden');
    conteudo.dataset.url = src.replace(/^.*\/([^/]+)\/?$/,'$1');
    titulo.innerHTML = nome||conteudo.dataset.url;
    conteudo.appendChild(titulo);
    conteudo.appendChild(audio);
    return conteudo;
  }

  fillWidget(){
    for(let s of this.fileList){
      this.audioEl.appendChild(this.generateContent(s.url, s.titulo));
    }
    if (this.audioEl.firstElementChild){
      this.audioEl.firstElementChild.classList.remove('hidden');
      this.rolar();
    }
  }

  onFormChange(e, insertBefore, dispatchTo){
    const file = e.target.files[0];
    const content = this.generateContent('', file.name);
    this.fReaderTargetAudio = content.querySelector('audio');
    this.fReaderTargetTitle = file.name;
    this.fReader.readAsDataURL(file);
    this.audioEl.insertBefore(content, insertBefore);
    dispatchTo.dispatchEvent(new Event('click'));
  }

  prepareSentinelNodes(){
    const sentinelTop = this.audioEl.firstElementChild;
    const sentinelBot = this.audioEl.lastElementChild;
    const circleTop = sentinelTop.firstElementChild;
    const circleBot = sentinelBot.firstElementChild;
    const inputTop = document.createElement('input');
    inputTop.type = 'file';
    inputTop.accept='audio/*';
    inputTop.classList.add('hidden');
    const inputBot = inputTop.cloneNode();
    sentinelTop.appendChild(inputTop);
    sentinelBot.appendChild(inputBot);
    circleTop.addEventListener('click', e => inputTop.click(e));
    circleBot.addEventListener('click', e => inputBot.click(e));

    inputTop.addEventListener('change', e => this.onFormChange(e, this.audioEl.firstElementChild.nextElementSibling, this.nextBtn));
    inputBot.addEventListener('change', e => this.onFormChange(e, this.audioEl.lastElementChild, this.prevBtn));
  }
}

function deslocaTexto(p){
  let str = p.textContent;
  str = str.substring(1)+str[0];
  p.textContent=str;
}
