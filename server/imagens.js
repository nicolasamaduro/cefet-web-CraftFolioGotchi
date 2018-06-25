const db = require('./db.js');

module.exports.listaImagensUsuario = function(codigo_usuario) {
  const sql =
  `select i.url from imagens i
  where i.usuario=${codigo_usuario}`

  return db.executarQuery(sql)
}

module.exports.cadastrarImagemUsuario = function(imagem) {
  const sql =`INSERT INTO usuario(usuario,url)
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

