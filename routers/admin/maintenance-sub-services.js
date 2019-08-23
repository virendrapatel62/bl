const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const { Partner } = require('../../models/partner');
const { CoreServices } = require('../../models/coreservices');
const { SubServices } = require('../../models/subservices');
const { MaintenanceSubServices } = require('../../models/maintenance-sub-services');


// for - admin/maintenance-services




var multer  = require('multer');
var upload = multer({ dest: 'uploads/subservice/maintenance-sub-services'})
// serve All Sub Services with image  
Router.post('/save-sub-service'  , upload.single('image') , async (req , res)=>{
    
    var body = req.body;
    var title = body.title;
    var path  = req.file.path;
    var description = body.description;
    var coreservice = body.maintenanceService;

    console.log(__filename);
    console.log(title , description , coreservice , path );

    const maintenanceService = new MaintenanceSubServices({
        name : title ,
        description : description , 
        coreService : coreservice , 
        image : path 
    })
    var  result = await maintenanceService.save();
     result = await MaintenanceSubServices.findOne({_id : result._id}).populate('coreService').select();
    res.send(result);
})

// update sub service 
Router.post('/update-sub-service/:title' , async (req , res)=>{
    
    var body = req.body;
    var title = body.title;
    var description = body.description;
    var id = body.serviceId;
    var serviceCharge = body.serviceCharge;

    console.log(__filename);

    const result = await MaintenanceSubServices.findOneAndUpdate({_id : id } , {
        $set : {
            name : title , 
            description : description , 
            serviceCharge : serviceCharge 
        }
    })

    console.log(result);
    res.send(req.body);
})

// get main mentainece service --> plumber , electrician
Router.get('/get-all-maintenance-services' , async(req , res)=>{
    const maintenance = await CoreServices.findOne({name : 'Maintenance'}).select();
    const services = await SubServices.find({coreservice : maintenance._id}).select();
    console.log(__filename);
    console.log(services);

    res.send(services)
    
})


// get main mentainece service --> tub fittin g , wire fitting , tank change
Router.get('/get-all-maintenance-sub-services' , async(req , res)=>{
    const services = await MaintenanceSubServices.find().populate('coreService').select();
    console.log(__filename);
    console.log(services);

    res.send(services)
    
})


module.exports = Router;