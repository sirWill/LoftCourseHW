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
})();
