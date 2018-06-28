const db = require('../db.js');
const fs = require('fs');

module.exports.buscaProximoNomeAudioUsuario = function(codigo_usuario) {
  const sql =
  `select codigo from audios
  where usuario=${codigo_usuario}
  order by codigo desc
  limit 1`
  let resultado = db.executarQuery(sql)
  if (resultado.length){
    return resultado[0].codigo+10
  } else {
    return 2;
  }
}

module.exports.cadastrarAudioUsuario = function(usuario, url, titulo) {
  const sql =`INSERT INTO audios(usuario,url,titulo)
  VALUES('${usuario}', '${url}', '${titulo}')`
  try{
    let resultado = db.executarQuery(sql)
    if (resultado.affectedRows=='1'){
      return true
    }
  } catch(err) {
    console.log(`erro ao cadastrar audio: usuario:${usuario} url:${url} titulo:${titulo}`)
    console.log(err)
  }
  return false
}

module.exports.listaAudiosUsuario = function(cod_usuario){
  const sql =
  `select a.titulo, a.url from audios a
  where a.usuario=${cod_usuario}`

  return db.executarQuery(sql)
}

module.exports.removerAudioUsuario = function(url, cod_usuario){
  const sql = `DELETE FROM audios where url='${url}' and usuario='${cod_usuario}'`
  try {
    let resultado = db.executarQuery(sql)
    if (resultado.affectedRows == '1'){
      fs.unlink(`userdata/${cod_usuario}/audio/${url}`, err => {})
      return true
    }
  } catch(err) {
    console.log('erro ao deletar audio: '+url)
    console.log(err)
  }
  return false
}
