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

    .factory('getJobsInfoService', ['$http', function($http){

            return {
                'getJobs':function(scope,callback){
                  var url = '../vanguard_jobs.json',
                  config = {
                      method: 'GET'
                  };
                  $http.get(url,config).success(function(data){

                      if(data)
                      {
                        scope.ReportEntryData = data.Report_Data.Report_Entry;
                      }

                  });

                }
            }
    }]).factory('getFundInfoService',['$http',function($http){
        return{
            'getFunds':function(scope,callback){
              var url = 'https://sandbox.apisvanguard.com/frapie/us/1.0/fund/',
              config = {
                  headers:{'Authorization':'Bearer d0bcb1308147ba5bbe7d37ae0daf8a64'},
                  method: 'GET'
              };

              $http.get(url, config).success(function(data){

                   var json = JSON.parse(data);

                  if(data.fund)
                  {
                    scope.funds = data.fund;
                  }
                  if(callback)
                  {
                    callback(scope.funds);
                  }
              }).error(function(){
                $http.get('funds.json').success(function(data){

                    scope.funds = data;
                });

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
                  if(currentTicker && ticker.toUpperCase() === currentTicker.toUpperCase())
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

