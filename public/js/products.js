
var app = angular.module('productApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
var scope = null;
var http = null;

app.controller('productController', function ($scope, $http) {


    $scope.init = function () {
        console.log('initFUnction...');
        scope = $scope;
        http = $http;
        loadProducts();

    }


})

function loadProducts() {
    console.log("load products");
    http({
        method: "GET",
        url: '/products/all-products'
    }).then(
        (result) => {
            console.log(result);
            scope.products = result.data
        },
        (error) => {
            console.log(error);
        }
    )

}