
$(document).ready(function(){

    $('#ordertable').DataTable();


    $('#orderDetailModal').on('hide.bs.modal' , function(e){
        $('#cancleOrderreasonBox').attr('hidden' , 'hidden');
        $('#cancleOrderreasonBox').attr('hidden' , 'hidden');
        $('#cancelOrder').show();
    })
    $('#orderDetailModal').on('shown.bs.modal' , function(e){
        $('#cancleOrderreasonBox').attr('hidden' , 'hidden');
        $('#cancleOrderreasonBox').attr('hidden' , 'hidden');
        $('#cancelOrder').show();
    })
})


var app = angular.module('ordersApp', [] , function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});



app.controller('ordersController', function ($scope, $http) {
    // order variable fro modal data
    $scope.order = {};
    $scope.cancel_reasion


    $scope.showCancelBox = function ($event) {
        $($event.target).hide(200);
        $('#cancleOrderreasonBox').removeAttr('hidden');
        $('#cancleOrderreasonBox').hide();
        $('#cancleOrderreasonBox').show(500);
    }

    $scope.cancleOrder = function () {
        console.log($scope.cancel_reason);
        if (!$scope.cancel_reason) {
            $('textarea[name="cancel_reason"]').addClass('is-invalid')
            $('textarea[name="cancel_reason"]').removeClass('is-valid')
            return;
        }
        $('textarea[name="cancel_reason"]').addClass('is-valid')
        $('textarea[name="cancel_reason"]').removeClass('is-invalid')

        $http({
            method : 'post' , 
            url : '/user/orders/maintenance-orders/cancel/' + $scope.order._id , 
            data : {
                reason : $scope.cancel_reason
            }
        }).then(
            function(result){
                console.log(result.data);
                location.reload();
                
            }, 
            function(error){
                console.log(error);
                if(error.status == 401 ){
                    login();
                }
                
            } 
        )

    }
    // mark an order to compleated
    $scope.markCompleted = function () {
        var id = $scope.order._id;
        $http({
            method: 'get',
            url: '/user/orders/maintenance-orders/mark-completed/' + id,
        })
            .then(
                function (result) {
                    console.log(result);
                    $scope.hideModal()
                    location.reload()

                },
                function (error) {
                    console.log(error);
                    if (error.status == 401) {
                        // this in header.js show the login modal
                        login();
                    }

                }
            )

    }

    // show loading on button
    $scope.showLoading = function ($event) {
        $($event.target).parent().find('span').removeAttr('hidden')
    }

    // Hide loading on button
    $scope.hideLoading = function ($event) {
        $($event.target).parent().find('span').attr('hidden', 'hidden')
    }

    // Show modal when order informations recievd from server
    $scope.showModal = function ($event) {
        $('#orderDetailModal').modal('show')
    }

    $scope.hideModal = function ($event) {
        $('#orderDetailModal').modal('hide')
    }

    // /get the order information on getDetail button click 
    // then show the modal with information 
    $scope.showOrderDetails = function (orderid, $event) {

        $scope.showLoading($event)
        $http({
            url: '/user/orders/maintenance-orders/order-info/' + orderid,
            method: 'get',
        })
            .then(
                function (result) {
                    // console.log('result Recieved ' , result.data);
                    // $('#orderDetailModal').modal('show')
                    // console.log('resut : ' , result.data);
                    $scope.order = result.data;
                    $scope.hideLoading($event)
                    $scope.showModal();

                },
                function (error) {
                    console.log('Error', error);
                    if (error.status == 401) {
                        // this in header.js show the login modal
                        login();
                    }
                    $scope.hideLoading($event)
                }
            )

    }
})