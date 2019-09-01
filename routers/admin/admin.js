const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const { Partner } = require('../../models/partner');
const { CoreServices } = require('../../models/coreservices');
const { SubServices } = require('../../models/subservices');

// serves admin page
Router.get('/', async(req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../html/admin/dashboard.html'))
    const pending = await Partner.find({ status: "pending" }).populate('city state').select();
    for (i in pending) {
        pending[i].id = pending[i]._id
    }
    res.send(template({
        size : pending.length, 
        pending: pending
    }))
})

// serves partner rewiev application
Router.get('/partnerreview/:id', async(req, res) => {
    const id = req.params.id;
    const partnerForReview = await Partner.findOne({ _id: id }).populate('city state').select();
    console.log(partnerForReview);

    const template = swig.compileFile(path.join(__dirname, '/../../html/admin/partnerreview.html'))

    res.send(template({
        partner: partnerForReview,
        id: req.params.id
    }))
})

// confirm the partner 

Router.get('/partnerreview/confirm/:id', async(req, res) => {
    const id = req.params.id;
    const updatedResult = await Partner.update({ _id: id }, {
        $set: {
            status: 'active'
        }
    });
    const partner = await Partner.findOne({ _id: id }).select('email');
    console.log(partner);
    res.send();

    // sending mail to user...
    const p = new Promise(function(res, rej) {
        const mail = require('../utility/mailsender')
        var context = {
            data: "Application Approoved..."
        }
        mail(partner.email, "Application review", context, "test.html")
        res('success')
    }).then((value) => {
        console.log(value);

    })

})

// descline the partner 

Router.get('/partnerreview/decline/:id', async(req, res) => {
    const id = req.params.id;
    const updatedResult = await Partner.update({ _id: id }, {
        $set: {
            status: 'decline'
        }
    });
    const partner = await Partner.findOne({ _id: id }).select('email');
    console.log(partner);
    res.send();

    // sending mail to user...
    const p = new Promise(function(res, rej) {
        const mail = require('../utility/mailsender')
        var context = {
            data: "Application Declined....."
        }
        mail(partner.email, "Application review", context, "test.html")
        res('success')
    }).then((value) => {
        console.log(value);

    })
})

// adds a cservice by admin 
Router.post('/service/add' , async (req , res)=>{
    name = req.body.name;
    const ser = new CoreServices({
        name : name , 
        subservices  : []
    })
    const result =await  ser.save();
    console.log(result);
    res.send(result)
    
})

// serve All Core Services  
Router.get('/coreservices' , async (req , res)=>{
    const service = await CoreServices.find().select();
    res.send(service)
})

// serve All SUb Services  
Router.get('/subservices' , async (req , res)=>{
    const service = await SubServices.find().populate('coreservice').select();
    res.send(service)
    
})


var multer  = require('multer');
var upload = multer({ dest: 'uploads/subservice'})
// serve All Sub Services with image  
Router.post('/subservice/save'  , upload.single('file') , async (req , res)=>{
    
    var body = req.body;
    var title = body.title;
    var coreservices = body.coreservice;

    const subservice = new SubServices({
        name : title , 
        coreservice : coreservices , 
        image : req.file.path
    })
    var result = await subservice.save();
    if(result){
        const res = await CoreServices.updateOne({_id : coreservices} , {
            $push : {
                subservices : result._id
            }
        })
        console.log(res);
        
    }
    var result = await SubServices.findOne({_id : result._id}).populate('coreservice').select();
    console.log(result);
    res.send(result)
    

})


module.exports = Router