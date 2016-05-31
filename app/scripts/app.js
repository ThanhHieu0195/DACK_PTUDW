/**
 * Created by quang on 5/30/2016.
 */

var app = angular.module('hidrobook', ['ui.bootstrap']);
app.controller('CarouselCtrl', function($scope, $http) {
    $scope.myInterval = 3000;
    $scope.slides = [
        {
            image: 'http://lorempixel.com/900/300/animals'
        },
        {
            image: 'http://lorempixel.com/900/300/food'
        },
        {
            image: 'http://lorempixel.com/900/300/sports'
        },
        {
            image: 'http://lorempixel.com/900/300/people'
        }
    ];
});