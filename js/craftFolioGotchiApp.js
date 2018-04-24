var craftFolioGotchiApp = angular.module('craftFolioGotchiApp', ["ngAnimate","ngAria",'ngMaterial','ngMessages']);

craftFolioGotchiApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').dark()
    .primaryPalette('green')
    .accentPalette('red');
});
craftFolioGotchiApp.config(function($mdIconProvider) {
    $mdIconProvider.fontSet('md', 'material-icons');
  });