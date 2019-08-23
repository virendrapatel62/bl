var app = angular.module('partners', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
var host = 'http://localhost:3000';


$(document).ready(function(){
    $.fn.dataTable.ext.errMode = 'none';
    
})

app.controller('partnersController' , function($scope , $http){
    console.log(host);
    
    $scope.hi = 'hello angular'
    $scope.partners = [];

    
    $http(
        {
            method : 'get' , 
            url : '/api/partner'
        }
    )
    .then(
        function(result){
            $scope.partners = result.data;
            setTimeout(function(){
                $('#datatable').DataTable(
                  
                );
            },500)
        } , 
        function(err){
            console.log(err);
            
        }
    )
})
