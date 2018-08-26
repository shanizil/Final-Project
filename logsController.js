const   mongoose = require('mongoose'),
        parser = require('json-parser'),
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };
var log = require('./logData');
var logs = require('./logsData');


module.exports={

        getAllLogs(){
            return logs.find();
        }

       // getAllUserLogin(){
       //  return logs.find();
       // },

       // getAllrefreshErr(){
       //   return logs.find();
       // },

       // getAllrefreshLogs(){
       //  return logs.find();
       // }
};


// Get Logs by Type (Admin Mode)
// exports.getLogs = function(req, res){
//     if(req.body.logsType){
//         Logs.findOne({}).where('logsType').equals(req.body.logsType).
//         exec (function(err, data){
//             if(err) {
//                 console.log(err);
//                 return res.status(500).send();
//             }
//            // console.log(JSON.stringify(data.logsArr, null, 2));
//             console.log("Get Logs Successfully");
//             return res.status(200).send(data.logsArr);
//         })
//     }
//     else return res.status(404).send();
// };