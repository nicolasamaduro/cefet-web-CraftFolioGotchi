"strict mode"

const galeriaEl = document.querySelector('#galeria');
//vai vir do backend
const filelist = ['images/adamjensen.jpg','images/adamjensen2.jpg','images/jcdenton.png','images/k.jpg','images/neuromancer.jpg','images/replicant.jpg'];
for(let f of filelist){
  const img = document.createElement('img');
  img.src = f;
  img.classList.add('conteudo');
  img.classList.add('hidden');
  img.addEventListener('click', activateGalery);
  galeriaEl.appendChild(img);
}
galeriaEl.firstElementChild.classList.remove('hidden');

function activateGalery(e){
  if(!this.galeriaJs){
    const galeriaJs = document.createElement('script');
    const galeriaCss = document.createElement('link');
    galeriaJs.src = 'js/masonry.pkgd.min.js';
    galeriaCss.rel='stylesheet';
    galeriaCss.href='css/galeria.css';
    this.galeriaJs = galeriaJs;
    this.galeriaCss = galeriaCss;
  }
  fetch('galeria.html')
    .then(response => response.text())
    .then(text => {
      desabilitaPrincipal();

      const galery = document.createElement('div');
      galery.innerHTML=text;
      galery.appendChild(this.galeriaJs);
      galery.appendChild(this.galeriaCss);
      bodyEl.prepend(galery);
      const botaoVoltar = document.querySelector('#voltar-principal');
      botaoVoltar.addEventListener('click', habilitaPrincipal);
      this.cached = true;
    })
}
