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
                 if(err){
                    return res.status(500).json(`{error:${err}}`);
                }if(!result){
                    return res.status(201).json(`{logs not exists:${err}}`);
                }
                else {
                    console.log("Get Logs Successfully");
                    return res.status(200).json(result);
                }
            });
        },

    getTypeLog(req,res){
        if(req.body.logsType){
        logs.findOne({}).where('logsType').equals(req.body.logsType).
        exec (function(err, data){
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            console.log(JSON.stringify(data.logsArr, null, 2));
            console.log("Get Logs Successfully");
            return res.status(200).send(data.logsArr);
        })
    }
    else return res.status(404).send();
    }
};


