const usuario = require('../usuario/usuario.js');

module.exports.set = function(app) {
    app.get('/', function(req, res) {
        res.render('pagina_inicial\\pagina_inicial');
    });

    app.post('/cadastrar', function (req, res) {
       if (usuario.cadastrarUsuario(req.body)){
            res.send("Sucesso ao cadastrar");
        }else{
            res.status(400).send("Falha ao cadastrar");
       }
    });
      
   
}

