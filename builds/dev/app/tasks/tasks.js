;
(function() {
  'use strict';

  angular
    .module('time.tasks', [
      'time.dbc',
      'time.registration'
    ])
    .controller('tasksCtrl', TasksController)
    .run( /*@ngInject*/ function($log) {
      $log.debug('Tasks Run');
    })
    .config(TasksConfig)
    .factory('fireTasks', fireTasksFactory);

  /**
   * Tasks Factory
   */
  // @ngInject
  function fireTasksFactory ($q, $http, dbc, $firebaseArray, $firebaseObject, registration, $rootScope) {
    var o = {};
    var ref = dbc.getRef();
    var usersRef = ref.child('users');

    o.getUsersArr = function(){
      return $firebaseArray(usersRef).$loaded(function(_d){
        console.log("got usersArr list with length:", _d.length);
        return _d;
      });
    };

    return o;
  }

  /**
   * Tasks Controller
   */
  // @ngInject
  function TasksController($q, $http, dbc, $firebaseArray, $firebaseObject, registration, $log, $rootScope, fireTasks) {
    $log.debug('TasksController');
    var s = this;
    s.tasks = {};
    getCurrentUserTasks();
    function getCurrentUserTasks(){
      fireTasks.getUsersArr().then(function(_data){
        s.users = _data;
        angular.forEach(s.users, function(value, key){
          if(value.$id === $rootScope.currentID){
            s.tasks = value.tasks;
          }
        })
        console.log("usersArr :", s.users);
        console.log("curentTasks :", s.tasks);
      });
    }


    $rootScope.currentPage = 'tasks';
  }
  /**
   * Tasks Config
   */
  // @ngInject
  function TasksConfig($stateProvider){
    console.log('Tasks Config');
    $stateProvider
      .state('tasks', {
        url: '/tasks',
        templateUrl: 'app/tasks/tasks.html',
        controller: 'tasksCtrl',
        authenticate: false,
        controllerAs: 'tc',
      });
  }
})();
