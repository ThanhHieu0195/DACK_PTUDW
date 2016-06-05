//angular.module('myApp', ['ui.bootstrap']);
var app = angular.module('hidrobook', ['ui.bootstrap', 'ngRoute']);

app.controller('controlerapp', function($scope, $http){
    $http.get('database/data.json')
        .success(function(data) {
            $scope.types=data.types;
            $scope.books = data.books;
            $scope.issearchbook=false;
            $scope.btnsearch=function(){
                $scope.issearchbook=!$scope.issearchbook;
            }
            // lọc ra danh sách sách dựa vào loaij
            $scope.filterBookbyType = function(books, type){
                return books[type].data;
            };
            // lọc tất cả các sách
            $scope.filterallBook = function(books){
                var listbooks=[];
                angular.forEach(books, function(value, key){
                    listbooks.push.apply(listbooks, value.data);
                    if(value.next!=null){
                        listbooks.push.apply(listbooks, $scope.filterallBook(value.next));
                    }
                });
                return listbooks;
            };


            // lọc danh sách các theo điều kiện
            $scope.filterBookquery = function(listbooks, key){
                var booksnew=[];
                switch(key){
                    case 'new':
                        var knew = 0;
                        // lọc các sách mới phát hành
                        angular.forEach(listbooks, function(value, key){
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
                        var kmax = listbooks[0].number;
                        // lọc các sách mới phát hành
                        angular.forEach(listbooks, function(value, key){
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
                    default:
                        booksnew=listbooks;


                }

                return booksnew;
            };

        });


});

app.controller('CarouselCtrl', function($scope, $http) {
    $http.get('database/data.json')
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


app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/home", {
        templateUrl: "views/home.html", //accessing a certain html page that was created within views
    }).when("/book-detail", {
        // the rest is the same for ui-router and ngRoute...
        templateUrl: "views/book-detail.html",
    }).when("/admin", {
        templateUrl: "views/admin.html",
    }).when("/checkout/cart", {
        templateUrl: "views/checkout-cart.html",
    }).otherwise({
        redirectTo: '/home'
    });
}]);
