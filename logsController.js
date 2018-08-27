const   mongoose = require('mongoose'),
        parser = require('json-parser'),
        logs = require('./logsData'),
        http = require('http');
//var log = require('./logData');


        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };


module.exports={


        getAllLogs(req,res){
            return logs.find();
        },

        getTypeLogs(req,res){
            logs.findOne({logType : req.body.type}, (err,result)=>{
                 if(err || !result){
                    return res.status(500).json(`{logs not exists:${err}}`);
                }
                else {
                    console.log("Get Logs Successfully");
                    return res.status(200).send(result);
                }
            });
        }
};


