const db = require('./db.js');
module.exports.cadastrarUsuario = function (usuario){
    let ghostNum = Math.floor(Math.random() * 10)+1;
    let ghostDir = '/images/ghosts/completos/'+ghostNum+'.png';
    const sql =`INSERT INTO usuario(usuario,email,senha,ghost)
              VALUES('${usuario.usuario}', '${usuario.email}', MD5('${usuario.senha}'),'${ghostDir}')`
    try{
       let resultado = db.executarQuery(sql)
       if (resultado.affectedRows=='1'){
          return true
       }
    } catch(err) {
      console.log('erro ao cadastrar usuario')
      console.log(err)
      console.log(sql)
    }
    return false
}

module.exports.alterarGhostUsuario = function (codigo,ghost){
  const sql =`Update  usuario
            set ghost='${ghost}'
            where codigo=${codigo}`
  try{
     let resultado = db.executarQuery(sql)
     if (resultado.affectedRows=='1'){
        return true
     }
  } catch(err) {
    console.log('erro ao alterar ghost usuario')
    console.log(err)
    console.log(sql)
  }
  return false
}

module.exports.recuperarGhost = function (codigo){
  const sql =`select ghost from usuario
              where codigo='${codigo}';`
  try{
     const resultado = db.executarQuery(sql);
     if (resultado){
         return resultado[0].ghost;
     }
  } catch(err) {
    console.log('erro ao buscar ghost')
    console.log(err)
  }
  return null;
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

