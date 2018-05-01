"strict mode"

class Persistence{
  constructor(){
  }

  updateNote(note){
    const url = note.dataset.url;
    const text = note.firstElementChild.value;
    localStorage[url] = text;
  }
}
