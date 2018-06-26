const db = require('./db.js');
module.exports.cadastrarUsuario = function (usuario){
    const sql =`INSERT INTO usuario(usuario,email,senha)
              VALUES('${usuario.usuario}', '${usuario.email}', MD5('${usuario.senha}'))`
    try{
       let resultado = db.executarQuery(sql)
       if (resultado.affectedRows=='1'){
          return true
       }
    } catch(err) {
      console.log('erro ao cadastrar usuario')
      console.log(err)
    }
    return false
}

module.exports.logarUsuario = function (usuario){
    const sql =`select * from usuario
                where usuario='${usuario.usuario}'
                and senha=MD5('${usuario.senha}');`
    try{
       const resultado = db.executarQuery(sql);
       if (resultado){
           return resultado[0];
       }
    } catch(err) {
      console.log('erro ao logar usuario')
      console.log(err)
    }
    return null;
}

module.exports.recuperarUsuario = function(codigo) {
  const sql = `select * from usuario
               where codigo='${codigo}'`
  let resultado = db.executarQuery(sql)
  if(resultado.length != 0){
    resultado = resultado[0];
  } else {
    resultado = null;
  }
  return resultado
}
