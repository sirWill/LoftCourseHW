;(function(){
  'use strict';
  angular.module('time.dbc', [
    'firebase',
  ])
  .factory('dbc', dbcFactory)

  // @ngInject
  function dbcFactory(FURL)
  {
    var o = {};
    var ref = new Firebase(FURL);
    o.getRef = function(){
      return ref;
    }

    return o;
  }
})();
