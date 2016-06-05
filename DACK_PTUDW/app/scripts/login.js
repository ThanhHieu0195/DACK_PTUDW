// Create a new app with the AngularFire module
var app = angular.module("app", ["firebase"]);

// Re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", function($firebaseAuth) {
  var ref = new Firebase("https://logindemolp.firebaseio.com");
  return $firebaseAuth(ref);
});

app.controller("AuthCtrl", function($scope, $http, Auth) {
  // Listens for changes in authentication state
  Auth.$onAuth(function(authData) {
    $scope.authData = authData;

    if (authData) {
      getRepos();
    }
  });

  // Logs in a user with GitHub
  $scope.loginF = function() {
    Auth.$authWithOAuthPopup("facebook").catch(function(error) {
      console.error("Error authenticating with facebook:", error);
    });
  };
  $scope.loginG = function() {
    Auth.$authWithOAuthPopup("google").catch(function(error) {
      console.error("Error authenticating with google:", error);
    });
  };
  $scope.loginH = function() {
    Auth.$authWithOAuthPopup("github").catch(function(error) {
      console.error("Error authenticating with GitHub:", error);
    });
  };

  // Logs out the logged-in user
  $scope.logout = function() {
    Auth.$unauth();
  };

  // Retrieves the GitHub repos owned by the logged-in user
});
