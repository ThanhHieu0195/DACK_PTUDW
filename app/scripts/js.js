//angular.module('myApp', ['ui.bootstrap']);
var app = angular.module('hidrobook', ['ui.bootstrap']);

/*app.controller('controlerapp', function($scope, $http){
	  $http.get('database/data.json')
        .success(function(data) {
            $scope.types=data.types;
            $scope.books = data.books;

             $scope.filterBookbyType = function(type){
             	var books =[];
             	angular.forEach($scope.books, function(value, key){
				      if(value.type == type)
				      	books.push(value);
			   });
      			return books;
      		};
        });

      
});*/

 app.controller('CarouselCtrl', function($scope, $http) {
 			/*$http.get('../database/data.json')
		        .success(function(data) {

			 		// Initializing  slide rray  
					$scope.slides = data.images;

			  var slides = $scope.slides;
			  // console.log(slides);
				})
			// initializing the time Interval
			*/
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
// Controller  for Carousel
 // Controller Ends here