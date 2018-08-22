const   mongoose = require('mongoose'),
        scholarships = require('./scholarshipData'),
        parser = require('json-parser'),
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };

module.exports={

    getAllScholarships(){
        return scholarships.find();
    },

    filterScholarships(req,response){
        let choose=req.body.choose,
           location=req.body.location,
            origin=req.body.origin,
            volunteering='התנדבות',
            reservist='חייל/ת מילואים',
            veteran='חייל/ת משוחרר/ת',
            Iraq='עיראק',
            Ethiopia='אתיופיה',
            Iran='איראן',
            Russia='רוסיה',
            TheDruze='העדה הדרוזית',
            TheArabic='העדה הערבית',
            EdaHaredit='העדה החרדית',
            Yemen='תימן',
            north='צפון',
            South='דרום',
            center='מרכז',
            Samaria='שומרון',
            sharon='שרון',
            Jerusalem='ירושלים';

            if(choose=='מיקום'){
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
                origin='';
                Iraq='',
                Ethiopia='';
                Iran='';
                Russia='';
                TheDruze='';
                TheArabic='';
                EdaHaredit='';
                Yemen='';
                volunteering='';
                reservist='';
                veteran='';
            }

            else if(choose=='מוצא'){
                if (origin=='עיראק'){
                    Ethiopia='';
                    Iran='';
                    Russia='';
                    TheDruze='';
                    TheArabic='';
                    EdaHaredit='';
                    Yemen='';
                }
                else if (origin=='אתיופיה'){
                    Iraq='',
                    Iran='';
                    Russia='';
                    TheDruze='';
                    TheArabic='';
                    EdaHaredit='';
                    Yemen='';
                }
                else if (origin=='איראן'){
                    Ethiopia='';
                    Iraq='',
                    Russia='';
                    TheDruze='';
                    TheArabic='';
                    EdaHaredit='';
                    Yemen='';
                }
                else if (origin=='רוסיה'){
                    Ethiopia='';
                    Iran='';
                    Iraq='',
                    TheDruze='';
                    TheArabic='';
                    EdaHaredit='';
                    Yemen='';
                }
                else if (origin=='העדה הדרוזית'){
                    Ethiopia='';
                    Iran='';
                    Iraq='',
                    Russia='';
                    TheArabic='';
                    EdaHaredit='';
                    Yemen='';
                }
                else if (origin=='העדה הערבית'){
                    Ethiopia='';
                    Iran='';
                    Iraq='',
                    Russia='';
                    TheDruze='';
                    EdaHaredit='';
                    Yemen='';
                }
                else if (origin=='העדה החרדית'){
                    Ethiopia='';
                    Iran='';
                    Iraq='',
                    Russia='';
                    TheDruze='';
                    TheArabic='';
                    Yemen='';
                }
                else if (origin=='תימן'){
                    Ethiopia='';
                    Iran='';
                    Iraq='',
                    Russia='';
                    TheDruze='';
                    TheArabic='';
                    EdaHaredit='';
                }
                
                Jerusalem='ירושלים';
                South='';
                center='';
                Samaria='';
                sharon='';
                north='';
                location='';
                volunteering='';
                reservist='';
                veteran='';
            }

            else if(choose=='התנדבות'){
                origin='';
                Iraq='',
                Ethiopia='';
                Iran='';
                Russia='';
                TheDruze='';
                TheArabic='';
                EdaHaredit='';
                Yemen='';
                Jerusalem='ירושלים';
                South='';
                center='';
                Samaria='';
                sharon='';
                north='';
                location='';
                reservist='';
                veteran='';
            }

            else if(choose=='חייל/ת מילואים'){
                Jerusalem='ירושלים';
                South='';
                center='';
                Samaria='';
                sharon='';
                north='';
                location='';
                origin='';
                Iraq='',
                Ethiopia='';
                Iran='';
                Russia='';
                TheDruze='';
                TheArabic='';
                EdaHaredit='';
                Yemen='';
                volunteering='';
                veteran='';
            }

            else if(choose=='חייל/ת משוחרר/ת'){
                location='';
                origin='';
                Iraq='',
                Ethiopia='';
                Iran='';
                Russia='';
                TheDruze='';
                TheArabic='';
                EdaHaredit='';
                Yemen='';
                volunteering='';
                reservist='';
            }

         

        scholarships.find({$or:   [{ $or : [ {choose : location },{ location : north }, { location : South },
                                {location : center }, { location : Jerusalem }, { location : Samaria }, { location : sharon }]},
                                {$or: [{choose : origin},{ origin : Iraq }, { origin : Ethiopia },{ origin : Iran },{ origin : Russia },
                                {origin : TheDruze },{ origin : TheArabic},{ origin : EdaHaredit },{ origin : Yemen }]},
                                {choose :volunteering },
                                {choose : reservist },
                                {choose : veteran}]
                          },(err,result)=>{
                    if(err){
                        console.log ('filter error');
                    }else{
                        console.log(`filter done`);
                        return response.status(200).json(result);
                    }

                    }
        );
    }
}
