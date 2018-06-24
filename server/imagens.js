const db = require('./db.js');

module.exports.listaImagensUsuario = function(nome_usuario) {
  const sql =
  `select i.url from imagens i
  join usuario u on (i.usuario=u.codigo)
  where u.usuario='${nome_usuario}'`

  return db.executarQuery(sql)
}
