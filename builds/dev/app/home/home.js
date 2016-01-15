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
  function HomeController($scope, $log, $rootScope) {
    $log.debug('HomeController');
    var s = this;

    var seconds = '00';
    var tens = '00';
    var appendTens = document.getElementById("tens");
    var appendSeconds = document.getElementById("seconds");
    var buttonStart = document.getElementById('button-start');
    var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');
    var taskName = document.getElementById('taskName');
    var showTaskName = document.getElementById('showTaskName');
    var Interval;

    s.tasks = [];

    function Task(name, time) {
      this.name = name;
      this.time = time;
    }


    s.startTimer = function() {
      tens++;

      if (tens < 9) {
        appendTens.innerHTML = "0" + tens;
      }

      if (tens > 9) {
        appendTens.innerHTML = tens;

      }

      if (tens > 99) {
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
      }

      if (seconds > 9) {
        appendSeconds.innerHTML = seconds;
      }

    }
    s.start = function() {
      clearInterval(Interval);
      Interval = setInterval(s.startTimer, 10);
    }

    s.stop = function() {
      clearInterval(Interval);
    }

    s.reset = function() {

      clearInterval(Interval);
      var curentTime = seconds + ":" + tens;
      tens = "00";
      seconds = "00";
      appendTens.innerHTML = tens;
      appendSeconds.innerHTML = seconds;
      showTaskName.innerHTML = "";

      s.saveTask(curentTime);
    }
    s.saveTask = function(curentTime) {
      if (!taskName.value) {
        name = "(Без названия)"
      } else {
        var name = taskName.value;
      }
      var task = new Task(name, curentTime);
      s.tasks.push(task);
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
