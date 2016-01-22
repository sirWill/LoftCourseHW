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
