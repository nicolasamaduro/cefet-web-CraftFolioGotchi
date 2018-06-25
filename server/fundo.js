const db = require('./db.js');

module.exports.cadastrarFundoPadrao = function (usuario){
  let fundoPadrao={
    usuario:usuario,
    tipo_atual:'cor',
    cor1:'gray',
    tipo_atual_chao:'cor',
    cor1_chao:'green'
  }
  return cadastrarFundo(fundoPadrao);
}

module.exports.alterarFundo = function (fundo){
  if (excluirFundo(fundo.codigo))
    return cadastrarFundo(fundo);
  return false;
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

function  excluirFundo(codigo){
  const sql =`Delete from fundo where codigo=${codigo}`;  
  try{
     let resultado = db.executarQuery(sql)
     if (resultado.affectedRows=='1'){          
        return true
     }
  } catch(err) {
    console.log('erro ao excluir fundo')
    console.log(err)
  }
  return false
}

function  cadastrarFundo(fundo){
    const sql =`INSERT INTO fundo(usuario,tipo_atual,cor1,cor2,urlImage, tipo_atual_chao,
            cor1_chao, cor2_chao, urlImage_chao) 
            VALUES('${fundo.usuario}', '${fundo.tipo_atual}','${fundo.cor1}', '${fundo.cor2}','${fundo.urlImage}',
            '${fundo.tipo_atual_chao}', '${fundo.cor1_chao}','${fundo.cor2_chao}', '${fundo.urlImage_chao}')`;     
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
