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
                  return $resource('/vanguard_jobs.xml');
    }]);






//call luis factory
// logic to handle intents of luis
// based off that logic call one of my factories
//
