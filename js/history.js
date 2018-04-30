class HistoryHandler{
  constructor(mainCss, widgetContainerEl, canvasEl, bodyEl){
    this.mainCss = mainCss;
    this.widgetContainer = widgetContainerEl;
    this.body = bodyEl;
    this.canvas = canvasEl;
  }

  desabilitaPrincipal(){
    this.mainCss.disabled = true;
    this.widgetContainer.remove();
    this.canvas.remove();
  }

  habilitaPrincipal(){
    this.mainCss.disabled = false;
    this.body.firstElementChild.remove();
    this.body.prepend(widgetContainerEl);
    this.body.appendChild(canvas);
  }

  handleEvent(e){
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
}
