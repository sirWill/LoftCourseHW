;
(function() {
  'use strict';

  angular
    .module('time.users', [
      'time.dbc'
    ])
    .controller('usersCtrl', UsersController)
    .run( /*@ngInject*/ function($log) {
      $log.debug('Users Run')
    })
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
