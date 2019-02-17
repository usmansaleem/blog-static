// script.js

// create the module and name it blogApp
var blogApp = angular.module('blogApp', ['ngRoute','ngSanitize']);

//ng-routes
blogApp.config(['$routeProvider',function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainCtrl'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutCtrl'
            })

            .otherwise({
                           redirectTo: '/'
                        });

    }]);


// create the controller and inject Angular's $scope
blogApp.controller('mainCtrl', ['$scope', '$http', '$log', '$sce',function($scope, $http, $log, $sce) {
    $scope.trustBlogHtml = function(html) {
              return $sce.trustAsHtml(html);
            };

    //when page changes, fetch new data
    $scope.pageChanged = function(num) {
        if(num >= 1 && num <= $scope.lastPage) {
            $scope.bigCurrentPage = num;
            $http.get('rest/blog/blogItems/' + $scope.bigCurrentPage).then(function(response) {
                $scope.blogItems = response.data;
                window.scrollTo(0,0);
            });
        }
      };

    //function to get updated blog count, specially when section changes
    $scope.getBlogMeta =  function() {
      $http.get('rest/blog/blogMeta').then(function(response) {
        $scope.blogMeta =  response.data;
        $scope.lastPage = $scope.blogMeta.pageCount;
        $scope.pageChanged(1);
      });
    };

    //function to show jumbotron
    $scope.showJumbotron = function() {
        return $scope.bigCurrentPage === 1
    };

    $scope.pageClass = 'page-home';
    $scope.bigCurrentPage = 1;
    $scope.lastPage = 1;

    //call method chain ...
    $scope.getBlogMeta();
    
}]);

// create the controller and inject Angular's $scope
blogApp.controller('aboutCtrl', ['$scope',function($scope) {
    $scope.pageClass = 'page-about';
}]);
