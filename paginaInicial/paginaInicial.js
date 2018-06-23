const usuario = require('../usuario/usuario.js');

module.exports.set = function(app) {
    app.get('/', function(req, res) {
        res.render('paginaInicial\\paginaInicial');
    });

    app.post('/cadastrar', function (req, res) {
       if (usuario.cadastrarUsuario(req.body)){
            res.send("Sucesso ao cadastrar");
        }else{
            res.status(400).send("Falha ao cadastrar");
       }
    });

    app.post('/logar', function (req, res) {
        let retornoUsuario =usuario.logarUsuario(req.body);
        if (retornoUsuario){
            res.send(retornoUsuario);
         }else{
            res.status(400).send("Não foi possível realizar login.");
        }
     });
      
   
}

