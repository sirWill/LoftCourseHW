;
(function() {
  'use strict';

  angular
    .module('time', [
      'ngRoute',
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
  MainController.$inject = ["$rootScope"];

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
  MainRun.$inject = ["$log", "$rootScope"];

  // @ngInject
  function MainConfig($routeProvider, $logProvider) {
    console.log('Main Config');
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
    $logProvider.debugEnabled(false);
  }
  MainConfig.$inject = ["$routeProvider", "$logProvider"];

})();

;(function(){
  'use strict';
  angular.module('time.dbc', [
    'firebase',
  ])
  .factory('dbc', dbcFactory)

  // @ngInject
  function dbcFactory(FURL)
  {
    var o = {};
    var ref = new Firebase(FURL);
    o.getRef = function(){
      return ref;
    }

    return o;
  }
  dbcFactory.$inject = ["FURL"];
})();

;(function(){
  'use strict';

  angular
    .module('time.home', [
      'ngRoute',
    ])
    .controller('HomeCtrl', HomeController)
    .run(/*@ngInject*/["$log", function($log){$log.debug('Home Run')}])
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
    }
    HomeController.$inject = ["$scope", "$log", "$rootScope"];;

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
    HomeConfig.$inject = ["$routeProvider"];
})();

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
  RegistrationController.$inject = ["$rootScope"];

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
  registrationConfig.$inject = ["$routeProvider"];
})();

;
(function() {
  'use strict';

  angular
    .module('time.users', [
      'ngRoute'
    ])
    .controller('usersCtrl', UsersController)
    .run( /*@ngInject*/ ["$log", function($log) {
      $log.debug('Users Run')
    }])
    .config(UsersConfig)
    .factory('users', usersFactory)

  /**
   * Home Controller
   */
  // @ngInject
  function UsersController($scope, $log, $rootScope, users) {
    $log.debug('UsersController');
    var s = this;

    s.users = [];
    users.getUsers().then(function(_data){
      s.users = _data;
    })

    $rootScope.currentPage = 'users';
  }
  UsersController.$inject = ["$scope", "$log", "$rootScope", "users"];

  // @ngInject
  function UsersConfig($routeProvider){
    $routeProvider
      .when('/users', {
        templateUrl: 'app/users/users.html',
        controller: 'usersCtrl',
        controllerAs: 'uc'
      });
  }
  UsersConfig.$inject = ["$routeProvider"];

  // @ngInject
  function usersFactory ($q, $http, dbc, $firebaseArray, $firebaseObject) {
    var o = {};
    var ref = dbc.getRef();
    var usersRef = ref.child('users');// new Firebase(FURL + 'users/')

    var users = null;

    o.getUsers = function(){
      return $firebaseArray(usersRef).$loaded(function(_d){
        console.log("got users list with length:", _d.length);
        return _d;
      });
    };


    return o;
  }
  usersFactory.$inject = ["$q", "$http", "dbc", "$firebaseArray", "$firebaseObject"];
})();
