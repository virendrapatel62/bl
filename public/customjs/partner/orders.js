
// frountend java script file for partner orders page 

$(document).ready(function(){

    // data table setup 
    $('#ordertable').DataTable(
        {
            responsive: true
        }

    )
})

var app = angular.module('ordersApp', [] , function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('ordersController' , function($scope , $http){
    
    // confirms the order by the partner 
    $scope.ConfirmOrder = function(id , $event){

        $http({
            method : 'get', 
            url : '/partner/orders/maintenance-orders/approve/'+id
        }) .then(
            function(result){
                console.log(result);
                $($event.target).text('Order Confirmed')
            } , 
            function(error){
                console.log(error);
                if(error.status == 401){
                    partnerLogin();
                }else{
                    alert('server error')
                }
            }
        )      
    }
})