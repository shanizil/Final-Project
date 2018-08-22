const   mongoose = require('mongoose'),
        questions = require('./questionData'),
        subEngByUser = require('./subEngByUserData'),
        parser = require('json-parser'),
        http = require('http');
var Graph = require('directed-graph');

        // Either initialize and fill an empty graph
var graphA = new Graph();

module.exports={

    allQuestion(){
        return questions.find();
    },

    getQuestionById(req,res){
        console.log(`getId()`);
        console.log(`req.params.idNum -> ${req.params.idNum}`);
        questions.findOne({
        questionId : req.params.idNum
        }, (err,result)=>{
            if(err || !result){
             //   console.log(`userName not exists -> ${err}`);
                return res.status(500).json(`{id not exists:${err}}`);
            }

            res.json(result.questionData);
        });

    },

    createSubEngByUserOrReturn(req,res){
        subEngByUser.findOne({
            userID : req.body.userID
        }, (err,result)=>{
            if(err){
                console.log ('error');
                return res.status(500).json(`{error:${err}}`);
            }

            if(!result){
                console.log(`Sub eng not exsist. Create one `);
                let userSubEng = new subEngByUser({
                userID: req.body.userID,
                software: 0,
                chemistry: 0,
                electronic: 0,
                medical: 0,
                management: 0,
                building: 0,
                machine:0
                });

                userSubEng.save(
                    (err) => {
                        if (err){
                            console.log('creat error');                      
                        }

                        else
                           console.log('user saved');
                            return res.status(201).json(userSubEng);
                        });
                //return res.status(405).json(`password is wrong`);
            }

            else{
                console.log(`Exsist`);
                return res.status(200).json(result);
            }

        });

    },

    updateSubEngWeights(req,res){
        subEngByUser.findOneAndUpdate({userID: req.body.userID},
            {$set: {chemistry: req.body.chemistry,
                    software: req.body.software,
                    electronic:req.body.electronic,
                    medical:req.body.medical, 
                    management:req.body.management,
                    building:req.body.building,
                    machine:req.body.machine}
            },
         (err,result)=>{
            if(err){
                console.log ('error');
            }

            else  {
                console.log(`succses`);
                return res.status(200).json("data update");
            }

        });
    },
        
    getUserSubEngById(req,res){
            subEngByUser.findOne({
            userID : req.body.userID
        }, (err,result)=>{
            if(err){
                console.log ('error');
                return res.status(500).json(`{error:${err}}`);
            }
            else if(!result){
                console.log ('not exsist');
                return res.status(204).json(`Sub Eng not exsist!`);
            }
            else{
                console.log(`Exsist`);
                return res.status(200).json(result);
            }

        });    
    },
        
    calculateSubEng(req,res){
        let userId = req.params.userID;
        let softwareArr=req.params.softwareArr.split(','),
            chemistryArr=req.params.chemistryArr.split(','),
            electronicArr=req.params.electronicArr.split(','),
            medicalArr=req.params.medicalArr.split(','),
            managementArr=req.params.managementArr.split(','),
            buildingArr=req.params.buildingArr.split(','),
            machineArr=req.params.machineArr.split(','),
            totalSoftware=100,
            totalChemistry=100,
            totalElectronic=100,
            totalMedical=100,
            totalManagement=100,
            totalBuilding=100,
            totalMachine=100;
            var answersArr=req.params.answers.split(',');

        console.log(userId);
        console.log(answersArr);

        for (let j=0; j<answersArr.length; j++){
            totalSoftware=totalSoftware-(softwareArr[j]*answersArr[j]);
            totalChemistry=totalChemistry-(chemistryArr[j]*answersArr[j]);
            totalElectronic=totalElectronic-(electronicArr[j]*answersArr[j]);
            totalMedical=totalMedical-(medicalArr[j]*answersArr[j]);
            totalManagement=totalManagement-(managementArr[j]*answersArr[j]);
            totalBuilding=totalBuilding-(buildingArr[j]*answersArr[j]);
            totalMachine=totalMachine-(machineArr[j]*answersArr[j]);
        }
            let userSubEng = new subEngByUser({
            userID: userId,
            software: totalSoftware,
            chemistry: totalChemistry,
            electronic: totalElectronic,
            medical: totalMedical,
            management: totalManagement,
            building: totalBuilding,
            machine:totalMachine
            });

            userSubEng.save(
                (err) => {
                    if (err){
                        console.log('creat error');                      
                    }

                    else
                       console.log('user saved');
                            res.json([totalSoftware,totalChemistry,totalElectronic,totalMedical,totalManagement,totalBuilding,totalMachine]);
                    });

    }


};
