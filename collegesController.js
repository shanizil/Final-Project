const   mongoose = require('mongoose'),
        Colleges = require('./collegeData'),
        LikedByUser = require('./likedByUserData'),
        RateByUser = require('./rateByUserData'),
        parser = require('json-parser'),
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };

module.exports={

    getAllInstitutes(){ //change !!!!!!!!!!!
        return Institutes.find();
    },


    rateColleges(req,response){
        console.log('rateColleges');
        RateByUser.findOne({userID : req.body.userID},(err,result)=>{
            if(err){
                console.log ('rate errorrr');
                return response.status(500).json(`{rate error:${err}}`);
            }

            if(!result){
                console.log(`rate not exsist. Create one `);            
                let newRateByUser = new RateByUser({
                    userID: req.body.userID,
                    rate: [req.body.college,req.body.numOfStars]
                });

                newRateByUser.save(
                    (err) => {
                        if (err){
                            console.log('rate error');
                            return response.status(500).json(`{rate error:${err}}`);
                        }

                       else
                           console.log('rate saved');
                           return response.status(200).json(newRateByUser);
                });
            }

            if(result){
                console.log(`rate Exsist`);
                RateByUser.findOneAndUpdate({userID: req.body.userID},
                    {$addToSet: {rate:[[req.body.college,req.body.numOfStars]]}},(err,result)=>{
                        if(err){
                            console.log ('rate error');
                            return response.status(500).json(`{rate error:${err}}`);

                        }

                        else{
                           console.log(`rate succses`);
                           return response.status(200).json(`rate succses`);
                        } 

                });
            }
        });
    },

    getFavoriteUserId(req,res){
        LikedByUser.findOne({userID : req.params._id}, (err,result)=>{
            if(err || !result){
                return res.status(500).json(`{id not exists:${err}}`);
            }
            res.json(result);
        });
    },

    favoriteColleges(req,response){
        LikedByUser.findOne({userID : req.body.userID},(err,result)=>{
            if(err){
                console.log ('errorrr');
                return response.status(500).json(`{error:${err}}`);
            }

            if(!result){
                console.log(`Sub eng not exsist. Create one `);            
                let newLikedByUser = new LikedByUser({
                    userID: req.body.userID,
                    liked: req.body.liked
                });

                newLikedByUser.save(
                    (err) => {
                        if (err){
                            console.log('error');
                            return response.status(500).json(`{error:${err}}`);

                        }

                       else
                           console.log('favorite saved');
                           return response.status(200).json(newLikedByUser);
                });
            }

            if(result){
                console.log(`Exsist`);
                LikedByUser.findOneAndUpdate({userID: req.body.userID},
                    {$addToSet: {liked:req.body.liked}},(err,result)=>{
                        if(err){
                            console.log ('error');
                            return response.status(500).json(`{error:${err}}`);

                        }

                        else{
                           console.log(`succses`);
                           return response.status(200).json(`succses`);
                        } 

                });
            }
        });
    },


    unFavoriteColleges(req,response){
        LikedByUser.findOneAndUpdate({userID: req.body.userID},
             {$pull: {liked: req.body.liked}},(err,result)=>{
                if(err){
                    console.log ('error');
                    return response.status(500).json(`{error:${err}}`);
                }

                else{
                    console.log(`succses`);
                    return response.status(200).json(`succses`);
                } 
        });
    },

    filterColleges(req,response){
        let location= req.body.location,
            subEng= req.body.subEng,
            dorms= req.body.dorms,
            uniSalary= req.body.uniSalary,
            type= req.body.institute;
        let university='אוניברסיטה',
            college='מכללה',
            north='צפון',
            South='דרום',
            center='מרכז',
            Samaria='שומרון',
            sharon='שרון',
            Jerusalem='ירושלים';
            software='הנדסת תוכנה',
            chemical='הנדסה כימית',
            electronic='הנדסת אלקטרוניקה',
            management='הנדסת תעשיה וניהול',
            building='הנדסת בניין',
            machine='הנדסת מכונות',
            medical='הנדסה רפואית',
            exsist='יש',
            without='אין',
            yesUnSalary='כן',
            noUnSalary='לא';

            if (type=='אוניברסיטה'){
                college='';
                noUnSalary='';
            }
            else if (type=='מכללה'){
                university='';
                if (uniSalary=='שכ"ל אוניברסיטאי'){
                    noUnSalary='';
                }
                else if (uniSalary=='ללא שכ"ל אוניברסיטאי'){
                    yesUnSalary='';
                }
            }

            if (dorms=='קיום מעונות'){
                without='';
            }

            else if (dorms=='ללא מעונות'){
                exsist='';
            }

            if(location=='צפון'){
                South='';
                center='';
                Samaria='';
                sharon='';
                Jerusalem='';
            }

            else if(location=='דרום'){
                north='';
                center='';
                Samaria='';
                sharon='';
                Jerusalem='';
            }

            else if(location=='מרכז'){
                South='';
                north='';
                Samaria='';
                sharon='';
                Jerusalem='';
            }
            else if(location=='שרון'){
                South='';
                center='';
                Samaria='';
                north='';
                Jerusalem='';
            }

            else if(location=='שומרון'){
                South='';
                center='';
                north='';
                sharon='';
                Jerusalem='';
            }
            else if(location=='ירושלים'){
                South='';
                center='';
                Samaria='';
                sharon='';
                north='';
            }

            if(subEng=='הנדסת תוכנה'){
                electronic='';
                chemical='';
                management='';
                medical='';
                building='';
                machine='';
            }

            else if(subEng=='הנדסת אלקטרוניקה'){
                software='';
                chemical='';
                management='';
                medical='';
                building='';
                machine='';
            }

            else if(subEng=='הנדסת בניין'){
                electronic='';
                chemical='';
                management='';
                medical='';
                software='';
                machine='';
            }
            else if(subEng=='הנדסה כימית'){
                electronic='';
                software='';
                management='';
                medical='';
                building='';
                machine='';
            }

            else if(subEng=='הנדסת מכונות'){
                electronic='';
                chemical='';
                management='';
                medical='';
                building='';
                software='';
            }

            else if(subEng=='הנדסת תעשייה וניהול'){
                electronic='';
                chemical='';
                software='';
                medical='';
                building='';
                machine='';
            }

            else if(subEng=='הנדסה רפואית'){
                electronic='';
                chemical='';
                software='';
                management='';
                building='';
                machine='';
            }

            Colleges.find({$and:[
                    { $or : [ { type : university }, { type : college } ] },
                    { $or : [ { location : north }, { location : South },
                     { location : center }, { location : Jerusalem }, { location : Samaria }, { location : sharon } ] },
                    { $or : [ { dorms : exsist }, { dorms : without } ] },                   
                    { $or : [ { subEng : software }, { subEng : chemical },
                     { subEng : electronic }, { subEng : management }, { subEng : building }, { subEng : medical }, { subEng : machine } ] }, 
                    { $or : [ { uniSalary : yesUnSalary }, { uniSalary : noUnSalary } ] },  
                ]
 
            },(err,result)=>{
                if(err){
                    console.log ('filter error');
                }

                
                else  {
                    console.log(`filter done`);
                    return response.status(200).json(result);
                }

            });
        }
};