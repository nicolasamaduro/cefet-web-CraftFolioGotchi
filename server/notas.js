const db = require('./db.js');

module.exports.addNota = function(usuario, text) {

    const sql =`INSERT INTO notas(usuario,nota)
                VALUES('${usuario}', '${text}')`
     
    try{
        let resultado = db.executarQuery(sql)
        if (resultado.affectedRows=='1'){
            return true
        }
    } catch(err) {
        console.log('erro ao inserir nota')
        console.log(err)
    }
}

module.exports.updateNota = function(codigo, usuario, text) {

    //const sql =`INSERT INTO notas(usuario,nota)
     //           VALUES('${usuario}', '${text}')`
     const sql = `UPDATE notas SET nota='${text}'
                  WHERE usuario=${usuario} AND codigo=${codigo}`

    try{
        let resultado = db.executarQuery(sql)
        if (resultado.affectedRows=='1'){
            return true
        }
    } catch(err) {
        console.log('erro ao atualizar nota')
        console.log(err)
    }
}

module.exports.recuperarNota = function(usuario){
    const sql =`select * from notas
                where usuario='${usuario}';`
    try{
        const resultado = db.executarQuery(sql);
    if (resultado){
        return resultado;
    }
    } catch(err) {
        console.log('erro ao buscar notas')
        console.log(err)
    }
    return null;
}