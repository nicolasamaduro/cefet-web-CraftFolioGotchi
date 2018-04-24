var craftFolioGotchiApp = angular.module('craftFolioGotchiApp', ["ngAnimate","ngAria",'ngMaterial','ngMessages']);

craftFolioGotchiApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').dark()
    .primaryPalette('green')
    .accentPalette('red');
});