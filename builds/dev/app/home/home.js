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
  function tasksFactory(){
    var o = {};
    var tasks = [];

    var lst = localStorage.tasks;

    function restoreTasksFromLocalStorage(){
      if(localStorage.getItem('tasks'))
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    function saveTasksToLocalStorage(){
      localStorage.tasks = JSON.stringify(tasks);
    }

    o.getAll = function(){
      if(tasks.length == 0)
        restoreTasksFromLocalStorage();
      return tasks;
    };

    o.addTask = function(_n){
      _n.name = _n.name || '(Без названия)';
      tasks.push(_n);
      saveTasksToLocalStorage();
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

    function resetNewTask(){
      s.newTask = {
        name: null,
        time: null,
        cost: null
      };
    };
    resetNewTask();

    s.tasks = tasks.getAll();

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
      tasks.addTask(s.newTask);
      resetNewTask();
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
