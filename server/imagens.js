const db = require('./db.js');

module.exports.listaImagensUsuario = function(codigo_usuario) {
  const sql =
  `select i.url from imagens i
  where i.usuario=${codigo_usuario}`

  return db.executarQuery(sql)
}
