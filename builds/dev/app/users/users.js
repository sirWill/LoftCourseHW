;
(function() {
  'use strict';

  angular
    .module('time.users', [])
    .constant('CONSTANT', 'This is constant')
    .value('Value', {
      'val': 'This is value'
    })
    .controller('usersCtrl', UsersController)
    .run( /*@ngInject*/ function($log) {
      $log.debug('Users Run')
    })
    .config(UsersConfig)
    .filter('dateFilter', DateFilter);

  /**
   * Home Controller
   */
  // @ngInject
  function UsersController($scope, $log, $rootScope, CONSTANT, Value) {
    $log.debug('UsersController');
    var s = this;

    var jsonUser = [{
      "_id": "5663452d06ffabc9c9aa0710",
      "age": 39,
      "eyeColor": "green",
      "name": {
        "first": "Sharpe",
        "last": "Oneil"
      },
      "registered": new Date()
    }, {
      "_id": "5663452da80e1fd51e7b67af",
      "age": 21,
      "eyeColor": "green",
      "name": {
        "first": "Tabitha",
        "last": "Ayala"
      },
      "registered": "Saturday, August 22, 2015 12:00 PM"
    }, {
      "_id": "5663452dd8e512053005201e",
      "age": 34,
      "eyeColor": "blue",
      "name": {
        "first": "Ashley",
        "last": "Solis"
      },
      "registered": "Thursday, October 9, 2014 12:19 PM"
    }, {
      "_id": "5663452dc6fd14754cf87c97",
      "age": 26,
      "eyeColor": "brown",
      "name": {
        "first": "Marquita",
        "last": "Winters"
      },
      "registered": "Wednesday, June 10, 2015 8:22 AM"
    }, {
      "_id": "5663452d81a7d067320126da",
      "age": 25,
      "eyeColor": "blue",
      "name": {
        "first": "Willa",
        "last": "Long"
      },
      "registered": "Tuesday, January 6, 2015 11:54 PM"
    }, {
      "_id": "5663452d75641ec2d24c2229",
      "age": 22,
      "eyeColor": "brown",
      "name": {
        "first": "Maribel",
        "last": "Tyson"
      },
      "registered": "Saturday, July 11, 2015 6:56 PM"
    }, {
      "_id": "5663452d4d35f18948c0984d",
      "age": 25,
      "eyeColor": "blue",
      "name": {
        "first": "Deana",
        "last": "Frank"
      },
      "registered": "Tuesday, January 28, 2014 11:00 PM"
    }, {
      "_id": "5663452d6d9c9b167d7999e0",
      "age": 33,
      "eyeColor": "blue",
      "name": {
        "first": "Amparo",
        "last": "Stone"
      },
      "registered": new Date()
    }, {
      "_id": "5663452d6223aa55497340eb",
      "age": 28,
      "eyeColor": "brown",
      "name": {
        "first": "Wong",
        "last": "Valencia"
      },
      "registered": "Saturday, July 19, 2014 12:50 PM"
    }, {
      "_id": "5663452d5a475bd08c31d3ed",
      "age": 40,
      "eyeColor": "blue",
      "name": {
        "first": "Deleon",
        "last": "Beach"
      },
      "registered": "Wednesday, February 5, 2014 8:12 AM"
    }, {
      "_id": "5663452d33ee22a42a4127df",
      "age": 23,
      "eyeColor": "green",
      "name": {
        "first": "Guthrie",
        "last": "Bean"
      },
      "registered": "Saturday, November 21, 2015 2:49 AM"
    }, {
      "_id": "5663452d62f7b41d88f899ba",
      "age": 27,
      "eyeColor": "green",
      "name": {
        "first": "Mary",
        "last": "Petty"
      },
      "registered": "Monday, January 19, 2015 6:31 AM"
    }, {
      "_id": "5663452d8419ae29e7e5da07",
      "age": 35,
      "eyeColor": "brown",
      "name": {
        "first": "Hilary",
        "last": "Floyd"
      },
      "registered": "Wednesday, December 3, 2014 10:55 PM"
    }, {
      "_id": "5663452d60770f5a8648fb99",
      "age": 23,
      "eyeColor": "green",
      "name": {
        "first": "Jeanette",
        "last": "Cunningham"
      },
      "registered": "Thursday, February 19, 2015 3:23 AM"
    }, {
      "_id": "5663452d7c52a62131c369b2",
      "age": 33,
      "eyeColor": "brown",
      "name": {
        "first": "Rachelle",
        "last": "Hartman"
      },
      "registered": "Friday, June 12, 2015 12:31 AM"
    }, {
      "_id": "5663452dd3d7fcf19942f87d",
      "age": 27,
      "eyeColor": "brown",
      "name": {
        "first": "Carmella",
        "last": "Monroe"
      },
      "registered": "Thursday, February 27, 2014 1:06 PM"
    }, {
      "_id": "5663452d63cb8049d844a41c",
      "age": 37,
      "eyeColor": "green",
      "name": {
        "first": "Amy",
        "last": "Charles"
      },
      "registered": "Monday, April 27, 2015 1:54 AM"
    }, {
      "_id": "5663452d271d1a3ce4f00bc1",
      "age": 40,
      "eyeColor": "green",
      "name": {
        "first": "Atkins",
        "last": "Newman"
      },
      "registered": new Date()
    }, {
      "_id": "5663452d73e96ff8ac676cd7",
      "age": 34,
      "eyeColor": "brown",
      "name": {
        "first": "Lloyd",
        "last": "Mcgee"
      },
      "registered": "Monday, October 19, 2015 1:54 AM"
    }, {
      "_id": "5663452d7fd8d0c5bb1b52b7",
      "age": 22,
      "eyeColor": "green",
      "name": {
        "first": "Jody",
        "last": "Buckley"
      },
      "registered": "Sunday, July 5, 2015 8:45 AM"
    }, {
      "_id": "5663452de801b0815ef7d8b7",
      "age": 26,
      "eyeColor": "blue",
      "name": {
        "first": "Ingram",
        "last": "Knight"
      },
      "registered": "Wednesday, May 14, 2014 7:59 AM"
    }, {
      "_id": "5663452d9aee2e8d57b9df60",
      "age": 28,
      "eyeColor": "brown",
      "name": {
        "first": "Karla",
        "last": "Parker"
      },
      "registered": "Wednesday, February 18, 2015 9:12 AM"
    }, {
      "_id": "5663452d65d9633f750d99d0",
      "age": 22,
      "eyeColor": "green",
      "name": {
        "first": "Peck",
        "last": "Mcknight"
      },
      "registered": "Saturday, June 13, 2015 5:26 AM"
    }, {
      "_id": "5663452d39ab73b101be8fac",
      "age": 24,
      "eyeColor": "brown",
      "name": {
        "first": "Marguerite",
        "last": "Gardner"
      },
      "registered": "Tuesday, April 28, 2015 10:30 AM"
    }, {
      "_id": "5663452d1d200afd0a5e3b78",
      "age": 21,
      "eyeColor": "blue",
      "name": {
        "first": "Alyson",
        "last": "Kemp"
      },
      "registered": "Saturday, May 24, 2014 10:00 PM"
    }, {
      "_id": "5663452d2c1dd3876002e65e",
      "age": 28,
      "eyeColor": "blue",
      "name": {
        "first": "White",
        "last": "Wilkinson"
      },
      "registered": "Saturday, January 11, 2014 10:58 AM"
    }, {
      "_id": "5663452d9ff18cc7d6a47a37",
      "age": 33,
      "eyeColor": "green",
      "name": {
        "first": "Farley",
        "last": "Salazar"
      },
      "registered": "Thursday, July 2, 2015 12:56 AM"
    }, {
      "_id": "5663452d46087dd9bcc0351a",
      "age": 38,
      "eyeColor": "brown",
      "name": {
        "first": "Palmer",
        "last": "Stuart"
      },
      "registered": "Monday, August 18, 2014 11:14 AM"
    }, {
      "_id": "5663452dab2bd396f9adebc9",
      "age": 40,
      "eyeColor": "green",
      "name": {
        "first": "Sweet",
        "last": "Hoover"
      },
      "registered": "Wednesday, July 15, 2015 11:25 PM"
    }, {
      "_id": "5663452df106ed0ae8540f32",
      "age": 25,
      "eyeColor": "green",
      "name": {
        "first": "Koch",
        "last": "Rollins"
      },
      "registered": "Tuesday, March 10, 2015 12:03 PM"
    }, {
      "_id": "5663452df1efc8c4be7519db",
      "age": 34,
      "eyeColor": "green",
      "name": {
        "first": "Eliza",
        "last": "Davis"
      },
      "registered": "Tuesday, June 16, 2015 11:32 AM"
    }, {
      "_id": "5663452d04959066a34bb548",
      "age": 23,
      "eyeColor": "green",
      "name": {
        "first": "Rene",
        "last": "Morales"
      },
      "registered": "Wednesday, July 30, 2014 10:58 PM"
    }, {
      "_id": "5663452dc64e1f2d8da07570",
      "age": 23,
      "eyeColor": "blue",
      "name": {
        "first": "Sheryl",
        "last": "Nicholson"
      },
      "registered": "Friday, May 16, 2014 1:44 PM"
    }, {
      "_id": "5663452d9dbe871de55a32d3",
      "age": 25,
      "eyeColor": "brown",
      "name": {
        "first": "Candy",
        "last": "Burnett"
      },
      "registered": "Wednesday, February 4, 2015 12:34 AM"
    }, {
      "_id": "5663452defff9cb8dc0fcf15",
      "age": 24,
      "eyeColor": "green",
      "name": {
        "first": "Sheila",
        "last": "Sykes"
      },
      "registered": "Wednesday, September 3, 2014 4:14 PM"
    }, {
      "_id": "5663452d103359e33c45d987",
      "age": 25,
      "eyeColor": "blue",
      "name": {
        "first": "Valarie",
        "last": "Burton"
      },
      "registered": "Monday, July 20, 2015 10:31 PM"
    }, {
      "_id": "5663452df760f8fe4df36682",
      "age": 37,
      "eyeColor": "blue",
      "name": {
        "first": "Buchanan",
        "last": "Cotton"
      },
      "registered": "Sunday, June 28, 2015 5:47 AM"
    }, {
      "_id": "5663452d759de9b8945a99c6",
      "age": 31,
      "eyeColor": "blue",
      "name": {
        "first": "Zamora",
        "last": "Blevins"
      },
      "registered": "Friday, July 24, 2015 2:07 PM"
    }, {
      "_id": "5663452d91f5af284340d424",
      "age": 37,
      "eyeColor": "brown",
      "name": {
        "first": "Doreen",
        "last": "Ramirez"
      },
      "registered": "Wednesday, August 12, 2015 9:01 PM"
    }, {
      "_id": "5663452d5dbf80fb3a49592c",
      "age": 37,
      "eyeColor": "blue",
      "name": {
        "first": "Heidi",
        "last": "Guy"
      },
      "registered": "Sunday, June 8, 2014 11:40 AM"
    }, {
      "_id": "5663452d99791a8d9985596a",
      "age": 31,
      "eyeColor": "blue",
      "name": {
        "first": "Holt",
        "last": "Mosley"
      },
      "registered": "Friday, January 24, 2014 6:27 PM"
    }, {
      "_id": "5663452d01671c6c68b12800",
      "age": 34,
      "eyeColor": "blue",
      "name": {
        "first": "Nelda",
        "last": "Poole"
      },
      "registered": "Monday, July 28, 2014 6:31 PM"
    }, {
      "_id": "5663452dd267b2058d5469f1",
      "age": 24,
      "eyeColor": "brown",
      "name": {
        "first": "Helga",
        "last": "Decker"
      },
      "registered": "Saturday, October 25, 2014 9:24 AM"
    }, {
      "_id": "5663452da5aa89c6d849cb25",
      "age": 36,
      "eyeColor": "brown",
      "name": {
        "first": "Linda",
        "last": "Herring"
      },
      "registered": "Saturday, April 12, 2014 11:34 AM"
    }, {
      "_id": "5663452ddc2f42ff61014004",
      "age": 29,
      "eyeColor": "blue",
      "name": {
        "first": "Stokes",
        "last": "Gilmore"
      },
      "registered": "Friday, October 2, 2015 7:18 PM"
    }, {
      "_id": "5663452dfbd79eaf90c86f5c",
      "age": 29,
      "eyeColor": "brown",
      "name": {
        "first": "Genevieve",
        "last": "Mcfarland"
      },
      "registered": "Thursday, May 21, 2015 7:36 PM"
    }, {
      "_id": "5663452d718bfaef93296e9b",
      "age": 22,
      "eyeColor": "brown",
      "name": {
        "first": "Hutchinson",
        "last": "Heath"
      },
      "registered": "Saturday, June 6, 2015 11:13 AM"
    }, {
      "_id": "5663452da630ea6dac62d8a5",
      "age": 20,
      "eyeColor": "green",
      "name": {
        "first": "Jacobs",
        "last": "Patton"
      },
      "registered": "Thursday, July 23, 2015 2:11 PM"
    }, {
      "_id": "5663452dee36b35c6880c86e",
      "age": 20,
      "eyeColor": "brown",
      "name": {
        "first": "Katharine",
        "last": "Barton"
      },
      "registered": "Saturday, June 7, 2014 7:17 AM"
    }, {
      "_id": "5663452d070939c043ff7326",
      "age": 32,
      "eyeColor": "brown",
      "name": {
        "first": "Hines",
        "last": "Roth"
      },
      "registered": "Friday, May 29, 2015 1:36 PM"
    }];
    s.users = jsonUser;

    $rootScope.currentPage = 'home';
  }

  // @ngInject
  function UsersConfig($routeProvider) {
    console.log('Users Config');
    $routeProvider
      .when('/', {
        templateUrl: 'app/users/users.html',
        controller: 'usersCtrl',
        controllerAs: 'hc'
      });
  }



  // @ngInject
  function DateFilter() {

    return function(item) {
      var date = Date.parse(item);
      var diff = new Date() - date;
      if (diff <= 1000) {
        date = "только что";
      } else if ((diff >= 604800000) && (diff < 2592000000)) {
        date = "больше недели назад"
      } else if ((diff >= 2592000000) && (diff < 2592000000 * 3)) {
        date = "больше месяца назад"
      } else if (diff > 2592000000 * 3) {
        date = "больше трёх месяцев назад"
      } else {
        date = "все"
      }
      return date;
    }
  }
})();
