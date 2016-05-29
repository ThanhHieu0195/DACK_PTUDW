//angular.module('myApp', ['ui.bootstrap']);
var app = angular.module('hidrobook', ['ui.bootstrap']);

app.controller('controlerapp', function($scope, $http){
	  $http.get('js/data.json')
        .success(function(data) {
            $scope.a=data.name;
        })
      
});

 app.controller('CarouselCtrl', function($scope, $http) {
 			$http.get('js/data.json')
		        .success(function(data) {
		        	 $scope.myInterval = 4000;
			 		// Initializing  slide rray  
					$scope.slides = data.images;

			  var slides = $scope.slides;
			  console.log(slides);
				})
			// initializing the time Interval
			
		});
// Controller  for Carousel
 // Controller Ends here