craftFolioGotchiApp.controller('IndexController',
    function() {
        var indexCrtl=this;
        
        indexCrtl.modo='login';

        indexCrtl.mudarModo=function(){
            if(indexCrtl.modo==='login'){
                indexCrtl.modo='cadastro';
            }else if (indexCrtl.modo=='cadastro'){
                indexCrtl.modo='login';
            }
        }
    }
);