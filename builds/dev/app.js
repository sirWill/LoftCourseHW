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
  MainController.$inject = ["$rootScope"];

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
  MainRun.$inject = ["$log", "$rootScope", "$state", "$stateParams", "dbc"];

  // @ngInject
  function MainConfig($urlRouterProvider, $logProvider) {
    console.log('Main Config');
    $urlRouterProvider.otherwise('/home');
    $logProvider.debugEnabled(false);
  }
  MainConfig.$inject = ["$urlRouterProvider", "$logProvider"];

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

    o.isLogin = function(){
    return auth.$getAuth();
  }

    return o;
  }
  dbcFactory.$inject = ["FURL", "$firebaseAuth"];
})();

;
(function() {
  'use strict';

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
  function HomeController($scope, $log, $rootScope) {
    $log.debug('HomeController');
    var s = this;

    var minutes = '00';
    var seconds = '00';
    var hours = '00';
    var showTaskName = document.getElementById('showTaskName');
    var Interval;
    var timer = false;
    var hourCost;
    var projectCost = 0;

    var appendSeconds = document.getElementById("seconds");
    var appendMinutes = document.getElementById("minutes");
    var appendHours = document.getElementById("hours");
    var buttonStart = document.getElementById('button-start');
    var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');
    var taskName = document.getElementById('taskName');
    var timeCost = document.getElementById('timeCost');


    s.tasks = [];

    function Task(name, time, cost) {
      this.name = name;
      this.time = time;
      this.cost = cost;
    }

    s.startTimer = function() {
      seconds++;

      if (seconds < 9) {
        appendSeconds.innerHTML = "0" + seconds;
      }

      if (seconds > 9) {
        appendSeconds.innerHTML = seconds;

      }

      if (seconds > 59) {
        minutes++;
        appendMinutes.innerHTML = "0" + minutes;
        seconds = 0;
        appendSeconds.innerHTML = "0" + 0;
      }

      if (minutes > 9) {
        appendMinutes.innerHTML = minutes;
      }

      if (minutes > 59) {
        hours++;
        projectCost = projectCost + +hourCost;
        appendHours.innerHTML = "0" + hours;
        minutes = 0;
        appendMinutes.innerHTML = "0" + 0;
      }
      console.log(projectCost);
    }

    s.start = function(projectCost) {
      if (!timer) {
        timer = true;
        clearInterval(Interval);
        buttonStart.innerHTML = "Пауза";
        Interval = setInterval(s.startTimer, 1);
      } else if (timer) {
        clearInterval(Interval);
        buttonStart.innerHTML = "Продолжить";
        timer = false;
      }
      hourCost = timeCost.value;
      console.log(hourCost);
        };

    s.reset = function() {

      clearInterval(Interval);
      var currentTime = hours + ":" + minutes + ":" + seconds;
      seconds = "00";
      minutes = "00";
      hours = "00";
      appendHours.innerHTML = hours;
      appendSeconds.innerHTML = seconds;
      appendMinutes.innerHTML = minutes;
      showTaskName.innerHTML = "";
      buttonStart.innerHTML = "Начать";
      s.saveTask(currentTime, projectCost);
    }

    s.saveTask = function(currentTime, projectCost) {
      if (!taskName.value) {
        name = "(Без названия)";
      } else {
        var name = taskName.value;
      }
      var task = new Task(name, currentTime, projectCost);
      s.tasks.push(task);
      console.log(s.tasks);
    }

    $rootScope.currentPage = 'home';
  }
  HomeController.$inject = ["$scope", "$log", "$rootScope"];;

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
  HomeConfig.$inject = ["$stateProvider"];
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
  registrationConfig.$inject = ["$stateProvider"];

})();

;
(function() {
  'use strict';

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
  UsersController.$inject = ["$scope", "$log", "$rootScope", "users"];

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
  UsersConfig.$inject = ["$stateProvider"];

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
