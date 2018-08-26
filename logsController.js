const   mongoose = require('mongoose'),
        log = require('./logDataData'),
        logs = require('./logsDataData'),
        parser = require('json-parser'),
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };


module.exports={

       getAllUserLogin(){
        return logs find();
       },

       getAllrefreshErr(){
         return logs find();
       },

       getAllrefreshLogs(){
        return logs find();
       }
};