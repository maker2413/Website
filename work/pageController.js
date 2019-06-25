var app = angular.module('myApp', []);
app.controller('myCtrl',function($scope, $http){
    $http.get("jobs.php").then(function (response){
        $scope.myData = response.data.work;});
    $http.get("proj.php").then(function (response){
        $scope.myData2 = response.data.projects;});
});
