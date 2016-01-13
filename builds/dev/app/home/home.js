;(function(){
  'use strict';

  angular
    .module('time.home', [
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
    function HomeConfig ($stateProvider) {
      console.log('Home Config');
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'app/home/home.html',
          controller: 'HomeCtrl',
          authenticate: false,
          controllerAs: 'hc'
        });
    }
})();
