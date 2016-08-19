angular.module('app', ['ngMaterial', 'ngRoute', 'ngResource','apiFactories'])
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
    .controller('AppCtrl', ['$scope', '$mdSidenav','luisService','intentService','newsRecentStories','newsPersonalfinance','newsEconWeek','jobs',
                            function($scope, $mdSidenav,luisService,intentService, newsRecentStories, newsPersonalfinance, newsEconWeek, jobs) {
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

        luisService.getIntent('Tell me about careers',intentService.determineIntent);
    }]).factory('luisService',['$http',function($http){


        var LUIS_URL = 'https://api.projectoxford.ai/luis/v1/application?id=c30e33ac-81ba-487b-99a5-e318f955226f&subscription-key=74722d25371d43f9b2d0d9d72eae583e&q=',
            getIntents = function(query,callback){

                $http({
                    method: 'GET',
                    url: LUIS_URL+query
                }).
                success(function(status) {
                    var json=JSON.stringify(status);
                    json=JSON.parse(json);

                    callback(json);
                }).
                error(function(status) {
                    //your code when fails
                });
            };
            return {"getIntent":getIntents};
    }]).factory('intentService',function(){
            var determineIntent = function(jsonObject){
                if(jsonObject)
                {
                    var firstIntent = jsonObject.intents[0],
                        foundIntent,
                        returnIntentObject = {'intent':'','entities':jsonObject.entities};

                    if(firstIntent)
                    {
                           foundIntent  = firstIntent.intent;

                            switch(foundIntent)
                            {
                                case 'Careers':
                                    returnIntentObject.intent = 'Careers';
                                    break;
                                case 'Account':
                                    returnIntentObject.intent = 'Account';
                                    break;
                                case 'Balance':
                                    returnIntentObject.intent = 'Balance';
                                    break;
                                case 'Contact':
                                    returnIntentObject.intent = 'Contact';
                                    break;
                                default:
                                    returnIntentObject.intent = 'Home';
                                    break;
                            }
                    }


                    alert('Hi I found the intent '+returnIntentObject.intent);

                    return returnIntentObject;
                }
            };

            return {"determineIntent":determineIntent};
    })


