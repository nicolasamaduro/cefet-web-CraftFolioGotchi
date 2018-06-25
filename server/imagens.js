const db = require('./db.js');

module.exports.listaImagensUsuario = function(codigo_usuario) {
  const sql =
  `select i.url from imagens i
  where i.usuario=${codigo_usuario}`

  return db.executarQuery(sql)
}

module.exports.buscaProximoNomeImagemUsuario = function(codigo_usuario) {
  const sql =
  `select codigo from imagens
  where usuario=${codigo_usuario}
  order by codigo desc`
 let resultado= db.executarQuery(sql)
  if (resultado.length){
    return db.executarQuery(sql)[0].codigo+10
  }else{
    return 2
  }
}


module.exports.cadastrarImagemUsuario = function(imagem) {
  const sql =`INSERT INTO imagens(usuario,url)
              VALUES('${imagem.usuario}', '${imagem.url}')`
    try{
       let resultado = db.executarQuery(sql)
       if (resultado.affectedRows=='1'){
           return true
       }
    } catch(err) {
      console.log('erro ao cadastrar imagem: '+ JSON.stringify(imagem))
      console.log(err)
    }
    return false
}

