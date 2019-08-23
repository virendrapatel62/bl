$(document).ready(function(){
    $('.loading').modal('show')
})

var app = angular.module('addserviceapp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

// var app = angular.module('addserviceapp' , []);
app.controller('addserviceController', function ($http) {
    Service = this;
    this.services = [];
    var count = 1;

    // adds a service to server 
    this.addService = function () {

        var title = Service.serviceTitle;
        if (!title || title.trim() == '') {
            alert('title is required..')
            return
        }

        $http({
            url: '/admin/service/add',
            method: 'post',
            data: { name: title }
        }).then(function (result) {
            // alert(JSON.stringify(result.data))
            Service.serviceTitle = ""
            Service.services.push(result.data)
        }, function () {
            alert('Cant save . Server error')
        })
    }

    // collect all when page loaded 

    this.collectAllCoreService = function () {
        $http({
            url: '/admin/coreservices',
            method: 'get',
        }).then(function (result) {
            // when result recived show the div 
            $('#addServiceDiv').hide();
            $('#addServiceDiv').removeAttr('hidden');
            $('#addServiceDiv').slideDown(500);
            Service.services = result.data

        }, function () {
            alert('Cant Get COre Serives . Server error')
        })
    }

    this.collectAllCoreService();




})


function showDetails(partnerid) {
    var url = "/admin/partnerreview/" + partnerid
    window.open(url)
}

//=================================================================================================


// AddSub Service Controller APp 

var addSubServiceApp = angular.module('addSubServiceApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

//----------------------------------------------------------

addSubServiceApp.controller('addSubServiceController', function ( $scope, $http) {
    this.coreServices = [];
    subServiceApp = this;
    subServiceApp.core = '0';
    $scope.subservices = []

    //----------------------------------------

    this.saveSubservice = function(e , elem){
        if(subServiceApp.core == 0){
            alert('select Core service')
            return 
        }

        if(!$scope.title || $scope.title.trim() == ''){
            alert('ENter title')
            return;
        }
        // alert();
        e.preventDefault()
       
        $.ajax({
            url: "/admin/subservice/save",
            type: "POST",
            data: new FormData(document.getElementById('subserviceform')),
            contentType: false,
            processData: false,
            success: function (result) {
                           },
            error: function () {
                alert('error')
            }
        }).done(function(data){
            // alert(data)'l
            // alert(JSON.stringify(data))
            $scope.title = ''
            $scope.subservices.push(data)
            $scope.$apply();
        });
    }
   

    //------------------------------------------------------------
    // collecting core services for select tag
    this.collectAllCoreService = function () {
        $http({
            url: '/admin/coreservices',
            method: 'get',
        }).then(function (result) {
            // when result recived show the div 
            // alert(result.data);
            subServiceApp.coreServices = result.data
            subServiceApp.core = '0';
        }, function () {
            alert('Cant Get COre Serives . Server error')
        })
    }

    //------------------------------------------------------------
    this.collectAllSubService = function () {
        $http({
            url: '/admin/subservices',
            method: 'get',
        }).then(function (result) {
            // when result recived show the div 
            // alert(result.data);
            $('.loading').modal('hide')
            
            $scope.subservices = result.data
        }, function () {
            alert('Cant Get Sub Serives . Server error')
        })
    }

    this.collectAllCoreService();
    this.collectAllSubService();
})




//==============================================================================================
// Maintenance service add remove Application 

var addMaintenanceServicesApp = angular.module('maintenanceServicesApp', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

addMaintenanceServicesApp.controller('maintenanceServicesController' , function($scope , $http){
    // alert('maintenanceServicesApp');

    $scope.maintenaceService = '0';
    $scope.services = [];
    $scope.MaintenaceSubServices = [];

    // forupdation
    
    $scope.updateObject = null;
   
    $scope.openUpdateModel = function(data){
        $scope.updateObject = data[0][0];
        $('#updateMaintenanceSubServiceModal').modal('show')
    }

    $scope.updateOnKeyPress = function($event){
        console.log($event.key);
        if($event.key == 'Enter'){
            $scope.update();
        }
        
    }
    $scope.update = function(){
        if(!$scope.updateObject.name){
            alert('enter title')
            return ;
        }

        if(!$scope.updateObject.description){
            alert('enter Description')
            return ;
        }
        if($scope.updateObject.serviceCharge == 0 || !$scope.updateObject.serviceCharge){
            alert('enter serviceCharge')
            return ;
        }
        var data = new Object();
        data.title = $scope.updateObject.name;
        data.serviceCharge = $scope.updateObject.serviceCharge;
        data.serviceId   = $scope.updateObject._id;
        data.description   = $scope.updateObject.description;
        //sending data to server for updattion
        $http({
            url: '/admin/maintenance-services/update-sub-service/tiillelell',
            method: 'post',
            data : data
        }).then(function (result) {
            console.log(result.data);
            $scope.updateObject = result.data
            $('#updateMaintenanceSubServiceModal').modal('hide')
        }, function () {
            alert('Cant Get Sub Serives . Server error')
        })
        
        
    }


    $scope.saveSubservice = function(event , elem){
        event.preventDefault();
        if(! $scope.title){
            alert('enter title')
            return ;
        } else if(!$scope.description){
            alert('enter Description')
            return ;
        } else if ($scope.maintenaceService == 0){
            alert('select Service : ')
            return ;
        }

        console.log($scope.title);
        console.log($scope.description);
        console.log($scope.maintenaceService);

        //sending data to server
        
        $.ajax({
            url: "/admin/maintenance-services/save-sub-service",
            type: "POST",
            data: new FormData(document.getElementById('maintenaceServiceForm')),
            contentType: false,
            processData: false,
            success: function (result) {
                           },
            error: function () {
                alert('error')
            }
        }).done(function(data){
            // alert(data)'
            // alert(JSON.stringify(data))
            document.getElementById('maintenaceServiceForm').reset();
            $scope.title = ''
            $scope.description = ''
            console.log(data);
            
            $scope.MaintenaceSubServices.push(data)
            $scope.$apply();
        });
        
    };

    // collect maintenance main serivece
    $scope.collectMaintenaceServices = function () {
        $http({
            url: '/admin/maintenance-services/get-all-maintenance-services',
            method: 'get',
        }).then(function (result) {
            console.log(result.data);
            
            $scope.services = result.data
        }, function () {
            alert('Cant Get Sub Serives . Server error')
        })
    }

    
    // collect maintenance sub serivece
    $scope.collectMaintenaceSubServices = function () {
        $http({
            url: '/admin/maintenance-services/get-all-maintenance-sub-services',
            method: 'get',
        }).then(function (result) {
            console.log(result.data);
            
            $scope.MaintenaceSubServices = result.data
        }, function () {
            alert('Cant Get Sub Serives . Server error')
        })
    }

    $scope.collectMaintenaceServices();
    $scope.collectMaintenaceSubServices()


})








//================================================================================================
// using more then 1 app in single page 
angular.bootstrap(document.getElementById("addSubServiceApp"), ['addSubServiceApp']);
angular.bootstrap(document.getElementById("maintenanceServicesApp"), ['maintenanceServicesApp']);