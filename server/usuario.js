const db = require('./db.js');

module.exports.cadastrarUsuario = function (usuario){
    let sql =`INSERT INTO usuario(usuario,email,senha)
              VALUES('${usuario.usuario}', '${usuario.email}', MD5('${usuario.senha}'))`
    console.log(sql);
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
    let sql =`select * from usuario
              where usuario='${usuario.usuario}'
              and senha=MD5('${usuario.senha}');`
    try{
       let resultado = db.executarQuery(sql);
       if (resultado){
           return resultado[0];
       }
    } catch(err) {
      console.log('erro ao logar usuario')
      console.log(err)
    }
    return null;
}
