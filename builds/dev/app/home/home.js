;
(function() {
  'use strict';

  angular
    .module('time.home', [])
    .controller('HomeCtrl', HomeController)
    .run( /*@ngInject*/ function($log) {
      $log.debug('Home Run')
    })
    .config(HomeConfig)
    .factory('tasks', tasksFactory)



  /**
   * Home Factory
   */
  // @ngInject
  function tasksFactory($q, $http, dbc, $firebaseArray, $firebaseObject, registration, $rootScope){
    var o = {};
    var ref = dbc.getRef();
    var usersRef = ref.child('users');
    var userRef = usersRef.child('e5cbb945-27f1-48f3-834c-786144653b7a');
    var userTasks = userRef.child('tasks');
    var tasks = [];


    o.getAllTasks = function(){
      tasks = $firebaseArray(userTasks);
      return tasks;
    }
    o.addNewTask = function(_newTask){
      tasks.$add({
        name: _newTask.name || "(Без названия)",
        time: _newTask.time || "(Не определено)",
        cost: _newTask.cost || "(Не определена)"
      })
    }

    return o;
  }

  /**
   * Home Controller
   */
  // @ngInject

  function HomeController($scope, $log, $rootScope, $interval, tasks) {

    $log.debug('HomeController');
    var s = this;

    s.timer = null;

    s.tasks = tasks.getAllTasks();
    s.newTask = {
      name: null,
      time: null,
      cost: null
    };

    var startDate, curDate, curTimerStart, timerVal, timer = null;

    s.startBtnText = 'Начать';

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
      s.newTask.time = s.timer;
      tasks.addNewTask(s.newTask);
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
