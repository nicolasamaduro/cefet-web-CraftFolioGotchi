"strict mode"

export default class Persistence{
  constructor(){
    this.username = window.location.href.replace(/^.*\/([^/?]+)\/?\??.*$/g, '$1')
    this.imagelist = fetch(`/usuario/${this.username}/imagelist`).then(response => response.json())
  }

  executeAfterFetch(callback){
    Promise.all([this.imagelist]).then(callback)
  }

  getImages(){
    return this.imagelist;
  }

  addImage(url, addBack){
    const images = JSON.parse(localStorage['images']);
    let id;
    if(addBack){
      id = images[images.length-1].id+1;
      images.push({id,url});
    } else {
      id = images[0].id-1;
      images.unshift({id,url});
    }
    localStorage['images'] = JSON.stringify(images);
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
    if(!localStorage['notes']){
      localStorage['notes'] = JSON.stringify([{id:0, url:'/notas/nota1.md'}, {id:1, url:'/notas/nota2.md'}]); //primeira execucao
    }
    const notes = JSON.parse(localStorage['notes']);
    notes.sort((a,b) => {return a.id - b.id});
    return notes.map(x => x.url);
  }

  updateNote(note){
    const url = note.dataset.url;
    const text = note.firstElementChild.value;
    localStorage[url] = text;
  }

  addNote(addBack){
    const notes = JSON.parse(localStorage['notes']);
    let id;
    let url;
    if(addBack){
      id = notes[notes.length-1].id+1;
      url = `note-${id}`;
      notes.push({id,url});
    } else {
      id = notes[0].id-1;
      url = `note-${id}`;
      notes.unshift({id,url});
    }
    localStorage[url]='';
    localStorage['notes'] = JSON.stringify(notes);
    return url;
  }
}
