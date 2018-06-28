const fundo = require('./fundo');

module.exports.set = function(app) {
    app.get('/fundo/:codigo/obter', function(req, res) {
        let f = fundo.recuperarFundo(req.params.codigo);
        if(f){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(f))
        } else {
        res.status(400).send("Fundo não encontrado.");
        }
    });

    app.post('/fundo/:codigo/cadastrar', function(req, res) {
        let f = fundo.recuperarFundo(req.params.codigo);
        if (req.body.tipo_atual){
            f.cor1=req.body.cor1;
            f.cor2=req.body.cor2;
            f.urlImage=req.body.urlImage;
            f.tipo_atual=req.body.tipo_atual;
        }else{
            f.cor1_chao=req.body.cor1_chao;
            f.cor2_chao=req.body.cor2_chao;
            f.urlImage_chao=req.body.urlImage_chao;
            f.tipo_atual_chao=req.body.tipo_atual_chao;
        }
        if(fundo.alterarFundo(f)){
            res.send("Fundo alterado com sucesso");
        } else {
            res.status(400).send("Fundo não alterado.");
        }
    });
};