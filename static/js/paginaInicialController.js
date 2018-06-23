craftFolioGotchiApp.controller('PaginaInicialController',
    function($http,$mdDialog,$window,$location) {
        var paginaInicialCrtl=this;

        paginaInicialCrtl.modo='login';

        paginaInicialCrtl.mudarModo=function(){
            if(paginaInicialCrtl.modo==='login'){
                paginaInicialCrtl.modo='cadastro';
            }else if (paginaInicialCrtl.modo=='cadastro'){
                paginaInicialCrtl.modo='login';
            }
        }

        paginaInicialCrtl.cadastrar=function(isFormValido){
            if(isFormValido){
                if (paginaInicialCrtl.senha!= paginaInicialCrtl.confirmarSenha){
                    mostrarDialog("Falha","As senhas não estão iguais.");
                    return;
                }
                let payloadCadastro= {
                    usuario : paginaInicialCrtl.usuario,
                    senha : paginaInicialCrtl.senha,
                    email : paginaInicialCrtl.email
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

        paginaInicialCrtl.logar=function(isFormValido){
            if(isFormValido){
                const payloadLogin= {
                    usuario: paginaInicialCrtl.usuario,
                    senha: paginaInicialCrtl.senha
                }
                $http.post('/logar', payloadLogin)
                .then(function(response) {
                    $window.sessionStorage.setItem('usuarioLogado', JSON.stringify(response.data));
                    window.location.href += "world/"+response.data.usuario;
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
