angular.module('app', ['ngMaterial', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'templates/home.html'
            }).
            when('/balance', {
                templateUrl: 'templates/balance.html'
            }).
            when('/account', {
                templateUrl: 'templates/account.html'
            }).
            when('/contact', {
                templateUrl: 'templates/contact.html'
            }).
            when('/careers', {
                templateUrl: 'templates/careers.html'
            }).
            otherwise('/home');
    }])
    .config(function($httpProvider){
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('grey');
    })
    .controller('AppCtrl', ['$scope', '$mdSidenav','luisService', function($scope, $mdSidenav,luisService) {
        $scope.chatInput = '';
        $scope.userChats = [];
        $scope.botChats = ['Hello.  How can I help you?'];

        $scope.submitUserChat = function() {
            $scope.userChats.push($scope.chatInput);
            $scope.date = new Date();

            $scope.chatInput = '';
        };

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
         };

        $scope.currentNavItem = 'home';

        $scope.openLuis = luisService.callIntent();
    }]).factory('luisService',['$http',function($http){

        var LUIS_URL = 'https://api.projectoxford.ai/luis/v1/application?id=c30e33ac-81ba-487b-99a5-e318f955226f&subscription-key=74722d25371d43f9b2d0d9d72eae583e&q=careers',
            getIntents = function(){

                $http({
                    method: 'GET',
                    url: LUIS_URL
                }).
                success(function(status) {
                    var json=JSON.stringify(status);

                    alert(json);
                    json=JSON.parse(json);
                }).
                error(function(status) {
                    //your code when fails
                });
            };
            return {"callIntent":getIntents};
    }]);
