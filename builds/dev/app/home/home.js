;(function(){
  'use strict';

  angular
    .module('time.home', [
    ])
    .controller('HomeCtrl', HomeController)
    .run(/*@ngInject*/function($log){$log.debug('Home Run')})
    .config(HomeConfig)

    /**
     * Home Controller
     */
    // @ngInject
    function HomeController($scope, $log, $rootScope)
    {
      $log.debug('HomeController');
      var s = this;

      var seconds = '00';
      var tens = '00';
      var appendTens = document.getElementById("tens");
      var appendSeconds = document.getElementById("seconds");
      var buttonStart = document.getElementById('button-start');
      var buttonStop = document.getElementById('button-stop');
      var buttonReset = document.getElementById('button-reset');
      var Interval ;
      
      s.tasks = [];


      s.startTimer = function() {
        console.log('startTimer')
        tens++;

    if(tens < 9){
      appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9){
      appendTens.innerHTML = tens;

    }

    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }

  }
      s.start = function(){
        console.log('start')

        clearInterval(Interval);
     Interval = setInterval(s.startTimer, 10);
      }

      s.stop = function(){
        console.log('stop')

        clearInterval(Interval);
      }

      s.reset = function(){
        console.log('reset')

        clearInterval(Interval);
    tens = "00";
  	seconds = "00";
    appendTens.innerHTML = tens;
  	appendSeconds.innerHTML = seconds;
      }

      $rootScope.currentPage = 'home';
    };

    // @ngInject
    function HomeConfig ($stateProvider) {
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
