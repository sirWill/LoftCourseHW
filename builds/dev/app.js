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
  function dbcFactory(FURL, $firebaseAuth)
  {
    var o = {};
    var ref = new Firebase(FURL);
    var auth = $firebaseAuth(ref);
    o.getRef = function(){
      return ref;
    }
    o.get$Auth = function(){
      return auth;
    }
    o.getAuth = function(){
      return ref.getAuth();
    }

    return o;
  }
  dbcFactory.$inject = ["FURL", "$firebaseAuth"];
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
    'time.dbc',
    'time.users',
  ])
  .config(registrationConfig)
  .controller('RegistrationCtrl', RegistrationController)
  .factory('registration', registrationFactory)


  // @ngInject
  function RegistrationController(registration, $rootScope)
  {
    var s = this;
    $rootScope.currentPage = 'registration';

    s.signinUser = {
      email: null,
      password: null
    };

    s.signin = function(){
      registration.signin(s.signinUser).then(function(){
      });
    }

    s.signupUser = {
      email: null,
      password: null,
      name: null,
      surname: null
    };

    s.signup = function(){
    registration.signup(s.signupUser).then(function(){

      });
    }

  }
  RegistrationController.$inject = ["registration", "$rootScope"];

  // @ngInject
  function registrationFactory(dbc, $rootScope, users){
    var o = {};
    var auth = dbc.get$Auth();

    $rootScope.logout = function(){
      auth.$unauth();
    };

    auth.$onAuth(function(authData){
      if (authData) {// Logged in
        console.log('$onAuth: Logged in ', authData);
        users.getUser(authData.uid).then(function(_user){
          $rootScope.currentUser = {
            loggedIn: true,
            fullname: _user.name + ' ' + _user.surname
          };
        })
      }else{// Logged out
        console.log('$onAuth: Logged out');
        $rootScope.currentUser = {
          loggedIn: false,
          fullname: null
        };
      }
    });

    o.signin = function(_user){
      return auth.$authWithPassword(_user);
    }

    o.signup = function(_user){
      return auth.$createUser({
        email   : _user.email,
        password: _user.password
      }).then(function(userData){
        console.log('User ' + userData.uid + ' created successfully!');
        var userRef = dbc.getRef().child('users').child(userData.uid);
        userRef.set({
          name: _user.name,
          surname: _user.surname,
          email: _user.email,
          registered: Firebase.ServerValue.TIMESTAMP,
          last_visit: Firebase.ServerValue.TIMESTAMP
        });
        return auth.$authWithPassword({
          email   : _user.email,
          password: _user.password
        });
      });
    }

    return o;
  }
  registrationFactory.$inject = ["dbc", "$rootScope", "users"];

  // @ngInject
  function registrationConfig($routeProvider){
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
    o.getUser = function(_id){
      return $firebaseObject(usersRef.child(_id)).$loaded();
    };


    return o;
  }
  usersFactory.$inject = ["$q", "$http", "dbc", "$firebaseArray", "$firebaseObject"];
})();
