var app = angular.module('app', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});


// save constructoin material
app.controller('Controller', function ($scope, $http) {
    console.log('COntroller...');

    $scope.saveProduct = function (e) {
        e.preventDefault();
        var form = document.getElementById('productForm');
        console.log(new FormData(form));
        var data = new FormData(form);

        $.ajax({
            url: '/admin/dashboard/construction-material/save-product',
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                console.log(result);
            },
            error: function (error) {
                alert('Server Error')
                console.log(error);
            }
        }).done(function (data) {
            form.reset();
        });

    }

    // load all products for shoing on model
    $scope.loadAllProducts = function () {
        var getAllUrl = '/admin/dashboard/construction-material/getAll'
        $scope.showHideLoadingOfProductModel(true)
        $http(
            {
                method: "GET",
                url: getAllUrl
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.allProducts = res.data;
                $scope.showHideLoadingOfProductModel(false)
            }
        )
    }

    $scope.showHideLoadingOfProductModel = function (flag) {
        if (flag) {
            // show loading
            $('.product-loading').removeAttr('hidden')
            $('.all-products-modal').modal('hide')
        } else {
            $('.product-loading').attr('hidden', 'hidden')
            $('.all-products-modal').modal('show')
            // hide loading
        }
    }
});


// productSizeApp ======================================================================

var productSizeApp = angular.module('productSizeApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
productSizeApp.controller('productSizeController', function ($scope, $http) {

    // console.log($scope);
    // console.log($http);

    var getProductsUrl = '/admin/dashboard/construction-material/get-products-by-category';
    var getBrandsUrl = '/admin/dashboard/construction-material/get-brands-by-product';
    $scope.productCategory = '-1'
    $scope.product = '-1'
    // $scope.products = [];
    console.log("Product Type App");


    // on form submit 

    $scope.saveProductType = function ($event) {
        $event.preventDefault();


        // validation

        if ($scope.product == '-1' || $scope.productCategory == '-1') {
            alert('select Product and Product Category')
            return
        }


        var formid = 'productTypeForm';
        var form = document.getElementById(formid);

        $.ajax({
            url: '/admin/dashboard/construction-material/save-product-size',
            type: "POST",
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (result) {
                console.log(result);
                form.reset();

            },
            error: function (error) {
                alert('Server Error')
                console.log(error);

            }
        }).done(function (data) {
            form.reset();
        });
    }



    // getconstruction material product

    $scope.loadProducts = function () {
        // alert()
        $http(
            {
                method: "GET",
                url: getProductsUrl + "/" + $scope.productCategory
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.products = res.data
            }
        )
    }

    // getconstruction material product

    $scope.loadBrands = function () {
        // alert($scope.product)
        $http(
            {
                method: "GET",
                url: getBrandsUrl + "/" + $scope.product
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.brands = res.data
            }
        )
    }




})

//product Verient APp
//================================================================================================================

var productVerientApp = angular.module('productVerientApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
productVerientApp.controller('productVerientController', function ($scope, $http) {

    // console.log($scope);
    // console.log($http);

    var getProductsUrl = '/admin/dashboard/construction-material/get-products-by-category';
    var getBrandsUrl = '/admin/dashboard/construction-material/get-brands-by-product';
    $scope.productCategory = '-1'
    $scope.product = '-1'
    // $scope.products = [];
    console.log("Product Type App");


    // on form submit 

    $scope.saveProductType = function ($event) {
        $event.preventDefault();


        // validation

        if ($scope.product == '-1' || $scope.productCategory == '-1') {
            alert('select Product and Product Category')
            return
        }


        var formid = 'productVarientForm';
        var form = document.getElementById(formid);

        $.ajax({
            url: '/admin/dashboard/construction-material/save-product-varient',
            type: "POST",
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (result) {
                console.log(result);
                form.reset();

            },
            error: function (error) {
                alert('Server Error')
                console.log(error);

            }
        }).done(function (data) {
            form.reset();
        });
    }



    // getconstruction material product

    $scope.loadProducts = function () {
        // alert()
        $http(
            {
                method: "GET",
                url: getProductsUrl + "/" + $scope.productCategory
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.products = res.data
            }
        )
    }

    // getconstruction material product

    $scope.loadBrands = function () {
        // alert($scope.product)
        $http(
            {
                method: "GET",
                url: getBrandsUrl + "/" + $scope.product
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.brands = res.data
            }
        )
    }




})

//================================================================================================================




// brand app add brands ==================================
var brandApp = angular.module('brandApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
brandApp.controller('brandController', function ($scope, $http) {
    // console.log($scope);
    // console.log($http);
    var getProductsUrl = '/admin/dashboard/construction-material/get-products-by-category';

    $scope.resetValues = function () {
        $scope.product = '-1';
        $scope.productCategory = '-1';
    }

    $scope.resetValues();

    // $scope.products = [];
    console.log("brand App");
    // on form submit 
    $scope.saveBrand = function ($event) {
        $event.preventDefault();



        // validation

        if ($scope.product == '-1' || $scope.productCategory == '-1') {
            alert('select Product and Product Sub Category')
            return
        }

        var formid = 'brandForm';
        var form = document.getElementById(formid);

        $.ajax({
            url: '/admin/dashboard/construction-material/save-brand',
            type: "POST",
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (result) {
                console.log(result);
                form.reset();
            },
            error: function (error) {
                alert('Server Error')
                console.log(error);
            }
        }).done(function (data) {
            form.reset();
        });


    }



    // getconstruction material product

    $scope.loadProducts = function () {
        // alert()
        $http(
            {
                method: "GET",
                url: getProductsUrl + "/" + $scope.productCategory
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.products = res.data
            }
        )
    }

})

// using more then 1 app in single page 
// angular.bootstrap(document.getElementById("materials"), ['app']);
angular.bootstrap(document.getElementById("productSizeApp"), ['productSizeApp']);
angular.bootstrap(document.getElementById("brandApp"), ['brandApp']);
angular.bootstrap(document.getElementById("productVerientApp"), ['productVerientApp']);

