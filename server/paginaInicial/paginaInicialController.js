const fundo = require('../fundo/fundo');
const usuario = require('../usuario/usuario');
const fs = require('fs');

module.exports.set = function(app) {

    app.get('/', function(req, res) {
        res.render('paginaInicial');
    });

    app.post('/cadastrar', function (req, res) {
        if (usuario.cadastrarUsuario(req.body)){
            u = usuario.logarUsuario(req.body);
            fundo.cadastrarFundoPadrao(u.codigo);
            fs.mkdirSync(`./userdata/${u.codigo}`);
            fs.mkdirSync(`./userdata/${u.codigo}/img`);
            fs.mkdirSync(`./userdata/${u.codigo}/audio`);
            res.send("Sucesso ao cadastrar");
        } else {
            res.status(400).send("Falha ao cadastrar");
        }
    });

    app.post('/logar', function (req, res) {
        const retornoUsuario = usuario.logarUsuario(req.body);
        if (retornoUsuario){
            res.send(retornoUsuario);
        } else {
            res.status(400).send("Não foi possível realizar login.");
        }
    });
};