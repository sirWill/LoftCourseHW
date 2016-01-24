;
(function() {
  'use strict';

  MainController.$inject = ["$rootScope"];
  MainRun.$inject = ["$log", "$rootScope", "$state", "$stateParams", "dbc"];
  MainConfig.$inject = ["$urlRouterProvider", "$logProvider"];
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
  function MainRun($log, $rootScope, $state, $stateParams, dbc) {
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

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
          //console.log('toState:',toState, 'toParams:',toParams, 'fromState:',fromState, 'fromParams:',fromParams);
          if (toState.authenticate && !dbc.isLogin()) {
            $state.transitionTo('signin');
            $rootScope.isLoggin = false;
            event.preventDefault();
          } else if (!toState.authenticate && dbc.isLogin()) {
            $rootScope.isLoggin = true;
            //$state.transitionTo('home');
            //event.preventDefault();
          } else if (!toState.authenticate && !dbc.isLogin()) {
            //$state.transitionTo('home');
            //event.preventDefault();
          }
        });

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

  }

  // @ngInject
  function MainConfig($urlRouterProvider, $logProvider) {
    console.log('Main Config');
    $urlRouterProvider.otherwise('/home');
    $logProvider.debugEnabled(false);
  }

})();

;(function(){
  'use strict';
  dbcFactory.$inject = ["FURL", "$firebaseAuth"];
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

    o.isLogin = function(){
    return auth.$getAuth();
  }

    return o;
  }
})();

;
(function() {
  'use strict';

  HomeController.$inject = ["$scope", "$log", "$rootScope", "$interval"];
  HomeConfig.$inject = ["$stateProvider"];
  angular
    .module('time.home', [])
    .controller('HomeCtrl', HomeController)
    .run( /*@ngInject*/ ["$log", function($log) {
      $log.debug('Home Run')
    }])
    .config(HomeConfig)

  /**
   * Home Controller
   */
  // @ngInject
  function HomeController($scope, $log, $rootScope, $interval) {
    $log.debug('HomeController');
    var s = this;

    s.timer = null;

    s.newTask = {
      name: null,
      time: null,
      cost: null
    };

    var startDate, curDate, curTimerStart, timerVal, timer = null;

    s.startBtnText = 'Начать';

    s.tasks = [];

    s.start = function(projectCost) {
      if (timer) {
        $interval.cancel(timer);
        timer = null;
        timerVal = timerVal + curDate;
        s.startBtnText = 'Продолжить';
      } else {
        if(!startDate){
          startDate = new Date();
          timerVal = 0;
        }
        curTimerStart = new Date();
        timer = $interval(function(){
          curDate = new Date() - curTimerStart;
          s.timer = timerVal + curDate;
        }, 1000);
        s.startBtnText = 'Пауза';
      }
    };

    s.reset = function() {
      if(timer){
        $interval.cancel(timer);
        timer = null;
      }
      s.saveTask();
      s.startBtnText = 'Начать';
    }

    s.saveTask = function() {
      if(!s.newTask.name){
        s.newTask.name = '(Без названия)';
      }
      s.newTask.time = s.timer;
      s.tasks.push(s.newTask);
      s.newTask = {
        name: null,
        time: null,
        cost: null
      }
      localStorage.tasks = JSON.stringify(s.tasks);
    }

    $rootScope.currentPage = 'home';
  };

  // @ngInject
  function HomeConfig($stateProvider) {
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

;(function(){
  'use strict';

  RegistrationController.$inject = ["registration", "$rootScope"];
  registrationFactory.$inject = ["dbc", "$rootScope", "users"];
  registrationConfig.$inject = ["$stateProvider"];
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

  // @ngInject
  function registrationConfig($stateProvider){
    $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/registration/signin.html',
      controller: 'RegistrationCtrl',
      authenticate: false,
      controllerAs: 'rc'
    })
    .state('signup', {
      url: '/signup',
        templateUrl: 'app/registration/signup.html',
        controller: 'RegistrationCtrl',
        authenticate: false,
        controllerAs: 'rc'
      });
  }

})();

;
(function() {
  'use strict';

  UsersController.$inject = ["$scope", "$log", "$rootScope", "users"];
  UsersConfig.$inject = ["$stateProvider"];
  usersFactory.$inject = ["$q", "$http", "dbc", "$firebaseArray", "$firebaseObject"];
  angular
    .module('time.users', [
      'time.dbc'
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

  // @ngInject
  function UsersConfig($stateProvider){
    $stateProvider
      .state('users', {
        url: '/users',
        templateUrl: 'app/users/users.html',
        controller: 'usersCtrl',
        authenticate: true,
        controllerAs: 'uc',
        resolve: {
        'auth': ['dbc', '$q', '$state', function(dbc, $q, $state){
          var deferred = $q.defer();
          setTimeout(function(){
            console.log('auth promise', dbc.get$Auth().$getAuth());
            if(dbc.get$Auth().$getAuth() !== null){
              console.log('Resolve!');
              deferred.resolve();
            }else{
              console.log('Reject!');
              $state.go('signin');
              deferred.reject();
            }
          }, 50);
          return deferred.promise;
        }]
      }
      });
  }

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
})();
