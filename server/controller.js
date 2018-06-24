const usuario = require('./usuario.js');
const imagens = require('./imagens.js');
const fs = require('fs')
const path = require('path')
const mime = require('mime')

module.exports.set = function(app) {
    app.get('/', function(req, res) {
        res.render('paginaInicial');
    });

    app.post('/cadastrar', function (req, res) {
       if (usuario.cadastrarUsuario(req.body)){
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

    app.get('/world/:nome', function(req, res) {
      const u = usuario.recuperarUsuario(req.params.nome);
      if(u){
        res.render('world', u)
      } else {
        res.status(400).send("Mundo não encontrado.");
      }
    });

    app.get('/usuario/:nome/imagelist', function(req, res) {
      let resultado = imagens.listaImagensUsuario(req.params.nome);
      if(resultado.length != 0){
        resultado = resultado.map(x => `/usuario/${req.params.nome}/img/${x.url}`)
      }
      res.send(JSON.stringify(resultado));
    });

    app.get('/usuario/:usuario/img/:arquivo', function(req, res) {
      const usuario=req.params.usuario
      const arquivo=req.params.arquivo
      const s = fs.createReadStream(path.join('userdata',usuario,'img',arquivo));
      const mimetype = mime.lookup(arquivo);
      s.on('open', function () {
          res.set('Content-Type', mimetype);
          s.pipe(res);
      });
      s.on('error', function () {
          res.set('Content-Type', 'text/plain');
          res.status(404).end('Not found');
      });
    });
}
