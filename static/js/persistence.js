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

      
    var formData = new FormData();
    formData.append('image', url);
    fetch(`/usuario/${this.username}/adicionarImagem/`,
    {
        method: "POST",
        body:formData
    })
    /*const images = JSON.parse(localStorage['images']);
    let id;
    if(addBack){
      id = images[images.length-1].id+1;
      images.push({id,url});
    } else {
      id = images[0].id-1;
      images.unshift({id,url});
    }
    localStorage['images'] = JSON.stringify(images);*/
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

}

