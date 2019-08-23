
var app = angular.module('addServicesApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('addServicesController' , function($scope , $http){

    $scope.coreServices = [];
    $scope.subcheck = false;
    $scope.check = false;

    // save service eith user 
    $scope.saveService = function(sub , core ,  $event ){
        console.log(sub);
        console.log(core);
        console.log(this);
        if(this.subcheck){
            console.log('Saviing.....');
            
            $http({
                url: '/partner/addservices/save/partner/service/'+core+'/'+sub,
                method: 'get',
            }).then(function (result) {
                console.log('saved to database ......');
                console.log(result.data);
                
            }, function (error) {
                console.log(error.status);
                if(error.status == 401){
                    alert('Please login to Save Changes..')
                    return ;
                }
                alert('Cant save now.. Try Again later..')
            })
            
        }else{
            console.log('Deleteng.....');
            $http({
                url: '/partner/addservices/delete/partner/service/'+core+'/'+sub,
                method: 'get',
            }).then(function (result) {
                console.log('deleteing  From  database ......');
                console.log(result.data);
                
            }, function (error) {
                console.log(error.status);
                if(error.status == 401){
                    alert('Please login to Save Changes..')
                    return ;
                }
                alert('Cant Remove now.. Try Again later..')
            })

        }
        
        
    }


    // getSubservices 
    $scope.getSubServices = function( core , index , $event){
        
        console.log("get Sub serice before ");
        if($event && !this.check ){
            $scope.coreServices[index].subservices = []
            return
        }
       
        console.log("get Sub serice");
        
        $http({
            url: '/partner/addservices/getSubServices/'+core,
            method: 'get',
        }).then(function (result) {
                $scope.coreServices[index].subservices = result.data;
            // $scope.coreServices = result.data;
            console.log(result.data);
            
        }, function () {
            alert('Cant Get COre Serives . Server error')
        })
    }

    // collect all Core services
    $scope.collectAllCoreService = function () {
        $http({
            url: '/partner/addservices/getCoreServices',
            method: 'get', 
        }).then(function (result) {
            for (var i in result.data){
                result.data[i].subservices = [];
                
            }
            $scope.coreServices = result.data;
            console.log(result.data);
            for (var i in $scope.coreServices){
                $scope.coreServices[i].subservices = [];

                if($scope.coreServices[i].checked){
                    console.log('getting sub service also ');
                    $scope.getSubServices($scope.coreServices[i]._id , i , null);   
                }
            }
            
            
            
        }, function () {
            alert('Cant Get COre Serives . Server error')
        })
    }

    $scope.collectAllCoreService();
})


function getCheckStatusOfCore(a){
    alert();
}