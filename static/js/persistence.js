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

    /*
    if(!localStorage['notes']){
      localStorage['notes'] = JSON.stringify([{id:0, url:'/notas/nota1.md'}, {id:1, url:'/notas/nota2.md'}]); //primeira execucao
    }
    const notes = JSON.parse(localStorage['notes']);
    notes.sort((a,b) => {return a.id - b.id});
    //return notes.map(x => x.url);*/
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
  }
}
