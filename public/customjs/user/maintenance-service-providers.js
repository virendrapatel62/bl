var lat , lng ;

$(document).ready(function(){
    addressAutocomplete();
})



var app = angular.module('serviceProvidersApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('serviceProvidersController' , function($scope , $http){
    $scope.userInfo  = {};
    $scope.serviceProviders  = [];

    

    // create a map url using lat lng 
    $scope.openInMap = function(){
        console.log(';getlocation function');
        
        var lat = this.sp.partner.location.coordinates[1];
        var lng= this.sp.partner.location.coordinates[0];
        var url =  'https://www.google.com/maps/search/?api=1&query='+ lat + ',' + lng;
        window.open(url)
    }

    // book now 

    $scope.book = function(){
        console.log("book function");
        var serviceProvider  = this.sp;
        console.log(serviceProvider);
        $http({
            method : 'get' , 
            url : 'someurl'
        })
        .then(
            function(result){
                console.log(result);
                
            } , 
            function(err){
                console.log(err);
                
            }
        )
         
    }


    // sun s this function on intitialization of controller
    // fetch all service providers using service  , lat , lng 
    $scope.init = function(lat , lng , service){
        console.log({
            lat : lat , 
            lng : lng , 
            service : service
        });

        $scope.userInfo = {
            lat : lat , 
            lng : lng , 
            service : service
        };
        $scope.getData();
    }
    
    $scope.showModal = function(){
        $('#loadingModal').modal('show')
        $('#data').hide(500)
    }
    $scope.hideModal = function(){
        $('#loadingModal').modal('hide')
        $('#data').show(500)
    }
    // fetch all service provider data from server using lat , lng , and service 
    $scope.getData = function(){
        $scope.showModal();
        $http(
            {
                method : 'get',
                url : '/user/maintenance/get-service-providers/'
                            +$scope.userInfo.service+'/'
                            +$scope.userInfo.lat+'/'
                            +$scope.userInfo.lng
            }
        ).then(function(result){
            // console.log(result);
            console.log(result.data);
            $scope.serviceProviders = result.data;
            $scope.hideModal();
        } , function(err){
            console.log(err);
            $scope.hideModal();
        })
    }
    

    $scope.search = function(){

        if(!lat || !lng){
            console.log('Please select From sugections');
            return;
        }
        $scope.userInfo.lat = lat;
        $scope.userInfo.lng = lng;
        $scope.getData();
    }
    
})
function addressAutocomplete(){
    $("#address").autocomplete({
        source: function (request, response) {
            var text = $("#address").val();
            $.ajax({

                url: "/signup/getaddresses/"+text,
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (data) {
                    console.log(data.results);
                    var results = data.results 
                    for (i in results) {
                        results[i].value = results[i].formatted_address;
                    }
                    response(results);
                },
            });
        },
        minLength: 2,
        select: function (event, ui) {
            lat = ui.item.lat;
            lng = ui.item.lng;
            var address = ui.item.formatted_address;
        }
    });
}