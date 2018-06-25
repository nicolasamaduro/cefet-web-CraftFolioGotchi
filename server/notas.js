const db = require('./db.js');

module.exports.addNota = function(codigo, text) {

    const sql =`INSERT INTO notas(usuario,nota)
                VALUES('${codigo}', '${text}')`
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