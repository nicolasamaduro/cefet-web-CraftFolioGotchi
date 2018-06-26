const db = require('./db.js');

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


module.exports.updateNota = function(codigo, usuario, text) {

    const sql_query = `SELECT * FROM notas 
                        WHERE usuario=${usuario} AND codigo=${codigo}`

    let resultado_query = db.executarQuery(sql_query)

    if(resultado_query.length!=0){
        const sql_update = `UPDATE notas SET nota='${text}'
        WHERE usuario=${usuario} AND codigo=${codigo}`
        try{
            let resultado = db.executarQuery(sql_update)
            if (resultado.affectedRows=='1'){
                return 'update'
            }
        } catch(err) {
            console.log('erro ao atualizar nota')
            console.log(err)
        }
    }else{
        const sql_insert =`INSERT INTO notas(usuario,nota)
        VALUES('${usuario}', '${text}')`
        try{
            let resultado = db.executarQuery(sql_insert)
            if (resultado.affectedRows=='1'){
                const sql_query = `SELECT * FROM notas
                                    WHERE usuario='${usuario}' AND nota='${text}'
                                    ORDER BY codigo DESC`;
                resultado = db.executarQuery(sql_query)
                return resultado
            }
        } catch(err) {
            console.log('erro ao cadastrar nota')
            console.log(err)
        }                   
    }
    return null;
}