const db = require('../db/db.js');

module.exports.cadastrarUsuario =function (usuario){
    let sql ='INSERT INTO usuario'+
             '(usuario,'+
             'email,'+
             'senha)'+
             'VALUES'+
             '('+
             "'"+usuario.usuario+"',"+            
             "'"+usuario.email+"',"+            
             "MD5('"+usuario.senha+"'))";
    try{
       let resultado =db.executarScprit(sql);
       if (resultado.affectedRows=='1'){
           return true
       } 
    }catch(err){
    }
    return false
}