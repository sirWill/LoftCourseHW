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
