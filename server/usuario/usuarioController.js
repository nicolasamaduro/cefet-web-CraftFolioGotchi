const usuario = require('./usuario');
const audios = require('./audios');
const imagens = require('./imagens.js');
const notas = require('./notas.js');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const multer = require("multer");


module.exports.set = function(app) {
    app.get('/usuario/:codigo/imagelist', function(req, res) {
        let resultado = imagens.listaImagensUsuario(req.params.codigo);
        if(resultado.length != 0){
            resultado = resultado.map(x => `/usuario/${req.params.codigo}/img/${x.url}`)
        }
        res.send(JSON.stringify(resultado));
    });

    app.get('/usuario/:codigo/audiolist', function(req, res) {
        let resultado = audios.listaAudiosUsuario(req.params.codigo);
        if(resultado.length != 0){
            resultado = resultado.map(x => {
            return {
                titulo:x.titulo,
                url:`/usuario/${req.params.codigo}/audio/${x.url}`
            }
            })
        }
        res.send(JSON.stringify(resultado));
    });

    const upload = multer({
        dest: "usuario",
        limits: { fieldSize: 15 * 1024 * 1024 }
    });

    app.post('/usuario/:codigo/alterarGhost', function(req, res) {
        if ( usuario.alterarGhostUsuario(req.params.codigo,req.body.ghost)){
            res.send("Alterado com sucesso");
        } else {
            res.status(400).send("Não foi possível alterar.");
        }
    });

    app.get('/usuario/:codigo/obterGhost', function(req, res) {
        let g = usuario.recuperarGhost(req.params.codigo);
        if(g){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ghost:g}))
        } else {
        res.status(400).send("Ghost não encontrado.");
        }
    });


    app.post("/usuario/:codigo/adicionar/:tipo", upload.single("file"),function  (req, res) {
        const tipo = req.params.tipo;
        const cod_usuario = req.params.codigo;
        const payload = req.body.payload;
        const extensao = RegExp(/^data:(image|audio)\/(.{3,5});base64,/).exec(payload)[2]
        let nome;
        if(tipo == 'img'){
            nome = `${imagens.buscaProximoNomeImagemUsuario(cod_usuario)}.${extensao}`;
        } else {
            nome = `${audios.buscaProximoNomeAudioUsuario(cod_usuario)}.${extensao}`;
        }
        const localDeEscrita = path.join(__dirname, `../../userdata/${cod_usuario}/${tipo}/${nome}`);
        const base64Data = payload.substring(payload.indexOf(',')+1)
        try{
            let ans;
            if(tipo == 'img'){
                ans = imagens.cadastrarImagemUsuario({
                    url:nome,
                    usuario:cod_usuario
                })
            } else {
                ans = audios.cadastrarAudioUsuario(cod_usuario, nome, req.body.titulo)
            }
            if (ans){
                fs.writeFileSync(localDeEscrita, base64Data, 'base64');
                res.send(`/usuario/${cod_usuario}/${tipo}/${nome}`);
            } else {
                res.status(400).send("Falha ao cadastrar");
            }
        }catch(err){
            console.log(err);
            res.status(400).send("Falha ao cadastrar");
        }
    });

    app.get('/usuario/:usuario/:tipo/:arquivo', function(req, res) {
        const usuario=req.params.usuario
        const tipo=req.params.tipo
        const arquivo=req.params.arquivo
        const s = fs.createReadStream(path.join('userdata',usuario,tipo,arquivo));
        const mimetype = mime.lookup(arquivo);
        s.on('open', function () {
            res.set('Content-Type', mimetype);
            s.pipe(res);
        });
        s.on('error', function () {
            res.set('Content-Type', 'etext/plain');
            res.status(404).end('Not found');
        });
    });

    app.delete('/usuario/:cod_usuario/imagem/:url_img', function(req, res) {
        const sucesso = imagens.removerImagemUsuario(req.params.url_img, req.params.cod_usuario);
        if(sucesso){
          res.send("ok");
        } else {
          res.status(400).send("Imagem do usuário não existe");
        }
      })
  
    app.delete('/usuario/:cod_usuario/nota/:codigo_nota', function(req, res) {
        const sucesso = notas.removerNotaUsuario(req.params.codigo_nota, req.params.cod_usuario);
        if(sucesso){
          res.send("ok");
        } else {
          res.status(400).send("Nota do usuário não existe");
        }
    })

    app.post('/nota/updateNota', function(req, res) {
        let query = notas.updateNota(req.body.codigo, req.body.usuario, req.body.text);
        if(query != 'update'){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(query[0]))
        }else{
            res.send(JSON.stringify({'codigo': req.body.codigo}));
        }
    });

    app.get('/nota/:codigo/obter', function(req, res) {
        let n = notas.recuperarNota(req.params.codigo);

        if(n){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(n))
          } else {
            res.status(400).send("Nota não encontrado.");
        }
    });

    app.delete('/usuario/:cod_usuario/audio/:url_audio', function(req, res) {
        const sucesso = audios.removerAudioUsuario(req.params.url_audio, req.params.cod_usuario);
        if(sucesso){
          res.send("ok");
        } else {
          res.status(400).send("Nota do usuário não existe");
        }
    })
}