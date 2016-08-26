angular.module('app', ['ngMaterial', 'ngRoute', 'ngResource','apiFactories', 'beacon'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'templates/home.html'
            }).
            when('/investing', {
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
    .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('grey');
    })
    .controller('AppCtrl', ['$scope', '$mdSidenav','luisService','intentService','newsRecentStories','newsPersonalfinance',
                            'newsEconWeek','getFundInfoService','findFundService', '$filter', 'getJobsInfoService', '$timeout',
                            function($scope, $mdSidenav,luisService,intentService, newsRecentStories, newsPersonalfinance, newsEconWeek, getFundInfoService,findFundService,$filter, getJobsInfoService, $timeout) {

        var location,
            fullTime,
            jobType,
            stepNumber;

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
         };

        $scope.currentNavItem = 'home';

        $scope.chats = [{"messenger": "bot", "message":"Hello, How may I help you?"}];

        $scope.userChat = '';

        $scope.addUserChat = function() {
            $scope.chats.push({"messenger": "user", "message": $scope.userChat});

            if(!luisIsOn) {
                switch(stepNumber) {
                    case 'step1':
                          location = $scope.userChat;
                          careerStep2();
                          break;
                    case 'step2':
                          fullTime = $scope.userChat;
                          careerStep3();
                          break;
                    case 'step3':
                         jobType = $scope.userChat;
                         luisIsOn = true;
                         careerStep4();
                         break;
                    default:
                        break;
                }
            }

            if(luisIsOn) {
                 luisService.getIntent($scope.userChat, function(intentInfo) {
                   if(intentInfo){
                         var firstIntent = intentInfo.intents[0],
                             foundIntent,
                             returnIntentObject = {'intent':'','entities':intentInfo.entities},
                             returnData;

                         if(firstIntent){
                                foundIntent  = firstIntent.intent;

                                 switch(foundIntent){
                                     case 'Careers':
                                         returnIntentObject.intent = 'careers';
                                         //returnData = '#careers';
                                         startCareerProcess();
                                         break;
                                     case 'Account':
                                         returnIntentObject.intent = 'account';
                                         returnData = '#account'
                                         botResponseAccount(returnIntentObject, returnData);
                                         break;
                                     case 'FundInformation':
                                         returnIntentObject.intent = $scope.findFundByTicker(intentInfo.entities[0].entity);
                                          if(returnIntentObject.intent){
                                                returnIntentObject.intent = "Fund name:" + returnIntentObject.intent.name + "\n"+"price:"+returnIntentObject.intent.price;
                                          }
                                          returnData = '';
                                          botResponse(returnIntentObject, returnData)
                                         break;
                                     case 'Contact':
                                         returnIntentObject.intent = 'contact';
                                         returnData = '#contact'
                                         botResponse(returnIntentObject, returnData);
                                         break;
                                     default:
                                         returnIntentObject.intent = 'home';
                                         returnData = '#home';
                                         botResponse(returnIntentObject, returnData);
                                         break;
                                 }
                         }
                    }
                });
            }
            $scope.userChat = '';
            $scope.botChat = '';
        };

        var luisIsOn = true;

        var startCareerProcess = function(){
            var initialResponse = "I have found " + $scope.ReportEntryData.length + " opportunities at Vanguard."
             $scope.chats.push({"messenger": "bot", "message": initialResponse});

             $scope.chats.push({"messenger": "bot", "message": "Which location, NC or PA?"});
             scrollToBottom();
                stepNumber = "step1";
             luisIsOn = false;
        },

        careerStep2 = function(){
             $scope.chats.push({"messenger": "bot", "message": "Are you looking for full time or part time?"});
             scrollToBottom();
             stepNumber = "step2";
        },

        careerStep3 = function(){
            $scope.chats.push({"messenger": "bot", "message": "What type of job are you looking for?"});
            scrollToBottom();
            stepNumber = "step3";
        },
        careerStep4 = function(){
            var filteredJobs = filterJobs(location, fullTime, jobType);

             $scope.chats.push({"messenger": "bot", "message": "Here are the top 3 career opportunities at Vanguard based on your preferences:"});

             for(var i = 0; i< 3; i++) {
                 $scope.chats.push({"messenger": "bot", "message": filteredJobs[i].Job_Title.__text, "url": "#careers"});
             }

             scrollToBottom();
        }

        botResponse = function(returnIntentObject, returnData){
            $scope.botChat = 'I have found '+ returnIntentObject.intent + ' information.';
            $scope.url = returnData;
            $scope.chats.push({"messenger": "bot", "message": $scope.botChat, "url": $scope.url});

            scrollToBottom();
         },

          botResponseAccount = function(returnIntentObject, returnData) {
             $scope.botChat = 'I have found your '+ returnIntentObject.intent + ' information.';
             $scope.url = returnData;
             $scope.chats.push({"messenger": "bot", "message": $scope.botChat});

             $scope.chats.push(
                {"messenger": "bot", "message": "Plan : Voyager Retirement Savings Plan"},
                {"messenger": "bot", "message": "Account number :9489494949"},
                {"messenger": "bot", "message": "Total balance :$62,754.94"},
                {"messenger": "bot", "message": "More info...", "url": $scope.url}
             );

             scrollToBottom();
          },

         scrollToBottom = function() {
            $timeout(function() {
                var scroller = document.getElementById('chatWindow');
                scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);
         }

        luisService.getIntent('Tell me about careers',intentService.determineIntent);

        getFundInfoService.getFunds($scope);
        getJobsInfoService.getJobs($scope);


        $scope.findFundByTicker =  function(fundTicker){
            return findFundService.findFundsByTicker($scope.funds,fundTicker);
        }

        $scope.testFunction = function (){
            var fund = $scope.findFundByTicker('VFINX');
        };

       var filterJobs = function(location, time, jobFamily) {

            var locationFilteredList = $filter('filter')($scope.ReportEntryData , location),
                fullTimeFilteredList = $filter('filter')(locationFilteredList , time),
                jobFamilyFilteredList = $filter('filter')(fullTimeFilteredList , jobFamily);
            return jobFamilyFilteredList;
      };

      $scope.testJobFilter = function() {

        var filteredJobList = filterJobs('Malvern', 'Service', 'Manager');
         console.log(filteredJobList)
      };


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

                    return callback(json);
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
                                case 'FundInformation':
                                    returnIntentObject.intent = 'FundInformation';
                                    break;
                                case 'News':
                                    returnIntentObject.intent = 'News';
                                    break;
                                default:
                                    returnIntentObject.intent = 'Home';
                                    break;
                            }
                    }

                    return returnIntentObject;
                }
            };

            return {"determineIntent":determineIntent};
    })


