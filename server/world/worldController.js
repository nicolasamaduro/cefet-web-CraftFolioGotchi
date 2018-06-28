const usuario = require('../usuario/usuario');

module.exports.set = function(app) {
    app.get('/world/:codigo', function(req, res) {
        const u = usuario.recuperarUsuario(req.params.codigo);
        if(u){
            res.render('world', u)
        } else {
            res.status(400).send("Mundo não encontrado.");
        }
    });
}