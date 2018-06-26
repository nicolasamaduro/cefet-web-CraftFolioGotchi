"strict mode"

export default class Persistence{
  constructor(){
    this.username = window.location.href.replace(/^.*\/([^/?]+)\/?\??.*$/g, '$1')
    this.imagelist = fetch(`/usuario/${this.username}/imagelist`).then(response => response.json())
    this.notes = fetch(`/nota/${this.username}/obter`).then(response => response.json())
  }

  executeAfterFetch(callback){
    Promise.all([this.imagelist, this.notes]).then(callback)
  }

  getImages(){
    return this.imagelist;
  }

  addImage(url, addBack){
    const formData = new FormData();
    formData.append('image', url);
    fetch(`/usuario/${this.username}/adicionarImagem/`,
    {
        method: "POST",
        body: formData
    })
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



  updateNote(note){
    const url = note.dataset.url;
    const text = note.firstElementChild.value;

    let payload = {
      codigo: url,
      usuario: this.username,
      text: text
    };

    fetch("/nota/updateNota", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  }

  addNote(note){
    const text = note.firstElementChild.value;

    let payload = {
      usuario: this.username,
      text: text
    };

    fetch("/nota/addNota", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then((codigo) => function(codigo){
      return codigo
    })
  }

  testeNota(note){
    const url = note.dataset.url;
    const text = note.firstElementChild.value;

    let payload = {
      codigo: url,
      usuario: this.username,
      text: text
    };

    let upNota = fetch("/nota/testeNota", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res=>res.json())
    /*
    .then(res => {
      if(res!='update'){
        return res.codigo
      }else{
        console.log('update')
        return res.codigo
      }
    });*/
    return upNota
  }

}
