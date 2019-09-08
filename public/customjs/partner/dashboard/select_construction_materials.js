$(document).ready(function () {
    $('#table').DataTable();
    console.clear()
})


var app = angular.module('constructionMaterialsApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('constructionMaterialsController', function ($scope, $http) {
    $scope.onInputPrize = function (event, mrpid, productid) {

        var prize = $(event.target).val();

        var mrp = mrpid
        var product = productid



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

        $http({
            method: 'POST',
            url: '/partner/dashboard/construction-materials/save-or-update-partner-product',
            data: {
                product,
                prize,
                mrp
            }
        }).then(
            function (res) {
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
            }
        )



    }

    $scope.rowClick = function (event) {
        // console.log(event.target);
    }

})