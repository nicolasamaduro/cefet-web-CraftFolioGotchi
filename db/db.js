const mysql = require('sync-mysql'), wait=require('wait.for-es6');
const host = 'us-cdbr-iron-east-04.cleardb.net',
      usuario ='bd9dc389335c87',
      senha ='737ead3c',
      banco = 'heroku_6eb9ea850d4b68c';

function criarConexao(){
  return new mysql({
    host: host,
    user: usuario,
    password: senha,
    database : banco
  });
}
module.exports.executarScprit =function (sql){
  let conexaoDb = criarConexao();
  return conexaoDb.query(sql);	
}

