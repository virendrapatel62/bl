
const app = angular.module('partnerLoginApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});


app.controller('partnerLoginController' , function($scope , $http){

    $scope.email = 'mohan@gmail.com'
    $scope.password = '123456789'

    // on submit fomr
    $scope.partnerLogin = function(event){
        console.log($scope.email);
        console.log($scope.password);
        event.preventDefault();
        if($scope.emailBlur() && $scope.passwordBlur()){
            var email = $scope.email ;
            var password = $scope.password;

            $http({
                method: 'post',
                url : '/login/partnerlogin/' , 
                data : {
                    email : email , 
                    password : password 
                }
            }).then(function(result ){
                console.log("login SUccess");
                window.location = '/partner/home';
            } , function(error){
                if(error.status == 500){
                    alert('email or password incorrect')
                }
            })
        }
    }

    $scope.emailBlur = function(){
        var flag = false;
        var email = $scope.email ;
        var reg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/; 
        if(reg.test(email)){
            console.log('testpass');
            
            $('input[name="email"]').addClass('is-valid')
            $('input[name="email"]').removeClass('is-invalid')
            flag = true;
        }else{
            
            console.log('test fail');
            $('input[name="email"]').addClass('is-invalid')
            $('input[name="email"]').removeClass('is-valid')
        }
        return flag;
    }

    $scope.passwordBlur = function(){
        // alert()
        var flag = false;
        var r1 = /^(?=.*[0-9])/;
        var r2 = /^(?=.{8,})/;
        console.log('password blur');
        var pass = $scope.password;
        if(r1.test(pass) && r2.test(pass)){
            console.log('testpass');
            
            flag = true;
            $('input[name="password"]').addClass('is-valid')
            $('input[name="password"]').removeClass('is-invalid')
        }else{
            console.log('testpass');
            
            $('input[name="password"]').addClass('is-invalid')
            $('input[name="password"]').removeClass('is-valid')
           
        }
        return flag
        
    }
})