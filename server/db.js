const mysql = require('sync-mysql');
const host = 'us-cdbr-iron-east-04.cleardb.net',
      usuario ='bd9dc389335c87',
      senha ='737ead3c',
      banco = 'heroku_6eb9ea850d4b68c';


const conexaoDb = new mysql({
  host: host,
  user: usuario,
  password: senha,
  database: banco
});


module.exports.executarQuery = function (sql){
  return conexaoDb.query(sql);
}

module.exports.resetDb = function(){
  queries=[
    /*'drop table usuario',
    `create table usuario(
      codigo int(11) not null auto_increment,
      usuario varchar(45) not null,
      email varchar(200) not null,
      senha char(32) not null,
      PRIMARY KEY (codigo)
    )`,
    'describe usuario',*/
    `drop table imagens`,
    `create table imagens(
      codigo int(11) not null auto_increment,
      usuario int(11) not null,
      url varchar(200) not null,
      foreign key (usuario) references usuario(codigo) on update cascade,
      primary key (codigo)
    )`,
    'describe imagens',
  ]

  for (const q of queries){
    console.log(q);
    try {
      console.log(conexaoDb.query(q))
    } catch(e) {
      console.log(e)
    }
    console.log();
  }
}
