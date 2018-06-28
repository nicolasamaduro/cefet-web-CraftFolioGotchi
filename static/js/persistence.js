"strict mode"

export default class Persistence{
  constructor(){
    this.username = window.location.href.replace(/^.*\/([^/?]+)\/?\??.*$/g, '$1')
    this.imagelist = fetch(`/usuario/${this.username}/imagelist`).then(response => response.json())
    this.notes = fetch(`/nota/${this.username}/obter`).then(response => response.json())
    this.audioList = fetch(`/usuario/${this.username}/audiolist`).then(response => response.json())
  }

  executeAfterFetch(callback){
    Promise.all([this.imagelist, this.notes, this.audioList]).then(callback)
  }

  getImages(){
    return this.imagelist;
  }

  getAudios(){
    return this.audioList;
  }

  addImage(url){
    const formData = new FormData();
    formData.append('payload', url);
    return fetch(`/usuario/${this.username}/adicionar/img`,
    {
        method: "POST",
        body: formData
    })
  }

  addAudio(url, titulo){
    const formData = new FormData();
    formData.append('payload', url);
    formData.append('titulo', titulo);
    return fetch(`/usuario/${this.username}/adicionar/audio`,
    {
        method: "POST",
        body: formData
    })
  }

  removeAudio(url){
    fetch(`/usuario/${this.username}/audio/${url}`,{method: "DELETE"});
  }

  removeImage(url){
    fetch(`/usuario/${this.username}/imagem/${url}`,{method: "DELETE"});
  }

  fetchText(url, textFunc){
    if(localStorage[url] != undefined){
      textFunc(localStorage[url]);
    } else {
      fetch(url)
      .then((response) => {return response.text();})
      .then((text) => textFunc(text));
    }
  }

  getNotes(){
    return this.notes
  }

  updateNota(note){
    const url = note.dataset.url;
    const text = note.firstElementChild.value;

    let payload = {
      codigo: url,
      usuario: this.username,
      text: text
    };

    let upNota = fetch("/nota/updateNota", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res=>res.json())
    return upNota
  }

  removeNota(codigo){
    fetch(`/usuario/${this.username}/nota/${codigo}`,{method: "DELETE"});
  }
}
