;(function(){
  'use strict';

  angular
    .module('time.home', [
      'ngRoute',
    ])
    .controller('HomeCtrl', HomeController)
    .run(/*@ngInject*/function($log){$log.debug('Home Run')})
    .config(HomeConfig)

    /**
     * Home Controller
     */
    // @ngInject
    function HomeController($scope, $log, $rootScope)
    {
      $log.debug('HomeController');
      var s = this;

      $rootScope.currentPage = 'home';
    };

    // @ngInject
    function HomeConfig ($routeProvider) {
      console.log('Home Config');
      $routeProvider
        .when('/home', {
          templateUrl: 'app/home/home.html',
          controller: 'HomeCtrl',
          controllerAs: 'hc'
        });
    }
})();
