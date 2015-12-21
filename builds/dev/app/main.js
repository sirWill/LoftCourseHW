;
(function() {
  'use strict';

  angular
    .module('time', [
      'ui.router',
      'ui.bootstrap',
      'time.home',
      'time.users',
      'time.registration',
      'time.dbc',
    ])
    .constant('FURL', 'https://timedem.firebaseio.com/')
    .controller('MainCtrl', MainController)
    .run(MainRun)
    .config(MainConfig);

  // @ngInject
  function MainController($rootScope) {
    var s = this;

    s.hello_message = "Привет, мир!";
    $rootScope.root = 'Root 1';
  }

  // @ngInject
  function MainRun($log, $rootScope) {
    $log.debug('Main Run');

    $rootScope.alerts = [];
    $rootScope.addAlert = function(_msg, _type) {
      _type = _type || 'warning';
      $rootScope.alerts.push({
        msg: _msg,
        type: _type
      });
    };

    $rootScope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };
  }

  // @ngInject
  function MainConfig($urlRouterProvider, $logProvider) {
    console.log('Main Config');
    $urlRouterProvider.otherwise('/home');
    $logProvider.debugEnabled(false);
  }

})();
