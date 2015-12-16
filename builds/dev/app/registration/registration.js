;(function(){
  'use strict';

  angular.module('time.registration', [
  ])
  .config(registrationConfig)
  .controller('RegistrationCtrl', RegistrationController)


  // @ngInject
  function RegistrationController($rootScope)
  {
    var s = this;
    $rootScope.currentPage = 'registration';
  }

  // @ngInject
  function registrationConfig($routeProvider){
    console.log('Registration Config')
    $routeProvider
    .when('/signin', {
      templateUrl: 'app/registration/signin.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'rc'
    })
    .when('/signup', {
        templateUrl: 'app/registration/signup.html',
        controller: 'RegistrationCtrl',
        controllerAs: 'rc'
      });
  }
})();
