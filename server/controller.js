const paginaInicialCtlr = require('./paginaInicial/paginaInicialController');
const fundoCtlr = require('./fundo/fundoController');
const usuarioCtlr = require('./usuario/usuarioController');
const worldCtlr = require('./world/worldController');

module.exports.set = function(app) {
  paginaInicialCtlr.set(app);
  fundoCtlr.set(app);
  usuarioCtlr.set(app);
  worldCtlr.set(app);
}