
$(document).ready(function(){
})
var inter
function startAnimation(){
    var i = 1;
    inter = setInterval(function(){
        $('.progress-bar').css('width' , i+'%')
        i = i+25;

        if(i > 100){
            i = 0;
        }
        // console.log($('.progress-bar').css('width'));
         
    } , 500);

    
}

function clearAnimation(){
    clearInterval(inter)
}


var app = angular.module('servicesApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function inti(id){
console.log(id);

}

app.controller('servicesController' , function($scope , $http){
    // console.log($scope.maintenaceServiceId);
    $scope.services = [];
    
    // variable for cart 
    $scope.cart = new Object();
    $scope.cart.cartItems = new Object();
    $scope.cart.totalItem = 0;
    $scope.cart.totalServiceCharge = 0;

    // variable for lat lng
    $scope.lat = 0;
    $scope.lng = 0;

    //info
    $scope.subservice = null;




    
    // total cart itesmsand total cart prize calculation
    $scope.clcTotalCartItem = function(){
        var total = 0;
        var totalServiceCharge = 0;

        var cartItems = $scope.cart.cartItems;
       
        for(var i in cartItems){
            var cartitem = cartItems[i] 
            total  = cartitem.count + total;
            // console.log(cartitem.serviceCharge);
            // console.log(cartitem.count);
            // console.log(totalServiceCharge);
            
            totalServiceCharge  = cartitem.serviceCharge * cartitem.count  + totalServiceCharge;
        }

        $scope.cart.totalItem = total
        $scope.cart.totalServiceCharge = totalServiceCharge
        // console.log($scope.cart);s
        
    }
    // add to cart
    $scope.addToCart = function(data){
        data  = data[0][0]
        data.count++;
        $scope.cart.cartItems[data._id] = {};
        $scope.cart.cartItems[data._id].count = data.count;
        $scope.cart.cartItems[data._id].serviceCharge  = data.serviceCharge;
        $scope.clcTotalCartItem();
    }

    // remove from cart
    $scope.removeFromCart = function(data){
        data  = data[0][0]
        data.count--; 
        $scope.cart.cartItems[data._id] = {};
        $scope.cart.cartItems[data._id].count = data.count;
        $scope.cart.cartItems[data._id].serviceCharge  = data.serviceCharge;
        if(data.count <= 0){
            delete $scope.cart.cartItems[data._id];
            data.count = 0;
            $scope.clcTotalCartItem();
            return ;
        }
        $scope.clcTotalCartItem();
    }

    // onload loads the services from the server
    $scope.onloadFun = function(id){
        $scope.subservice = id;
        startAnimation();
        $('.service_container').hide(500)
        $http({
            method :'get' , 
            url : '/user/maintenance/getsubservices/'+id
        }).then(function(result){
            console.log(result.data);
            
            $scope.services = result.data;
            
            $('.service_container').show(500)
            clearAnimation();
        } , function(err){
            console.log(err);
            
        })
    }
     



    // loads all services 
    $scope.loadServices = function(id){
        startAnimation();
        $('.service_container').fadeOut(500)
        $http({
            method :'get' , 
            url : '/user/maintenance/getsubservices/'+id
        }).then(function(result){
            console.log(result.data);
            $scope.services = result.data;
            for(var i in $scope.services){
                var s = $scope.services[i];
                
                s.count  = ($scope.cart.cartItems[s._id]) ? $scope.cart.cartItems[s._id].count : 0
            }
            $('.service_container').fadeIn(500)
            clearAnimation();0
        } , function(err){
            console.log(err);
            
        })
    }

    // shows location select modal
    $scope.isEmpty = function(object){
        for(i in object){
            return false;
        }
        return true;
    }

    $scope.getLocationModel = function(){
        console.log('heloo');
        // send cart to service $scop
        
        // cheak if cart is empty show message
        if($scope.isEmpty($scope.cart) || $scope.isEmpty($scope.cart.cartItems) ){
            showMessage('error' , 'Empty Cart' , 'Please Add Some Services To CheakOut')
            return ;
        }

        // send data to server cart data 

        $http({
            url : "/user/maintenance/save-cart", 
            method : 'post',
            data : $scope.cart

        })
        .then(
            function(result){
                // console.log(result.data.user);
                console.log(result.data.user.maintenanceCart);
                $('#locationModal').modal('show')
            } , 
            function(err){
                showMessage('error' , 'Server Error' , 'Please Try Again Later , or cheak You are logged in not !!')
                console.log(err);
            }
        )
       
    }


    //on next putton click show the serviceproder page acording to location
    $scope.showServiceProviders = function(){
        console.log("show service provider...");


        if(!$scope.lat || $scope.lat == 0 || !$scope.lng || $scope.lng== 0 ){
            alert('select Location from the Suggetions...')
            return ;
        }

        window.location = '/user/maintenance/service-providers/'+$scope.subservice+"/"+$scope.lat+"/"+$scope.lng

        

    }

    // location autocomplete setup
    $("#location").autocomplete({

        source: function(request, response) {
            var text = $("#location").val(); 
            $.ajax({
                url: "/signup/getaddresses/" + text,
                success: function(data) {
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
        select: function(event, ui) {
            $scope.lat = ui.item.lat;
            $scope.lng = ui.item.lng;
            var address = ui.item.formatted_address;
        } , 
        classes: {
            "ui-autocomplete": "autoComplete",
        }
    })
})


function showMessage(type , title  , message){
    $('#'+type).find('#title').text(title);
    $('#'+type).find('#message').text(message);
    $('#'+type).modal('show')
}