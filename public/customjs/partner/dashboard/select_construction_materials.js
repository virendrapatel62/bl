$(document).ready(function () {
    const table = $('#table').DataTable();
    table.page.len(100).draw();
    console.clear()
})


var app = angular.module('constructionMaterialsApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('constructionMaterialsController', function ($scope, $http) {

    $scope.oldPrize = 0;
    $scope.newPrize = 0;

    $scope.onInputPrize = function (event, mrpid, productid , stockType) {

        var prize = $(event.target).val();

        var mrp = mrpid
        var product = productid
        // comparing with old prize if not change dont send requst
        if (prize === $scope.oldPrize) {
            return;
        }



        if (!prize || new Number(prize) < 1) {
            // removing green cheakbox
            $(event.target)
                .parents('tr')
                .find('.fa-check-circle')
                .removeClass('text-success').addClass('text-disabled')
            prize = 0;
        }

        console.log({
            prize,
            mrp,
            product
        });

        // save to server
        $scope.disable();
        $http({
            method: 'POST',
            url: '/partner/dashboard/construction-materials/save-or-update-partner-product',
            data: {
                product,
                prize,
                mrp, 
                stockType
            }
        }).then(
            function (res) {
                $scope.enable();
                // on success
                // setting green cheakbox
                (prize == 0) ? $(event.target)
                    .parents('tr')
                    .find('.fa-check-circle')
                    .removeClass('text-success').addClass('text-disabled') :
                    $(event.target)
                        .parents('tr')
                        .find('.fa-check-circle')
                        .removeClass('text-disabled').addClass('text-success')

                console.log(res);
            },
            function (er) {
                console.log(er);
                $scope.enable();
            }
        )



    }

    $scope.prizeFocus = function (event) {
        // alert();
        var input = $(event.target)
        $scope.oldPrize = $(input).val();
        console.log($scope.oldPrize);

    }

    //on focus
    $scope.addQuantityFocus = function (event, labelID) {
        // console.log('Add Quantity');
    }
    // on focus
    $scope.removeQuantityFocus = function (event, labelID) {
        // console.log('remove Quantity');

    }

    $scope.blurOnKeyPress = function (event) {
        var elem = event.target
        console.log(event);
        if (event.keyCode == 13) {
            focusable = $(document).find('input').filter(':visible:not([readonly]):not([disabled])');
            next = focusable.eq(focusable.index($(elem)) + 1);
            $(next).focus();
        }

    }

    //disable all inputs when request sent 
    $scope.disable = function(){
        enable = $(document).find('input[type="number"]');
        $(enable).attr('readonly' , 'true')
    }
    //enable
    $scope.enable = function(){
        enable = $(document).find('input[type="number"]');
        $(enable).removeAttr('readonly')
    }

   



    // onblurRemove Quantity

    $scope.onRemoveQuantity = function (event, mrp, product, labelID) {

        var input = $(event.target)
        console.log('remove Quantity Blur ');

        // var productid = $(input).attr('id');


        //Quantity label's ID and  and input fileds' class is same  , 

        // Available quantity Label 
        // for futurw use , for update at the end
        var labelForUpdate = $('.label' + labelID)

        // input fielf for update at end 
        var inputClass = labelID;

        // holding old quantity to calculate woth new 
        // more then one label has same value so that using labelForUpdate[0]
        var oldQuantity = new Number($(labelForUpdate[0]).text())

        // console.log(inputClass);

        // claculating new Quantity to sent to server
        var newQuant = $(input).val() ? new Number($(input).val()) : 0;

        if(newQuant <= 0){
            $("." + inputClass).val('')
            return ;
        }

        // total new 
        var total = eval(oldQuantity - newQuant)
        console.log({ newQuant, total });

        if (total < 0) {
            $("." + inputClass).val('')
            $(labelForUpdate).text(oldQuantity)
            console.log('less the zero ..... not sending request ');

            // can show message 
            return;
        }

        $scope.sendRequest(labelForUpdate, inputClass, total, product, mrp)

    }

    $scope.sendRequest = function (labelForUpdate, inputClass, total, product, mrp) {

        $scope.disable();

        $http({
            method: 'POST',
            url: '/partner/dashboard/construction-materials/update-stock',
            data: {
                quantity: total,
                product,
                mrp
            }
        }).then(
            function (res) {
                // on success
                $("." + inputClass).val('')
                $(labelForUpdate).text(total)
                $scope.enable();
            },
            function (er) {
                $scope.enable();
                console.log(er);
                alert(er.data)
            }
        )

        
    }



    // on blur Add Quantity
    $scope.onInputQuantity = function (event, mrp, product, labelID) {
        var input = $(event.target)
        console.log('add Quantity Blur ');

        // var productid = $(input).attr('id');


        //Quantity label's ID and  and input fileds' class is same  , 

        // Available quantity Label 
        // for futurw use , for update at the end
        var labelForUpdate = $('.label' + labelID)

        // input fielf for update at end 
        var inputClass = labelID;

        // holding old quantity to calculate woth new 
        // more then one label has same value so that using labelForUpdate[0]
        var oldQuantity = new Number($(labelForUpdate[0]).text())

        // console.log(inputClass);

        // claculating new Quantity to sent to server
        var newQuant = $(input).val() ? new Number($(input).val()) : 0;
        if(newQuant <= 0){
            $("." + inputClass).val('')
            return ;
        }
        // total new 
        var total = eval(oldQuantity + newQuant)
        console.log({ newQuant, total });

        if (total <= oldQuantity) {
            $("." + inputClass).val('')
            $(labelForUpdate).text(oldQuantity)
            return;
        }
        $scope.sendRequest(labelForUpdate, inputClass, total, product, mrp)
    }

    $scope.rowClick = function (event) {
        // console.log(event.target);
    }
})