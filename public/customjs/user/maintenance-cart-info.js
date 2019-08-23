
var app = angular.module('cartInfoApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('cartInfoController' , function($scope , $http){

    $scope.address = 'barela jabalpur' 
    $scope.contact  = 9144460897
    
    $scope.validate = function(){
        if(!$scope.address || $scope.contact || $scope.contact==null ){
            console.log('enter address and phone ');
            if(!$scope.address){
                $('input[name="address"]').addClass('is-invalid')
                $('input[name="address"]').removeClass('is-valid')
                return false;
            }else{
                $('input[name="address"]').addClass('is-valid')
                $('input[name="address"]').removeClass('is-invalid')
                
                if(!$scope.contact || $scope.contact == null){
                    $('input[name="contact"]').addClass('is-invalid')
                    $('input[name="contact"]').removeClass('is-valid')
                    return false;
                }else{
                    $('input[name="contact"]').addClass('is-valid')
                    $('input[name="contact"]').removeClass('is-invalid')
                    return true;
                }
            }

            
        }

    }
    $scope.confirmOrder = function(){
        if(!$scope.validate()){
            return ;
        }

        $http({
            url : '/user/maintenance/confirm-order' , 
            method : 'post' , 
            data : {
                address : $scope.address , 
                contact : $scope.contact
            }
        })
        .then(
            function(result){
                console.log(result);
                window.location = '/user/orders'
                
            } , 
            function(err){
                console.log(err);
                
            }
        )
    }
})