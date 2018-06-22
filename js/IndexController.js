craftFolioGotchiApp.controller('IndexController',
    function($http,$mdDialog) {
        var indexCrtl=this;   

        indexCrtl.modo='login';

        indexCrtl.mudarModo=function(){
            if(indexCrtl.modo==='login'){
                indexCrtl.modo='cadastro';
            }else if (indexCrtl.modo=='cadastro'){
                indexCrtl.modo='login';
            }
        }

        indexCrtl.cadastrar=function(isFormValido){
            if(isFormValido){
                let payloadCadastro= {
                    usuario : indexCrtl.usuario,
                    senha : indexCrtl.senha,
                    email : indexCrtl.email,
                    confirmarSenha : indexCrtl.confirmarSenha,
                }
                $http.post( '/cadastrar', payloadCadastro)
                .then(function(response) {
                    mostrarDialog("Sucesso",response.data);
                }, 
                function(response) {
                    mostrarDialog("Falha",response.data);
                });
            }
        }

        function mostrarDialog(titulo,conteudo){
            $mdDialog.show($mdDialog.alert({
                title: titulo,
                textContent: conteudo,
                ok: 'Fechar'
              }));   
        }


    }
);