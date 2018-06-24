const db = require('./db.js');

module.exports.cadastrarFundoPadrao = function (usuario){
  const sql =`INSERT INTO fundo(usuario,tipo_atual,cor1, tipo_atual_chao, cor1_chao)
    VALUES('${usuario}', 'cor','gray', 'cor','green')`  
    try{
       let resultado = db.executarQuery(sql)
       if (resultado.affectedRows=='1'){          
          return true
       }
    } catch(err) {
      console.log('erro ao cadastrar fundo')
      console.log(err)
    }
    return false
}

module.exports.recuperarFundo = function (usuario){
    const sql =`select * from fundo
                where usuario='${usuario}';`
    try{
       const resultado = db.executarQuery(sql);
       if (resultado){
           return resultado[0];
       }
    } catch(err) {
      console.log('erro ao buscar fundo')
      console.log(err)
    }
    return null;
}

