

var app = angular.module('userLoginApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('userLoginController', function ($scope, $http) {

    // user login form 
    $scope.emailClass = ''
    $scope.emailErrorMessage = 'Please Enter valid email'
    $scope.passwordErrorMessage = 'Password must be 8 Character long'
    $scope.passwordClass = ''

    // partner login form 
    $scope.partnerEmailClass = ''
    $scope.partnerEmailErrorMessage = 'Please Enter valid email'
    $scope.partnerPasswordErrorMessage = 'Passoword must be 8 Character long'
    $scope.partnerPasswordClass = ''

    // animation variables
    $scope.showResetPasswordInAnimation = 'fadeInLeft'
    $scope.showResetPasswordOutAnimation = 'fadeOutLeft'
    $scope.emailSentInAnimation = 'fadeInLeft'
    $scope.emailSentOutAnimation = 'fadeOutLeft'
    $scope.loginInAnimation = 'fadeInRight'
    $scope.loginOutAnimation = 'fadeOutRight'
    $scope.animationMustClass = 'animated faster'

    $('#logindiv').addClass($scope.animationMustClass);
    $('#forgetPassword').addClass($scope.animationMustClass);
    $('#linksent').addClass($scope.animationMustClass);





    // send password reset link to email 
    $scope.sendResetLink = function($event){
        
        // server side ajax request
        var email = $scope.fpemail;
        if(!document.getElementsByClassName('needs-validation')[0].checkValidity()){
            $scope.resetError = 'enter valid email'; 
            return;
        }
        $scope.resetError = '';
        var url = '/reset-password/send-link/' 
        if($scope.forgetPasswordFor == 'user'){
            url = url + 'user/'+email
        }else{
            url = url + 'partner/'+email
        }

        $($event.target).find('.spinner-border').removeAttr('hidden')
        console.log(url);
        
        $http({
            method : 'get'  , 
            url : url
        })
        .then(
            function(result){
                $($event.target).find('.spinner-border').attr('hidden' , 'hidden')
                $scope.linkSentToEmail();
            }  , 
            function(error){
                console.log(error);
                
                $($event.target).find('.spinner-border').attr('hidden' , 'hidden')
            }
        )

        
    }

    // show the reset password box , enter emial to send link
    $scope.showResetPassword = function (uOrP) {
        /// u = user , 
        // p = partner 
        $('#logindiv').one('animationend', function () {
            $('#logindiv').attr('hidden', 'hidden');
            $('#forgetPassword').removeAttr('hidden');
            $('#forgetPassword').addClass($scope.showResetPasswordInAnimation);
            $('#forgetPassword').removeClass($scope.showResetPasswordOutAnimation);
        })
        $('#logindiv').addClass($scope.loginOutAnimation);
        $('#logindiv').removeClass($scope.loginInAnimation);

        if(uOrP == 'u'){
            // for user
            $scope.forgetPasswordFor = 'user';
        }else{
            // for partner 
            $scope.forgetPasswordFor = 'partner';
        }

    }



    // show the message that link sent to email success 
    $scope.linkSentToEmail = function(){
        $('#forgetPassword').one('animationend' , function(){
            $('#forgetPassword').attr('hidden' , 'hidden');
            $('#linksent').removeAttr('hidden');
            $('#linksent').addClass($scope.emailSentInAnimation);
            $('#linksent').removeClass($scope.emailSentOutAnimation);
        })

        $('#forgetPassword').addClass($scope.showResetPasswordOutAnimation);
        $('#forgetPassword').removeClass($scope.showResetPasswordInAnimation);
    }


    // after link send when user click on Login
    $scope.showLoginAfterLinkSend = function(){
        $('#linksent').one('animationend' , function(){
            $('#linksent').attr('hidden' , 'hidden');
            $('#logindiv').removeAttr('hidden');
            $('#logindiv').addClass($scope.loginInAnimation);
            $('#logindiv').removeClass($scope.loginOutAnimation);
        })

        $('#linksent').addClass($scope.emailSentOutAnimation);
        $('#linksent').removeClass($scope.emailSentInAnimation);
    }

    

    // show the login div , from reset password div login button
    $scope.showLogin = function () {
        $('#forgetPassword').one('animationend', function () {
            $('#forgetPassword').attr('hidden', 'hidden');
            $('#logindiv').removeAttr('hidden');
            $('#logindiv').addClass($scope.loginInAnimation);
            $('#logindiv').removeClass($scope.loginOutAnimation);
        })
        $('#forgetPassword').addClass($scope.showResetPasswordOutAnimation);
        $('#forgetPassword').removeClass($scope.showResetPasswordInAnimation);
    }


    // user login 
    $scope.login = function ($event) {
        $event.preventDefault();

        if (!$scope.email || $scope.email.trim().length == 0) {
            $scope.emailErrorMessage = 'Please Enter valid email'
            $scope.emailClass = 'is-invalid'
            return;
        } else {
            $scope.emailClass = 'is-valid'
        }
        if (!$scope.password || $scope.password.trim().length < 8) {
            $scope.passwordErrorMessage = 'Passoword must be 8 Character long'
            $scope.passwordClass = 'is-invalid'
            return;
        }
        $scope.passwordClass = 'is-valid'
        // request to server
        $http({
            method: 'post',
            data: {
                email: $scope.email,
                password: $scope.password
            },
            url: '/login'
        }).then(
            function (result) {
                console.log(result.data);
                window.location = '/user'
            },
            function (error) {
                console.log(error);

                $scope.emailClass = 'is-invalid'
                $scope.passwordClass = 'is-invalid';
                $scope.emailErrorMessage = 'email or Password Incorrect'
                $scope.passwordErrorMessage = ''
            }

        )
    }


    // partner login 
    $scope.partner = function ($event) {
        console.log('partner login');

        $event.preventDefault();

        if (!$scope.partnerEmail || $scope.partnerEmail.trim().length == 0) {
            $scope.partnerEmailErrorMessage = 'Please Enter valid email'
            $scope.partnerEmailClass = 'is-invalid'
            return;
        } else {
            $scope.partnerEmailClass = 'is-valid'
        }
        if (!$scope.partnerPassword || $scope.partnerPassword.trim().length < 8) {
            $scope.partnerPasswordErrorMessage = 'Passoword must be 8 Character long'
            $scope.partnerPasswordClass = 'is-invalid'
            return;
        }
        $scope.partnerPasswordClass = 'is-valid'
        // request to server
        $http({
            method: 'post',
            data: {
                email: $scope.partnerEmail,
                password: $scope.partnerPassword
            },
            url: '/login/partnerlogin'
        }).then(
            function (result) {
                console.log(result.data);
                window.location = result.data.nextPage;
            },
            function (error) {
                console.log(error);

                $scope.partnerEmailClass = 'is-invalid'
                $scope.partnerPasswordClass = 'is-invalid';
                $scope.partnerEmailErrorMessage = 'email or Password Incorrect'
                $scope.partnerPasswordErrorMessage = ''
            }

        )


    }
})

