var app = angular.module('myApp', []);
app.controller('myCtrl',function($scope, $http){
    $http.get("jobs.json").then(function (response){
        $scope.myData = response.data.work;});
    $http.get("proj.json").then(function (response){
        $scope.myData2 = response.data.projects;});
});
