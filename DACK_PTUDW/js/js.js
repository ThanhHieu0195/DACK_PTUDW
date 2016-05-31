//angular.module('myApp', ['ui.bootstrap']);
var app = angular.module('hidrobook', ['ui.bootstrap']);

app.controller('controlerapp', function($scope, $http){
	  $http.get('js/data.json')
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

      		$scope.filterbook = function(books, key, index){
      			console.log(index);
      			var book;
      			var booksnew=[];
      			switch(key){
      				case 'new':
	      				var knew = 0;
	      				// lọc các sách mới phát hành
	      				angular.forEach(books, function(value, key){
	      					// lấy mã kt
	      					var sdate = value.date;
	      					var arrdate=sdate.split('/');
	      					var kfe = parseInt(arrdate[2]+arrdate[1]);
	      					if(knew==kfe){
	      						booksnew.push(value);
	      					}
	      					else if (knew<kfe){
	      						booksnew=[];
	      						booksnew.push(value);
	      						knew=kfe;
	      					}

				  		 });
	      				break;
      				case 'max':
	      				var kmax = books[0].number;
	      				// lọc các sách mới phát hành
	      				angular.forEach(books, function(value, key){
	      					// lấy mã kt
	      					var keynumber = value.number;
	      					if(kmax==keynumber){
	      						booksnew.push(value);
	      					}
	      					else if (kmax>keynumber){
	      						booksnew=[];
	      						booksnew.push(value);
	      						kmax=keynumber;
	      					}

				  		 });
	      				break;
	      				console.log(booksnew);
	      			default:
	      				booksnew=books;
      				

      			}
  				// lấy sach
      	// 		var d = new Date();
   				// var n = d.getMilliseconds()%(booksnew.length);
      			book = booksnew[index];
      			return book;
      		};        

        });

      
});

 app.controller('CarouselCtrl', function($scope, $http) {
 			$http.get('js/data.json')
		        .success(function(data) {
		        	 $scope.myInterval = 4000;
			 		// Initializing  slide rray  
					$scope.slides = data.images;

			  var slides = $scope.slides;
			  // console.log(slides);
				})
			// initializing the time Interval
			
		});
// Controller  for Carousel
 // Controller Ends here