var app = angular.module('app', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});



app.controller('Controller', function ($scope, $http) {
    console.log('COntroller...');
    var sizecount = 1;
    var varientcount = 1;
    $scope.reset = function () {
        sizecount = 1;
        varientcount = 1;
        $scope.sizeCount = [1];
        $scope.varientCount = [1];
        $scope.sizesArray = []

    }



    $scope.reset();

    $scope.test = function () {
        var sizes = $('input[name="size"]');
        $scope.sizesArray = [];
        sizes.each(function (index) {
            var value = $(sizes[index]).val();
            (value) ? $scope.sizesArray.push($(sizes[index]).val()) : console.log('not item');
        })
    }
    console.log($scope.sometest);

    $scope.moreSize = function () {
        sizecount++;
        $scope.sizeCount.push(sizecount)
    }

    $scope.moreSizeVarient = function () {
        varientcount++;
        $scope.varientCount.push(varientcount)
    }

    $scope.saveProduct = function (e) {
        e.preventDefault();
        var form = document.getElementById('productForm');
        console.log(new FormData(form));
        var data = new FormData(form);
        var vareints_size = [];

        var vareints = []
        var mrp = []

        $('select[name="vareints_size"]').each(function (index) {
            var el = $('select[name="vareints_size"]');
            vareints_size.push($(el[index]).children("option:selected").val())
        })

        $('input[name="vareints"]').each(function (index) {
            vareints.push($($('input[name="vareints"]')[index]).val())
        })

        $('input[name="mrp"]').each(function (index) {
            mrp.push($($('input[name="mrp"]')[index]).val())
        })

        // creating object 
        var vari = [];
        for (var i = 0; i < mrp.length; i++) {
            var obj = {};
            obj.size = vareints_size[i];
            obj.mrp = mrp[i];
            obj.varient = vareints[i];
            vari.push(obj)
        }

        console.log(JSON.stringify(vari));


        data.append('varients', JSON.stringify(vari))
        $.ajax({
            url: '/admin/dashboard/construction-material/save-product',
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                console.log(result);
                $scope.reset()


            },
            error: function (error) {
                alert('Server Error')
                console.log(error);

            }
        }).done(function (data) {
            form.reset();
            $scope.reset();
            window.location.reload();
        });

    }



    // load all products for shoing on model

    $scope.loadAllProducts  = function(){
        var getAllUrl = '/admin/dashboard/construction-material/getAll/populated'
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

    $scope.showHideLoadingOfProductModel = function(flag){
        if(flag){
            // show loading
            $('.product-loading').removeAttr('hidden')
            $('.all-products-modal').modal('hide')
        }else{
            $('.product-loading').attr('hidden' , 'hidden')
            $('.all-products-modal').modal('show')
            // hide loading
        }
    }

});


// productTypeApp ======================================================================

var productTypeApp = angular.module('productTypeApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
productTypeApp.controller('productTypeController', function ($scope, $http) {

    // console.log($scope);
    // console.log($http);

    var getAllUrl = '/admin/dashboard/construction-material/getAll';
    // $scope.products = [];
    console.log("Product Type App");


    // on form submit 

    $scope.saveProductType = function ($event) {
        $event.preventDefault();

        

        var formid = 'productTypeForm';
        var form = document.getElementById(formid);

        $.ajax({
            url: '/admin/dashboard/construction-material/save-product-type',
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

    $http(
        {
            method: "GET",
            url: getAllUrl
        }
    ).then(
        function (res) {
            console.log(res.data);
            $scope.products = res.data
        }
    )




})



// brand app add brands ==================================
var brandApp = angular.module('brandApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
brandApp.controller('brandController', function ($scope, $http) {
    // console.log($scope);
    // console.log($http);
    var getAllUrlProducts = '/admin/dashboard/construction-material/getAll';

    $scope.resetValues = function () {
        $scope.product = '-1';
        $scope.productType = '-1';
    }

    $scope.resetValues();

    // $scope.products = [];
    console.log("brand App");
    // on form submit 
    $scope.saveBrand = function ($event) {
        $event.preventDefault();



        // validation

        if($scope.product == '-1'|| $scope.productType == '-1'){
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


    // onSelect product fetch ALl product Types
    $scope.loadProductTypes = function () {
        var selectedProduct = $scope.product;
        var url = `/admin/dashboard/construction-material/get-product-types/`+selectedProduct;
        $http(
            {
                method: "GET",
                url: url
            }
        ).then(
            function (res) {
                console.log(res.data);
                $scope.productTypes = res.data
            }
        )
    }
    // getconstruction material product

    $http(
        {
            method: "GET",
            url: getAllUrlProducts
        }
    ).then(
        function (res) {
            console.log(res.data);
            $scope.products = res.data
        }
    )
})

// using more then 1 app in single page 
// angular.bootstrap(document.getElementById("materials"), ['app']);
angular.bootstrap(document.getElementById("productTypeApp"), ['productTypeApp']);
angular.bootstrap(document.getElementById("brandApp"), ['brandApp']);

