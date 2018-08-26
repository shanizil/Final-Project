const   mongoose = require('mongoose'),
        Users = require('./usersData'),
        parser = require('json-parser'),
        nodemailer = require("nodemailer");
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };
var Log = require('./logData');
var Logs = require('./logsData');


module.exports={

    allusers(){
        return Users.find();
    }, 

    sendLog(logData, logsType){
        console.log(logData+" Save to => "+logsType);
        var newLog = new Log();
        var now = new Date();
        var id = mongoose.Types.ObjectId();
        newLog._id = id;
        newLog.logDate = dateFormat(now, "dd/mm/yyyy => HH:MM:ss");
        newLog.logData = logData;
        console.log(JSON.stringify(newLog, null, 2));
        
        // Updade Logs Collection
        Logs.update(
        { "logsType": logsType },
        { "$push": { logsArr : newLog } } ).
        exec (function(err, newLog){
            if(err) console.log(err);
            if(!newLog) console.log("Error Log");
            if(newLog) console.log("Log Saved Successfully");
        })
    },

    login(req,res){
        console.log(`login()`);
        console.log(`req.body.password -> ${req.body.password}`);
        console.log(`req.body.email -> ${req.body.email}`);

        Users.findOne({
            email : req.body.email
        }, (err,result)=>{
            if(err || !result){
                console.log ('error');
                return res.status(500).json(`{email not exists:${err}}`);
            }

            if(req.body.password!==result.password){
                console.log(`password is wrong ()`);
                return res.status(405).json(`password is wrong`);
            }

            else if((req.body.email == "admin@gmail.com" ) && (req.body.password == "admin")){
                console.log(`admin`);
                return res.status(200).json(result);
           
            }

            else  {
                console.log(`login result--->>>${result}`);
                return res.status(200).json(result);
                var logData = "user login => Email: "+req.body.email+" / Password: "+req.body.password;
                module.exports.sendLog(logData, "userLogin");
            }
        });
    },

    updateUser(req,response){
        Users.findOneAndUpdate({_id: req.body.userId},
            {$set: {firstName:req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    age:req.body.age,
                    WorkExperience:req.body.WorkExperience, 
                    gender:req.body.gender}
            },
         (err,result)=>{
            if(err){
                console.log ('error');
            }

            else {
                console.log(`succses`);
                return response.status(200).json("edit saved");
            }
        });
    },

    createUser(req,response){
        let newUser = new user({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password:req.body.password ,
            age:req.body.age,
            WorkExperience:req.body.WorkExperience,
            gender:req.body.gender,
            });

        newUser.save(
            (err) => {
                if (err){
                    console.log('creat error');
                }

               else
                   console.log('user saved');
            });

        response.json(newUser);
    },

    forgotPassword(req,res){
        console.log(`forgotPassword()`);
        console.log(`req.body.email -> ${req.body.email}`);

        Users.findOne({
            email : req.body.email
        }, (err,result)=>{
            if(err || !result){
                console.log ('error');
                return res.status(500).json(`{email not exists:${err}}`);
            }

            else  {
        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: 'tobs.c12@gmail.com', // generated ethereal user
                                pass: 'admin8*34!' // generated ethereal password
                            },
                            tls: { 
                                rejectUnauthorized: false
                                 }
                        });

                        let mailOptions = {
                            from: '"ToBsc חשבון" <tobs.c12@gmail.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: 'ToBsc סיסמא', // Subject line
                            // text: 'סיסמא?', // plain text body
                            html:`<h1 style="text-align:center;color:#cf411b">,שלום ${result.firstName}</h1>`+
                            `<p style="text-align:center;font-size:22px">סיסמתך למערכת היא: <b style="color:#84b4a7;font-size:26px">${result.password}</b></p>`+ `<br>`+
                            `<p style="text-align:right;font-size:20px;color:black">,תודה</p>`+`<p style="text-align:right;font-size:20px;color:black">ToBsc צוות חשבון</p>`  // html body
                        };
                    

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                            // Preview only available when sending through an Ethereal account
                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                        });
                console.log(`forgotPassword result--->>>${result}`);
                return res.status(200).json(result);
            }
        });    
    } 


};



// // Generic Inner Function - Send Log to DB
// exports.sendLog = function(logData, logsType){
//     console.log(logData+" Save to => "+logsType);
//     var newLog = new Log();
//     var now = new Date();
//     var id = mongoose.Types.ObjectId();
//     newLog._id = id;
//     newLog.logDate = dateFormat(now, "dd/mm/yyyy => HH:MM:ss");
//     newLog.logData = logData;
//     console.log(JSON.stringify(newLog, null, 2));
    
//     // Updade Logs Collection
//     Logs.update(
//     { "logsType": logsType },
//     { "$push": { logsArr : newLog } } ).
//     exec (function(err, newLog){
//         if(err) console.log(err);
//         if(!newLog) console.log("Error Log");
//         if(newLog) console.log("Log Saved Successfully");
//     })
// };
