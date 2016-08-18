angular.module('apiFactories',['ngResource'])

    .factory('newsRecentStories',['$resource', function($resource){
                  return $resource('http://rss.vanguard.com/rss/recentstories.xml');
    }])

    .factory('newsPersonalfinance',['$resource', function($resource){
                  return $resource('http://rss.vanguard.com/rss/personalfinance.xml');
    }])

    .factory('newsEconWeek',['$resource', function($resource){
                  return $resource('http://rss.vanguard.com/rss/econweek.xml');
    }])

    .factory('jobs',['$resource', function($resource){
                  return $resource('../vanguard_jobs.json');
    }]).factory('getFundInfoService',['$http',function($http){
        return{

            'getFunds':function(scope,callback){
              var url = 'https://sandbox.apisvanguard.com/frapie/us/1.0/fund/',
              config = {
                  headers:{'Authorization':'Bearer d0bcb1308147ba5bbe7d37ae0daf8a64'},
                  method: 'GET'
              };

              $http.get(url,config).success(function(data){

                  if(data.fund)
                  {
                    scope.funds = data.fund;
                  }
                  if(callback)
                  {
                    callback(scope.funds);
                  }
              });

            }
        };
}])
.factory('findFundService',function(){

    return{

      'findFundsByTicker':function(fundList,ticker){
          var i,currentTicker,returnFund = {};
          if(fundList.length>0 && ticker)
          {
              for(i = 0;i<fundList.length;i++){
                currentTicker = fundList[i].profile.ticker;
                  if(currentTicker && ticker === currentTicker)
                  {
                      returnFund.ticker = currentTicker;
                      returnFund.price = fundList[i].priceInfo.price.amt;
                      returnFund.name = fundList[i].profile.longNm;
                      return returnFund;
                  }
              }
          }
      },
      'findFundsById':function(fundList,id){

      }
    };
});







//call luis factory
// logic to handle intents of luis
// based off that logic call one of my factories
//
