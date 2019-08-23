var app = angular.module('productsCategory', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});


$(document).ready(function(){
    
})

app.controller('productsController' , function($scope , $http){
        console.log('Category controller');
        

        $scope.title = ''
        $scope.description = ''
        $scope.productCategories = []
    // saves the core category
    $scope.saveCoreCategory = function($event){
        $event.preventDefault();
        var form = document.getElementById('add_core_category_from');
        $.ajax({
            url : '/admin/dashboard/products/save-core-category',
            type: "POST",
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (result) {
                    console.log(result);
                    $scope.productCategories.push(eval(result))
                           },
            error: function () {
                alert('error')
            }
        }).done(function(data){
            form.reset();
            
            console.log(eval(data));
            
            
        });
    }

     //------------------- collect all categories -----------------------------
     $http(
        {
            method : 'get',
            url : '/api/material/core-category'
        }
    ).then(
        function(result){
            $scope.productCategories = result.data
        },
        function(error){

        }
    )
});


//============================== adding product =========================================================
var addProductApp = angular.module('addProductApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

addProductApp.controller('addProductController' , function($scope , $http){
    $scope.productCategory = [];
    $scope.category = '-1'
    $scope.products = [] 
    console.log('procut add app');


    $scope.saveProduct = function($event){
        var id = 'saveProduct';
        $event.preventDefault();

        if($scope.category == '-1'){
            alert('select Product category')
            return ;
        }
        var form = document.getElementById(id);
        $.ajax({
            url : '/admin/dashboard/products/save-product',
            type: "POST",
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (result) {
                           },
            error: function () {
                alert('Server Error')
            }
        }).done(function(data){
            form.reset();
        });


    
    }


    
    //------------------- collect all categories -----------------------------
    $http(
        {
            method : 'get',
            url : '/api/material/core-category'
        }
    ).then(
        function(result){
            $scope.productCategory = result.data
        },
        function(error){

        }
    )

    // collect all procuts
    
})



// ---------------------------------------------------------------------
// adding brand 
//============================== adding product =========================================================
var addBrandApp = angular.module('addBrandApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

addBrandApp.controller('addBrandController' , function($scope , $http){
    $scope.productCategory = [];
    $scope.category = '-1'
    $scope.product = '-1'
    console.log('Brand add app');

    $scope.saveBrand = function($event){
        alert(
            $scope.product + '  '+ $scope.category + "  " + $scope.title
        )

        if($scope.product == '-1' ){
            alert('select Product')
            return
        }
        if($scope.category == '-1' ){
            alert('select Category')
            return
        }

        $http(
            {
                method : 'post' , 
                url : "/admin/dashboard/brands",
                data : {
                    category : $scope.category , 
                    product : $scope.product,
                    brand : $scope.title 
                }
            }
        )
        .then(
            function(result){
                // $scope.products = result.data
                document.getElementById('savebrand').reset();
                console.log(result);
            } , 
            function(error){
                console.log(error);
            }
        )





    }

    //load product on category change

    $scope.loadProduct = function(){
        var cat = $scope.category
        if($scope.category == '-1' ){
            alert('select Category')
            return
        }

        $http(
            {
                method : 'get' , 
                url : "/admin/dashboard/products/"+cat
            }
        )
        .then(
            function(result){
                $scope.products = result.data
                console.log(result);
            } , 
            function(error){
                console.log(error);
            }
        )

    }

    
    //------------------- collect all categories -----------------------------
    $http(
        {
            method : 'get',
            url : '/api/material/core-category'
        }
    ).then(
        function(result){
            $scope.productCategory = result.data
        },
        function(error){

        }
    )
    
})

// ---------------------------------------------------------------------
// adding Sizes 
//============================== adding Sized =========================================================
var addBrandApp = angular.module('sizeApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

addBrandApp.controller('sizeController' , function($scope , $http){
    $scope.productCategory = [];
    $scope.category = '-1'
    $scope.product = '-1'
    console.log('Size App');

    $scope.saveSize = function($event){
        alert(
            $scope.product +"\n"+
            $scope.category +"\n"+ 
            $scope.size +"\n"+
            $scope.pUnit+"\n"+
            $scope.sUnit
        )

        if($scope.product == '-1' ){
            alert('select Product')
            return
        }
        if($scope.category == '-1' ){
            alert('select Category')
            return
        }
        if(!$scope.size || $scope.size.trim() == '' ){
            alert('Enter Size')
            return
        }

        $http(
            {
                method : 'post' , 
                url : "/admin/dashboard/sizes",
                data : {
                    category : $scope.category , 
                    product : $scope.product,
                    size : $scope.size, 
                    sUnit : $scope.sUnit, 
                    pUnit : $scope.pUnit, 
                }
            }
        )
        .then(
            function(result){
                // $scope.products = result.data
                document.getElementById('saveSize').reset();
                console.log(result);
            } , 
            function(error){
                alert('server error')
                console.log(error);
            }
        )





    }

    //load product on category change

    $scope.loadProduct = function(){
        var cat = $scope.category
        if($scope.category == '-1' ){
            alert('select Category')
            return
        }

        $http(
            {
                method : 'get' , 
                url : "/admin/dashboard/products/"+cat
            }
        )
        .then(
            function(result){
                $scope.products = result.data
                console.log(result);
            } , 
            function(error){
                console.log(error);
            }
        )

    }

    
    //------------------- collect all categories -----------------------------
    $http(
        {
            method : 'get',
            url : '/api/material/core-category'
        }
    ).then(
        function(result){
            $scope.productCategory = result.data
        },
        function(error){

        }
    )
    
})



//================================================================================================


//============================== adding product Types=========================================================
var addProductType = angular.module('addProductTypeApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

addProductType.controller('addProductTypeController' , function($scope , $http){
    $scope.productCategory = [];
    $scope.subCategories = []
    $scope.category = '-1'
    $scope.product = '-1'
    console.log('Product Type');

    $scope.saveProductType = function($event){
        // data.subCategories = data
        alert(
            $scope.product + '  '+
             $scope.category + "  " +
              $scope.productType + " " + 
              $scope.description
        )

        if($scope.product == '-1' ){
            alert('select Product')
            return
        }
        if($scope.category == '-1' ){
            alert('select Category')
            return
        }

        $.ajax({
            url : '/admin/dashboard/product-type',
            type: "POST",
            data: new FormData(document.getElementById('saveProductType')),
            contentType: false,
            processData: false,
            success: function (result) {
                           },
            error: function () {
                alert('Server Error')
            }
        }).done(function(data){
            document.getElementById('saveProductType').reset();
            $scope.subCategories.push(data)
        });
    }

    //load product on category change

    $scope.loadProducts = function(){
        var cat = $scope.category
        console.log('getting products');
        

        if($scope.category == '-1' ){
            alert('select Category')
            return
        }

        $http(
            {
                method : 'get' , 
                url : "/admin/dashboard/products/"+cat
            }
        )
        .then(
            function(result){
                $scope.products = result.data
                console.log(result);
            } , 
            function(error){
                console.log(error);
            }
        )

    }

    
    //------------------- collect all categories -----------------------------
    $http(
        {
            method : 'get',
            url : '/api/material/core-category'
        }
    ).then(
        function(result){
            $scope.productCategory = result.data
        },
        function(error){

        }
    )
        // get All Product Type
    $http(
        {
            method : 'get',
            url : '/api/material/product-types'
        }
    ).then(
        function(result){
            $scope.subCategories = result.data
        },
        function(error){

        }
    )
    
})




// using more then 1 app in single page 
angular.bootstrap(document.getElementById("addProductApp"), ['addProductApp']);
angular.bootstrap(document.getElementById("addProductTypeApp"), ['addProductTypeApp']);
angular.bootstrap(document.getElementById("addBrandApp"), ['addBrandApp']);
angular.bootstrap(document.getElementById("sizeApp"), ['sizeApp']);
// angular.bootstrap(document.getElementById("productsCategory"), ['productsCategory']);