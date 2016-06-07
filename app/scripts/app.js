//angular.module('myApp', ['ui.bootstrap']);
var app = angular.module('hidrobook', ['ui.bootstrap', 'ngRoute', 'firebase']);

app.controller('adminapp', function($scope){
    $scope.book = {title:"null",author:"null", number:"null", date:"null", rating:"null", image:"null", cost:"null", type:""};
    $scope.contentBook = ["title", "author", "number", "date", "rating", "image", "cost", "type"];
    $scope.addBook = function(type){
          var refbook = new Firebase("https://hidrobook.firebaseio.com/").child('books').child(type).child('data').push().set({
                    "title":$scope.book['title'],
                    "author":$scope.book['author'],
                    "number":$scope.book['number'],
                    "date":$scope.book['date'],
                    "rating":$scope.book['rating'],
                    "image":$scope.book['image'],
                    "cost":$scope.book['cost']
          });
    }; 
    $scope.flag = {add:false, delete:false, update:false};
    $scope.turnflag = function(key){
        $scope.flag['add']=$scope.flag['delete']=$scope.flag['update']=false;
       $scope.flag[key]=true;
    };
});

app.controller('controlerapp', function($scope, $firebaseObject){
    var ref = new Firebase("https://hidrobook.firebaseio.com/");

    $scope.data = $firebaseObject(ref);
     $scope.data.$loaded()
                .then(function() {
             $scope.types=$scope.data.types;
            $scope.books = $scope.data.books;
     $scope.issearchbook=false;

              $scope.btnsearch=function(flag){
                        $scope.issearchbook=!flag;
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
                            var kfe = parseInt(arrdate[2])+parseInt(arrdate[1]);
                            if(knew==kfe){
                                booksnew.push(value);
                            }
                            else if (knew<kfe){
                                booksnew.length=0;
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
                       
         })
            .catch(function(err) {
              console.error(err);
            });


});

 app.controller('CarouselCtrl', function($scope, $firebaseObject) {
         var ref = new Firebase("https://hidrobook.firebaseio.com/");
         $scope.data = $firebaseObject(ref);

         $scope.data.$loaded()
                .then(function() {
                      $scope.myInterval = 4000;
                    // Initializing  slide rray  
                    $scope.slides = $scope.data.images;
                    console.log($scope.slides);
                });

           
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
