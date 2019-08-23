const config = require('config')

async function mail(to, sub, data, filename) {
    var nodemailer = require('nodemailer');
    var EmailTemplates = require('swig-email-templates');
    var path = require('path')
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {

            user: config.get('email'),
            pass: config.get('email_password')
        }
    });
    var templates = new EmailTemplates({
        root: path.join(__dirname, '/../../mail')
    });

    templates.render(filename, data, function(err, html, text, subject) {
        // Send email

        transporter.sendMail({
            from: config.get('email'),
            to: to,
            subject: sub,
            html: html,
            text: text
        } , (err , info)=>{
            console.log(err);
            console.log(info);
            
        });
 
    })

}

module.exports = mail;