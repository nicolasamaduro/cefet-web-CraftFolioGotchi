const craftFolioGotchiApp = angular.module('craftFolioGotchiApp', ["ngAnimate","ngAria",'ngMaterial','ngMessages']);

craftFolioGotchiApp.config(function($mdThemingProvider,$interpolateProvider) {
  $mdThemingProvider.theme('default').dark()
    .primaryPalette('green')
    .accentPalette('red');
    
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});