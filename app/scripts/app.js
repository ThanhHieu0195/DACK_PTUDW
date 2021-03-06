//angular.module('myApp', ['ui.bootstrap']);
var app = angular.module('hidrobook', ['ui.bootstrap', 'ngRoute', 'firebase', 'ngAnimate']);

app.factory('bookService', ['$firebaseObject', function ($firebaseArray) {
    return {
        initData: function () {
            var ref = new Firebase("https://hidrobook.firebaseio.com/")
            data = $firebaseArray(ref);
            return data;
        },
        getAllBook: function(data) {
            var genres = data.types;
            var books=[];
            for(var i = 0; i < genres.length; i++){
                var num;
                try{
                    num = data.books[genres[i].key].data.length
                }catch(Ex){
                    num = 0;
                }
                for(var j = 0; j < num; j++){
                    books.push(data.books[data.types[i].key].data[j]);
                }
            }
            return books;
        },
        getBookByID: function (books, id) {
            for(var i = 0; i < books.length; i++){
                if(books[i].id == id)
                    return books[i];
            }
        }
    };
}]);

app.factory("authService", ["$firebaseAuth", function($firebaseAuth) {
    var ref = new Firebase("https://hidrobook.firebaseio.com/");
    return $firebaseAuth(ref);
}
]);


app.controller('b-detailController', function ($scope, bookService,$routeParams) {
    var bookId = $routeParams.id;
    $scope.data = bookService.initData();

    $scope.data.$loaded(function () {

        var books = bookService.getAllBook($scope.data);
        $scope.book = bookService.getBookByID(books, bookId);

        if($scope.book.number > 0) {
            $scope.stt = "Còn hàng";
            $scope.status = "url('images/tick.png')";
        }
        else {
            $scope.stt = "Hết hàng";
            $scope.status = "url('images/publish_x.png')";
        }
    });
});

app.controller('adminapp', function($scope, $firebaseArray, $firebaseObject){


    $scope.book = {title:"no title",author:"no author", number:"0", date:"dd/mm/yyyy", rating:"*****", image:"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcShuo1fvLCCgDrs2ghsuZC0Cz_Q0lRkyfNR3Uo6TB7-5eKNgZymLg", cost:"0$", type:"KT"};

    // $scope.defaultBook = {title:"null",author:"null", number:"null", date:"null", rating:"null", image:"null", cost:"null", type:""};

    $scope.contentBook = ["title", "author", "number", "date", "rating", "image", "cost", "type"];


    $scope.refbook = new Firebase("https://hidrobook.firebaseio.com/").child('books').child($scope.book.type).child('data');
    $scope.datas = $firebaseArray($scope.refbook);



    $scope.addBook = function(){
        console.log($scope.book.type);
        $scope.refbook = new Firebase("https://hidrobook.firebaseio.com/").child('books').child($scope.book.type).child('data');
        $scope.datas = $firebaseArray($scope.refbook);
         $scope.datas.$loaded()
        .then(function(){
           var x={};
            x.title = $scope.book.title;
            x.author = $scope.book.author;
            x.cost = $scope.book.cost;
            x.date = $scope.book.date;
            x.image = $scope.book.image;
            x.number = $scope.book.number;
            x.rating = $scope.book.rating;

           $scope.refbook.push(x);
           $scope.allbook.push(x);
         });
      };
      
    $scope.deleteBook = function(filterbook, key){
        $scope.refbook = new Firebase("https://hidrobook.firebaseio.com/").child('books').child($scope.book.type).child('data');
        $scope.datas = $firebaseArray($scope.refbook);
       
       $scope.datas.$loaded()
        .then(function(){
            angular.forEach($scope.datas, function(data, key) {
                if(data.title==filterbook.title){
                    $scope.datas.$remove(key);
                    console.log($scope.allbook);
                }
            })
             angular.forEach($scope.allbook, function(data, key) {
                if(data.title==filterbook.title){
                    $scope.allbook.splice(key, 1);
                }
            })
         });
     };

     $scope.updateBook = function(book){
        $scope.refbook = new Firebase("https://hidrobook.firebaseio.com/").child('books').child($scope.book.type).child('data');
        $scope.datas = $firebaseArray($scope.refbook);
        $scope.datas.$loaded()
        .then(function(){
             angular.forEach($scope.contentBook, function(type, key){
                $scope.datas[$scope.indexBookinType][type]=book[type];
             })
            
            $scope.datas.$save($scope.indexBookinType).then(function(ref) {
              ref.key() === $scope.datas[$scope.indexBookinType].$id; // true
            });
         });
     };
     $scope.indexBookinType=0;

     $scope.changeContentbook=function(filterbook){
        $scope.book = filterbook;
         $scope.datas.$loaded()
        .then(function(){
            angular.forEach($scope.datas, function(data, key) {
                if(data.title==filterbook.title){
                    $scope.indexBookinType=key;
                }
            })
         });
         

     };

    $scope.flag = {add:false, delete:false, update:true};
    $scope.firtload = 0;
    $scope.turnflag = function(key, books){
        if($scope.firtload==0)
             $scope.allbook = books;
         $scope.firtload+=1;
        // $scope.book = $scope.defaultBook;
        $scope.flag['add']=$scope.flag['delete']=$scope.flag['update']=false;
       $scope.flag[key]=true;
    };


});


app.controller('controlerapp', function($scope, $firebaseObject, authService){
    var ref = new Firebase("https://hidrobook.firebaseio.com/");
    var curUser = authService.$getAuth();
    $scope.curUser = new Object();

    if(curUser != null){
        if(curUser.password != null){
            $scope.curUser.name = curUser.password.email;
            $scope.curUser.image = curUser.password.profileImageURL;
        }else if(curUser.facebook != null){
            $scope.curUser.name = curUser.facebook.displayName;
            $scope.curUser.image = curUser.facebook.profileImageURL;
        }else if(curUser.google != null){
            $scope.curUser.name = curUser.google.displayName;
            $scope.curUser.image = curUser.google.profileImageURL;
        }else if(curUser.github != null){
            $scope.curUser.name = curUser.github.displayName;
            $scope.curUser.image = curUser.github.profileImageURL;
        }
    }else{
        $scope.curUser = curUser;
    }



    var book = new Object();
    book.id = '1';
    book.number = '2';

    $scope.logout = function () {
        authService.$unauth();
        location.reload();
    };

    $scope.maxitem = 8;
    //book cart //
    $scope.cart = [];

    $scope.flagsectionhome={banner:true,search:false, allbook:false,common:true, new:true, KT:true, VH:true, NN:true};
    // 'banner','search','common','new','KT','VH','NN'
    $scope.changeflaghome=function(varflag, notvarflag){
        angular.forEach(varflag, function(value, key){
            $scope.flagsectionhome[value]=true;
        });
         angular.forEach(notvarflag, function(value, key){
            $scope.flagsectionhome[value]=false;
        });
        $scope.maxitem = 8;
    }
    $scope.opentag=function(key){
         $scope.changeflaghome([''],['banner','search','common','new','KT','VH','NN','allbook']);
         $scope.changeflaghome([key],['']);
         // $scope.maxitem = $scope.filterallBook($scope.books).length;
         $scope.maxitem = 40;
    }
    $scope.addBook2Cart = function (book) {
        var check = true; //book not exists
        for(var i = 0; i < $scope.cart.length; i++){
            if($scope.cart[i].id == book.id) {
                check = false;
                $scope.cart[i].number++;
                break;
            }
        }
        if(check){
            var item = new Object();
            item.title = book.title;
            item.author = book.author;
            item.image = book.image;
            item.cost = parseFloat(book.cost) * 1000;
            item.number = 1;
            item.id = book.id;
            $scope.cart.push(item);
        }
    };

    $scope.deleteBookCart = function (index){
        $scope.cart.splice(index, 1);
    };

    $scope.total = function () {
        var total = 0;
        for(var i = 0; i < $scope.cart.length; i++){
            total += $scope.cart[i].cost *  $scope.cart[i].number;
        }
        return total;
    };
    $scope.order = new Object();

    $scope.Paypal = function () {

        $scope.order.total = $scope.total();

        if($scope.order.total == 0) {
            window.alert("Giỏ hàng của bạn hiện đang trống");
            return;
        }

        $scope.order.value = [];
        for(var i = 0; i < $scope.cart.length; i++) {
            var b = new Object();
            b.id = $scope.cart[i].id;
            b.title = $scope.cart[i].title;
            b.number = $scope.cart[i].number;
            $scope.order.value.push(b);
        }

        console.log($scope.order);
        var ref = new Firebase("https://hidrobook.firebaseio.com/").child('orders');
        var curOrder = ref.push();
        curOrder.set($scope.order);
        window.alert("Bạn đã đặt hàng thành công!");
    };


    //end book cart

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

                angular.forEach($scope.types, function(type, key){
                     angular.forEach(books[type.key].data, function(book, key){
                        listbooks.push(book);

                     });
                    // if(value.next!=null){
                    //     listbooks.push.apply(listbooks, $scope.filterallBook(value.next));
                    // }
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

    $scope.normalizeString = function(str)
    {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"");
        /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
        //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
        str = str.replace(/^\-+|\-+$/g, "");
        str = str.split(' ').join('-');
        //cắt bỏ ký tự - ở đầu và cuối chuỗi
        str = str.toLowerCase();
        return str;
    };

});

 app.controller('CarouselCtrl', function($scope, $firebaseObject) {
         var ref = new Firebase("https://hidrobook.firebaseio.com/");
         $scope.data = $firebaseObject(ref);

         $scope.data.$loaded()
                .then(function() {
                      $scope.myInterval = 4000;
                    // Initializing  slide rray  
                    $scope.slides = $scope.data.images;
                    //console.log($scope.slides);
                });

           
            // initializing the time Interval
            
        });
// Controller  for Carousel
// Controller Ends here


app.controller('loginController', function ($scope, authService) {
    $scope.user = new Object();

    //login with email and password
    $scope.loginWithPassword = function (user) {
        authService.$authWithPassword({
            email: user.email,
            password: user.pass
        }).then(function () {
            //Success callback
            $scope.notif = "";
            console.log('Login successful');
            location.reload();
        }, function (error) {
            //Failure callback
            switch(error.code){
                case "INVALID_EMAIL":
                    $scope.notif = "The specified user account email is invalid.";
                    break;
                case "INVALID_PASSWORD":
                    $scope.notif = "The specified user account password is incorrect";
                    break;
                case "INVALID_USER":
                    $scope.notif = "The specified user account does not exist.";
                    break;
                default:
                    $scope.notif = "Error logging user in:" + error;
            }
            console.log('Login failure');
        });
        $scope.auth = authService;
        $scope.user = $scope.auth.$getAuth();
    };

    //create account
    $scope.createAccount = function (user) {
        authService.$createUser({
            email: user.email,
            password: user.pass
        }).then(function () {
            //Success callback
            $scope.notif = "Create user successful!";

            console.log('Create user successful');
            //location.reload();
        }, function (error) {
            //Failure callback
            $scope.notif = "Error create user in:" + error;
            console.log('Create user failure');
        });
    };

    //reset password
    $scope.resetPassword = function (user) {
        authService.$resetPassword({
            email: user.email
        }).then(function () {
            $scope.notif = "Email changed successfully";
            console.log("Email changed successfully");
        }, function (error) {
            $scope.notif = "Error changing email: " + error;
            console.log("Error changing email:", error);
        });
    };

    $scope.loginWithFacebook = function () {
        authService.$authWithOAuthPopup("facebook",  function() {
        }).then(function (authData) {
            $scope.notif = "Login successfully";
            console.log("Login successfully", authData);
            location.reload();
        }, function (error) {
            $scope.notif = "Error login with facebook: " + error;
            console.log("Error login with facebook:", error);
        });
    };

    $scope.loginWithGoogle = function () {
        authService.$authWithOAuthPopup("google", function () {
        }).then(function (authData) {
            $scope.notif = "Login successfully";
            console.log("Login successfully", authData);
            location.reload();
        }, function (error) {
            $scope.notif = "Error login with google: " + error;
            console.log("Error login with google:", error);
        });
    };

    $scope.loginWithGithub = function () {
        authService.$authWithOAuthPopup("github",function () {
        }).then(function (authData) {
            $scope.notif = "Login successfully";
            console.log("Login successfully", authData);
            location.reload();
        }, function (error) {
            $scope.notif = "Error login with github: " + error;
            console.log("Error login with github:", error);
        });
    };


    if(authService.$getAuth() != null) {
        console.log(authService.$getAuth());
        top.location = '/DACK_PTUDW/app/index.html#/home';
    }
});

app.controller('detailController', function ($scope, bookService,$routeParams) {
    var bookId = $routeParams.id;
    $scope.data = bookService.initData();

    $scope.data.$loaded(function () {

        var books = bookService.getAllBook($scope.data);
        $scope.book = bookService.getBookByID(books, bookId);

        if($scope.book.number > 0) {
            $scope.stt = "Còn hàng";
            $scope.status = "url('images/tick.png')";
        }
        else {
            $scope.stt = "Hết hàng";
            $scope.status = "url('images/publish_x.png')";
        }
    });
});


app.controller('cartController', function ($scope, authService) {
    if(authService.$getAuth() == null)
        top.location = '/DACK_PTUDW/app/index.html#/login';
});

app.controller('adminController', function ($scope, authService) {
    if(authService.$getAuth() == null || (authService.$getAuth() != null && authService.$getAuth().password.email !=  'qhuy94@gmail.com')){
        top.location = '/DACK_PTUDW/app/index.html#/home';
    }
});

app.config(["$routeProvider", "$locationProvider", function($routeProvider) {
    $routeProvider.when("/home", {
        templateUrl: "views/home.html", //accessing a certain html page that was created within views
    }).when("/book-detail/:id/:title", {
        // the rest is the same for ui-router and ngRoute...
        templateUrl: "views/book-detail.html",
        controller: 'detailController'
    }).when("/admin", {
        templateUrl: "views/admin.html",
        controller: 'adminController'
    }).when("/checkout/cart", {
        templateUrl: "views/checkout-cart.html",
        controller: 'cartController'
    }).when("/login",{
        templateUrl: "views/login.html",
        controller: 'loginController'
    }).otherwise({
        redirectTo: '/home',
    });
}]);