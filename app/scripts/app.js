/**
 * Created by quang on 5/30/2016.
 */

var app = angular.module('hidrobook', ['ui.bootstrap']);
app.controller('CarouselCtrl', function($scope, $http) {
    $scope.myInterval = 3000;
    $scope.slides = [
        {
            image: 'http://lorempixel.com/400/200/'
        },
        {
            image: 'http://lorempixel.com/400/200/food'
        },
        {
            image: 'http://lorempixel.com/400/200/sports'
        },
        {
            image: 'http://lorempixel.com/400/200/people'
        }
    ];
});