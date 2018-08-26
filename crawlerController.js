// npm Initialize
var mongoose = require('mongoose');
var scrapy = require('node-scrapy');
var dateFormat = require('dateformat');
var async = require('async');
var fs = require('fs');

// Schemes
var College = require('./collegeData');
var Department = require('./departmentData');
var Log = require('./logData');
var Logs = require('./logsData');


// Daily Get Colleges Data from external Url
exports.getCollegesData = function(req, res){
    console.log("Start Get All Colleges Data...");

    let collegesArr = [];
    var colleges = [
        {
            "id": "1019560",
            "name": "shankar-school-of-engineering",
            "url": "https://limudim.psychometry.co.il/shenkar/shenkar_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&college=61"
        },{
            "id": "34969730",
            "name": "afeka-engineering-college",
            "url": "https://limudim.psychometry.co.il/afeka/requirements_afeka.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&college=7"
        },{
            "id": "1179940",
            "name": "bar-ilan-university",
            "url": "http://engineering.biu.ac.il/about",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?university=2&campus_distance=1"
        },{
            "id": "966690",
            "name": "tau-university",
            "url": "https://limudim.psychometry.co.il/tau/application-chances.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?university=4&campus_distance=1"
        },{
            "id": "33314510",
            "name": "ariel-university-center",
            "url": "https://limudim.psychometry.co.il/ariel/ariel_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?college=30&campus_distance=1"
        },{
            "id": "3049800",
            "name": "hit-holon1",
            "url": "https://limudim.psychometry.co.il/hit/ba-electronics.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?college=21&campus_distance=1"
        },{
            "id": "39340070",
            "name": "ruppin-college-technology",
            "url": "https://limudim.psychometry.co.il/ruppin/rupin_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&college=20"
        },{
            "id": "10518040",
            "name": "college-ort-braude",
            "url": "https://limudim.psychometry.co.il/braude/brauda_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?college=49&campus_distance=1"
        },{
            "id": "8149700",
            "name": "college-kinneret",
            "url": "https://limudim.psychometry.co.il/kinneret/kineret_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?college=14&campus_distance=1"
        },{
            "id": "10690120",
            "name": "technion",
            "url": "https://limudim.psychometry.co.il/technion/application-chances.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?university=39&campus_distance=1"
        },{
            "id": "6002050",
            "name": "hebrew-university",
            "url": "https://limudim.psychometry.co.il/huji/application-chances.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&university=5"
        },{
            "id": "41324290",
            "name": "jerusalem-college-engineering",
            "url": "https://limudim.psychometry.co.il/jce/azrieli_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&college=22"
        },{
            "id": "2590930",
            "name": "ben-gurion-university",
            "url": "https://limudim.psychometry.co.il/bgu/application-chances.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?university=1&campus_distance=1"
        },{
            "id": "40509770",
            "name": "engineering-college-shamoon",
            "url": "https://limudim.psychometry.co.il/sce/sami_shamun_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&college=50"
        },{
            "id": "2458940",
            "name": "sapir-academic-college",
            "url": "https://limudim.psychometry.co.il/sapir/sapir_requirements.php",
            "rentUrl": "https://www.ad.co.il/nadlanstudent?campus_distance=1&college=15"
        }   
    ]

    async.waterfall([

        function(callback) { // Get Details

            console.log("Start: A - 1");
            console.log("getDetails START!");

            var startUrl = "http://www.ilimudim.co.il/i/";

            var collegeDetails = {
                name: '.si-hd-txt > h1',
                headline: '.si-hd-txt > h3',
                description: '#generalDiv > p',
                specialization: '.academic-links > ul > li'
            };

            var currCollege = 0;
            var currIntCollege = 0;
            var collegesLen = colleges.length;

            for (var i = 0; i<collegesLen; i++) {

                let fullUrl = startUrl+colleges[i].name;

                let newCollege = new College();
                newCollege.engName = colleges[i].name;
                newCollege.reqUrl = colleges[i].url;
                newCollege.rentUrl = colleges[i].rentUrl;
                newCollege.collegeId = colleges[i].id;
                newCollege._id = colleges[i].id;

                scrapy.scrape(fullUrl, collegeDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log("Get Details: "+JSON.stringify(data, null, 4));

                    // set college details - validate + set to array
                    if(data.description&&data.name){
                        newCollege.specialization = data.specialization;
                        newCollege.description = data.description;
                        newCollege.headline = data.headline;
                        newCollege.hebName = data.name;
                        collegesArr[currIntCollege] = newCollege;
                        currIntCollege++;
                    }

                    if(currCollege==collegesLen-1) {
                        console.log("End: A - 1");
                        callback(null, "a11111");   
                    }
                    else currCollege++;
                });
            }
        },

        function(caption, callback) { // Get Address

            console.log("Start: B - 2");
            console.log("getAddress START!");

            var startUrl = "http://www.ilimudim.co.il/i/";

            var collegeDetails = {
                name: '.si-hd-txt > h1',
                info: '.search-plain td'
            };

            var currCollege = 0;
            var collegesLen = colleges.length;
            let validData = false;

            for (var i = 0; i<collegesLen; i++) {

                let fullUrl = startUrl+colleges[i].name+"#dorms";
                
                scrapy.scrape(fullUrl, collegeDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log("Get Address: "+JSON.stringify(data, null, 4));

                    // set college details + validate
                    for (var i = 0; i < collegesArr.length; i++) {
                        if((collegesArr[i].hebName == data.name)&&(data.info)){
                            // console.log("Match: "+currCollege);
                            collegesArr[i].address = data.info[5];
                            collegesArr[i].tuitionFee = data.info[1];
                            collegesArr[i].dorms = data.info[3];
                            validData = true;
                        }
                    }

                    if(currCollege==collegesLen-1) {
                        console.log("End: B - 2");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                });
            }
        },

        function(caption, callback) { // Get Phone

            console.log("Start: C - 3");
            console.log("getPhone START!");

            var startUrl = "https://www.d.co.il/";

            var collegeDetails = {
                tel: '.phone_number > a',
                link: 
                    { selector: 'link',
                      get: 'href',
                      prefix: '' }
            };

            var currCollege = 0;
            var collegesLen = colleges.length;

            for (var i = 0; i<collegesLen; i++) {

                let fullUrl = startUrl+colleges[i].id+"/8200/";
                
                scrapy.scrape(fullUrl, collegeDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log("Get Phone: "+JSON.stringify(data, null, 4));

                    let collegeId = data.link[1].split("https://www.d.co.il/").join("").split("/8200/").join("").split("/8190/").join("");

                    // set college details
                    for (var j = 0; j < collegesArr.length; j++) {
                        if((collegesArr[j].collegeId == collegeId)&&(data.tel)){
                            // console.log("Match: "+collegeId);
                            collegesArr[j].tel = data.tel;
                        }
                    }

                    if(currCollege==collegesLen-1) {
                        console.log("End: C - 3");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                });
            }
        },

        function(caption, callback) { // Get Open Days

            console.log("Start: D - 4");
            console.log("getOpenDays START!");

            var collegesLinks = [
                {
                    "id": "1019560",
                    "name": "shankar-school-of-engineering",
                    "url": "https://handesaim.shenkar.ac.il/"
                },{
                    "id": "34969730",
                    "name": "afeka-engineering-college",
                    "url": "https://www.afeka.ac.il/about-afeka/engineering-channel-information/open-day-afeka/"
                },{
                    "id": "1179940",
                    "name": "bar-ilan-university",
                    "url": "http://engineering.biu.ac.il/node/9060",
                },{
                    "id": "966690",
                    "name": "tau-university",
                    "url": "http://go.tau.org.il/campaigns/0518_openday/minisite/?BannID=8084&gclid=Cj0KCQjw0PTXBRCGARIsAKNYfG35Hy7iRB66oa3OMKh1AmoU8hOS-dOP68m4Zi_XzIKVf351lrCmRYMaAoz1EALw_wcB"
                },{
                    "id": "33314510",
                    "name": "ariel-university-center",
                    "url": "https://www.ariel.ac.il/university/newsite/openday.asp"
                },{
                    "id": "3049800",
                    "name": "hit-holon1",
                    "url": "http://www.hit.ac.il/sites/candidates/Campus/info-sessions"
                },{
                    "id": "39340070",
                    "name": "ruppin-college-technology",
                    "url": "https://www.michlalot.co.il/ruppin/open.php"
                },{
                    "id": "10518040",
                    "name": "college-ort-braude",
                    "url": "https://www.braude.ac.il/Campaign/?ref=google&type=1&gclid=Cj0KCQjw0PTXBRCGARIsAKNYfG0HuxPKWpxV6F_wsdrD2aSs76QW1NB9tVALuwb5g1H7wR1nnQ4b180aAv2JEALw_wcB"
                },{
                    "id": "8149700",
                    "name": "college-kinneret",
                    "url": "https://www.michlalot.co.il/kinneret/open.php"
                },{
                    "id": "10690120",
                    "name": "technion",
                    "url": "https://www.michlalot.co.il/pet/main.php"
                },{
                    "id": "6002050",
                    "name": "hebrew-university",
                    "url": "https://new.huji.ac.il/event/33402"
                },{
                    "id": "41324290",
                    "name": "jerusalem-college-engineering",
                    "url": "https://www.jce.ac.il/search/%D7%99%D7%95%D7%9D+%D7%A4%D7%AA%D7%95%D7%97"
                },{
                    "id": "2590930",
                    "name": "ben-gurion-university",
                    "url": "http://in.bgu.ac.il/welcome/pages/events/BGU-openday-2018.aspx"
                },{
                    "id": "40509770",
                    "name": "engineering-college-shamoon",
                    "url": "http://www.sce-ac.co.il/?lm_key=de505052e6314ad1935a419ac41fffa0&lm_form=11055&lm_supplier=1196&utm_source=g&utm_campaign=964035723&utm_medium=c&utm_content=%2B%D7%A1%D7%9E%D7%99%20%2B%D7%A9%D7%9E%D7%A2%D7%95%D7%9F%20%2B%D7%99%D7%95%D7%9D%20%2B%D7%A4%D7%AA%D7%95%D7%97&gclid=Cj0KCQjw0PTXBRCGARIsAKNYfG0he0Ysmj1px9NJml-XCyHo2tbx1IEUjHeZGppWmsucE-KwCLB4-YAaAsvjEALw_wcB"
                },{
                    "id": "2458940",
                    "name": "sapir-academic-college",
                    "url": "https://www.sapir.ac.il/content/5350"
                }

            ]

            var currCollege = 0;
            var collegesLen = collegesLinks.length;

            var shenkarDetails = {openday: '.floating-text > div > span'};
            var afekaDetails = {openday: '.articleBox > h3'};
            var barIlanDetails = {openday: 'h1'};
            var tauDetails = {openday: 'h1 > span'};
            var arielDetails = {openday: '.pnimi_text > strong'};
            var hitDetails = {openday: '.hit-align-center strong'};
            var ruppinDetails = {openday: '.page-content-wrapper-anchors-item-content > div'};
            var ortDetails = {openday: '.data-box div'};
            var kinneretDetails = {openday: '.page-content-wrapper-anchors-item-content > div > p'};
            var technionDetails = {openday: '.page-content-wrapper-anchors-item-content > div > p'};
            var hujiDetails = {openday: '.field-name-body > .field-items > .field-item > div'};
            var azrieliDetails = {openday: 'h2.entry-title'};
            var bguDetails = {openday: 'h1'};
            var sceDetails = {openday: '.marked-header > h2'};
            var sapirDetails = {openday: 'h1'};
            for (var i = 0; i<collegesLen; i++) {

                if(collegesLinks[i].name == "shankar-school-of-engineering"){
                    scrapy.scrape(collegesLinks[i].url, shenkarDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "shankar-school-of-engineering");
                    });
                }
                if(collegesLinks[i].name == "afeka-engineering-college"){
                    scrapy.scrape(collegesLinks[i].url, afekaDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "afeka-engineering-college");
                    });
                }
                if(collegesLinks[i].name == "bar-ilan-university"){
                    scrapy.scrape(collegesLinks[i].url, barIlanDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "bar-ilan-university");
                    });
                }
                if(collegesLinks[i].name == "tau-university"){
                    scrapy.scrape(collegesLinks[i].url, tauDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "tau-university");
                    });
                }
                if(collegesLinks[i].name == "ariel-university-center"){
                    scrapy.scrape(collegesLinks[i].url, arielDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "ariel-university-center");
                    });
                }
                if(collegesLinks[i].name == "hit-holon1"){
                    scrapy.scrape(collegesLinks[i].url, hitDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "hit-holon1");
                    });
                }
                if(collegesLinks[i].name == "ruppin-college-technology"){
                    scrapy.scrape(collegesLinks[i].url, ruppinDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "ruppin-college-technology");
                    });
                }
                if(collegesLinks[i].name == "college-ort-braude"){
                    scrapy.scrape(collegesLinks[i].url, ortDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "college-ort-braude");
                    });
                }
                if(collegesLinks[i].name == "college-kinneret"){
                    scrapy.scrape(collegesLinks[i].url, kinneretDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "college-kinneret");
                    });
                }
                if(collegesLinks[i].name == "technion"){
                    scrapy.scrape(collegesLinks[i].url, technionDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "technion");
                    });
                }
                if(collegesLinks[i].name == "hebrew-university"){
                    scrapy.scrape(collegesLinks[i].url, hujiDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "hebrew-university");
                    });
                }
                if(collegesLinks[i].name == "jerusalem-college-engineering"){
                    scrapy.scrape(collegesLinks[i].url, azrieliDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[1], "jerusalem-college-engineering");
                    });
                }
                if(collegesLinks[i].name == "ben-gurion-university"){
                    scrapy.scrape(collegesLinks[i].url, bguDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "ben-gurion-university");
                    });
                }
                if(collegesLinks[i].name == "engineering-college-shamoon"){
                    scrapy.scrape(collegesLinks[i].url, sceDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "engineering-college-shamoon");
                    });
                }
                if(collegesLinks[i].name == "sapir-academic-college"){
                    scrapy.scrape(collegesLinks[i].url, sapirDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "sapir-academic-college");
                    });
                }
            }

            function saveOpenDay(openday, collegeName){
                if(openday){
                    // set college details
                    for (var j = 0; j < collegesArr.length; j++) {
                        if(collegesArr[j].engName == collegeName){
                            // console.log(collegeName+" Match!");
                            collegesArr[j].openday = openday;
                        }
                    }
                    // console.log(collegeName+": "+openday);
                    if(currCollege==collegesLen-1) {
                        console.log("End: D - 4");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                }
                else {
                    // set college details
                    for (var j = 0; j < collegesArr.length; j++) {
                        if(collegesArr[j].engName == collegeName){
                            // console.log(collegeName+" Match!");
                            collegesArr[j].openday = "לא ידוע";
                            var logData = "unknown openday => "+collegesArr[j].engName;
                            exports.sendLog(logData, "refreshErr");
                        }
                    }
                    // console.log(collegeName+": unknown");
                    if(currCollege==collegesLen-1) {
                        console.log("End: D - 4");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                }
            }
        },

        function(caption, callback) { // Get Rents

            console.log("Start: F - 6");
            console.log("getRents START!");

            var collegeDetails = { 
                maintainers: { 
                    selector: '.dropdown-menu > li:nth-child(2) > a',
                    get: 'href',
                    prefix: '' 
                },
                rent: '.box-price'
            };

            var currCollege = 0;
            var collegesLen = colleges.length;
            var numOfRents = 10;

            for (var i = 0; i<collegesLen; i++) {
                scrapy.scrape(colleges[i].rentUrl, collegeDetails, function(err, data) {
                    if (err) {
                        currCollege++;
                        console.error(err);
                    }
                    console.log("Get Rents: "+JSON.stringify(data, null, 2));                    
                    let totalRents = 0;
                    let rentsCounter = 0;
                    for (var j = 0; j < numOfRents; j++) {
                        // console.log("Final num : "+data.rent[j].substring(0, data.rent[j].length-2).replace(",", ""));
                        if(Number(data.rent[j].substring(0, data.rent[j].length-2).replace(",", ""))<200){
                            // console.log("Fake rent price");
                        }
                        else {
                            totalRents += Number(data.rent[j].substring(0, data.rent[j].length-2).replace(",", ""));
                            rentsCounter++;
                        }
                        if(j==numOfRents-1){
                            saveAverage(totalRents/rentsCounter, data.maintainers.substring(0, data.maintainers.length-11));
                        }
                    }
                    if(currCollege==collegesLen-1) {
                        console.log("End: F - 6");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                });
            }

            function saveAverage(averageRent, collegeUrl){
                if(averageRent){
                    // set college details
                    for (var j = 0; j < colleges.length; j++) {
                        if(colleges[j].rentUrl == collegeUrl){
                            console.log(collegeUrl+" Match!");
                            // colleges[j].averageRents = averageRent;
                            var now = new Date();
                            var history = {
                                date: dateFormat(now, "dd/mm/yyyy"),
                                time: dateFormat(now, "HH:MM:ss"),
                                averagePrice: averageRent
                            }
                            College.update(
                              { "engName": colleges[j].name },
                              { "$push": { "averageRents" : history } } ).
                                exec (function(err, newProduct){
                                    if(err) console.log(err);
                                    if(!newProduct) console.log("Error Save College Rents");
                                    console.log("New Average Price ("+averageRent+") Saved Successfully in the College's History");
                            })
                        }
                    }
                }
                else {
                    // set college details
                    for (var j = 0; j < colleges.length; j++) {
                        if(collegesArr[j].rentUrl == collegeUrl){
                            console.log(collegeUrl+" Match Unknown !");
                            // colleges[j].averageRent = "לא ידוע";
                        }
                    }
                }
            }
        },

        function(caption, callback) { // Get Requirements

            console.log("Start: G - 7");
            console.log("getRequirements START!");

            var currCollege = 0;
            var collegesLen = colleges.length;

            // all colleges models

            // shenkar, hit, ort, technion, azrieli
            var modelCollege1 = {requirements: 'div#customers-page-contents > div > ul > li'};
            // sce, ariel, ruppin, sapir
            var modelCollege2 = {requirements: 'div#customers-page-contents > ul > li'};
            var barIlanDetails = {requirements: '.rtejustify'};
            var kinneretDetails = {requirements: 'div#customers-page-contents > ul'};
            var afekaDetails = {
                title: 'div#customers-page-contents > span > span span',
                requirements: 'div#customers-page-contents'
            };
            var hujiDetails = {
                title: 'div#customers-page-contents > div > span',
                requirements: 'div#customers-page-contents > div'
            };
            var bguDetails = {
                requirements: 'div#customers-page-contents > ul > li',
                title: 'div#customers-page-contents > div > strong',
                grades: 'div#customers-page-contents > div'
            };
            var tauDetails = {
                requirements: 'div#customers-page-contents > ul > li',
                grades: 'div#customers-page-contents > div'
            };

            for (var i = 0; i<collegesLen; i++) {

                if(colleges[i].name == "shankar-school-of-engineering"){
                    scrapy.scrape(colleges[i].url, modelCollege1, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqStr = data.requirements.join(" ");
                            var mathGrades = getMath(reqStr, "shankar-school-of-engineering", "math");
                            var engGrades = getMath(reqStr, "shankar-school-of-engineering", "english");
                            var physicsGrades = getMath(reqStr, "shankar-school-of-engineering", "physics");
                            var psyGrade = getPsychometric(reqStr, "shankar-school-of-engineering");
                            return saveRequirements(data.requirements, psyGrade, mathGrades, engGrades, physicsGrades, "shankar-school-of-engineering");
                        }
                    });
                }
                if(colleges[i].name == "afeka-engineering-college"){
                    scrapy.scrape(colleges[i].url, afekaDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqArray = [];
                            for (var i = 0; i < data.title.length; i++) {
                                let tmpData = data.requirements.split(data.title[i]);
                                if(i<data.title.length-1){
                                    tmpData = tmpData[1].split(data.title[i+1]);
                                    reqArray.push(data.title[i]+": "+tmpData[0]);
                                }
                                else reqArray.push(data.title[i]+": "+tmpData[1]);
                            }
                            var mathGrades = getMath(data.requirements, "afeka-engineering-college", "math");
                            var engGrades = getMath(data.requirements, "afeka-engineering-college", "english");
                            var physicsGrades = getMath(data.requirements, "afeka-engineering-college", "physics");
                            var psyGrade = getPsychometric(data.requirements, "afeka-engineering-college");
                            return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "afeka-engineering-college");
                        } 
                    });
                }
                if(colleges[i].name == "bar-ilan-university"){
                    scrapy.scrape(colleges[i].url, barIlanDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var mathGrades = getMath(data.requirements[2], "bar-ilan-university", "math");
                            var engGrades = getMath(data.requirements[2], "bar-ilan-university", "english");
                            var physicsGrades = getMath(data.requirements[2], "bar-ilan-university", "physics");
                            var psyGrade = getPsychometric(data.requirements[2], "bar-ilan-university");
                            return saveRequirements(data.requirements[2], psyGrade, mathGrades, engGrades, physicsGrades, "bar-ilan-university");
                        }
                    });
                }
                if(colleges[i].name == "tau-university"){
                    scrapy.scrape(colleges[i].url, tauDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqStr = data.requirements.join(" ");
                            var tmpData = data.grades[1].split("הנדסה מכנית");
                            var mathGrades = getMath(tmpData[1], "tau-university", "math");
                            var engGrades = getMath(reqStr, "tau-university", "english");
                            var physicsGrades = getMath(reqStr, "tau-university", "physics");
                            var psyGrade = getPsychometric(tmpData[1]+tmpData[2], "tau-university");
                            return saveRequirements(data.requirements, psyGrade, mathGrades, engGrades, physicsGrades, "tau-university");
                        } 
                    });
                }
                if(colleges[i].name == "ariel-university-center"){
                    scrapy.scrape(colleges[i].url, modelCollege2, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqArray = data.requirements.splice(0, 9);
                            var reqStr = reqArray.join(" ");
                            var mathGrades = getMath(reqStr, "ariel-university-center", "math");
                            var engGrades = getMath(reqStr, "ariel-university-center", "english");
                            var physicsGrades = getMath(reqArray[2], "ariel-university-center", "physics");
                            var psyGrade = getPsychometric(reqStr, "ariel-university-center");
                            return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "ariel-university-center");
                        } 
                    });
                }
                if(colleges[i].name == "hit-holon1"){
                    scrapy.scrape(colleges[i].url, modelCollege1, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqStr = data.requirements.join(" ");
                            var mathGrades = getMath(reqStr, "hit-holon1", "math");
                            var engGrades = getMath(reqStr, "hit-holon1", "english");
                            var physicsGrades = getMath(reqStr, "hit-holon1", "physics");
                            var psyGrade = getPsychometric(reqStr, "hit-holon1");
                            return saveRequirements(data.requirements, psyGrade, mathGrades, engGrades, physicsGrades, "hit-holon1");
                        } 
                    });
                }
                if(colleges[i].name == "ruppin-college-technology"){
                    scrapy.scrape(colleges[i].url, modelCollege2, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqArray = data.requirements.splice(0, 4);
                            var reqStr = reqArray.join(" ");
                            var mathGrades = getMath(reqStr, "ruppin-college-technology", "math");
                            var engGrades = getMath(reqStr, "ruppin-college-technology", "english");
                            var physicsGrades = getMath(reqArray[2], "ruppin-college-technology", "physics");
                            var psyGrade = getPsychometric(reqStr, "ruppin-college-technology");
                            return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "ruppin-college-technology");
                        } 
                    });
                }
                if(colleges[i].name == "college-ort-braude"){
                    scrapy.scrape(colleges[i].url, modelCollege1, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqArray = data.requirements.splice(0, 5);
                            var reqStr = reqArray.join(" ");
                            var mathGrades = getMath(reqStr, "college-ort-braude", "math");
                            var engGrades = getMath(reqStr, "college-ort-braude", "english");
                            var physicsGrades = getMath(reqStr, "college-ort-braude", "physics");
                            var psyGrade = getPsychometric(reqStr, "college-ort-braude");
                            return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "college-ort-braude");
                        } 
                    });
                }
                if(colleges[i].name == "college-kinneret"){
                    scrapy.scrape(colleges[i].url, kinneretDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var mathGrades = getMath(data.requirements[2], "college-kinneret", "math");
                            var engGrades = getMath(data.requirements[0], "college-kinneret", "english");
                            var physicsGrades = getMath(data.requirements[0], "college-kinneret", "physics");
                            var psyGrade = getPsychometric(data.requirements[2], "college-kinneret");
                            return saveRequirements(data.requirements[0], psyGrade, mathGrades, engGrades, physicsGrades, "college-kinneret");
                        } 
                    });
                }
                if(colleges[i].name == "technion"){
                    scrapy.scrape(colleges[i].url, modelCollege1, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            // console.log("technion ==> "+JSON.stringify(data, null, 4));
                            var reqStr = data.requirements.join(" ");
                            var mathGrades = getMath(reqStr, "technion", "math");
                            var engGrades = getMath(data.requirements[4], "technion", "english");
                            var physicsGrades = getMath(reqStr, "technion", "physics");
                            var psyGrade = getPsychometric(reqStr, "technion");
                            return saveRequirements(data.requirements, psyGrade, mathGrades, engGrades, physicsGrades, "technion");
                        } 
                    });
                }
                if(colleges[i].name == "hebrew-university"){
                    scrapy.scrape(colleges[i].url, hujiDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqStr = data.requirements[1].replace(data.title, data.title+": ");
                            var mathGrades = getMath(reqStr, "hebrew-university", "math");
                            var engGrades = getMath(reqStr, "hebrew-university", "english");
                            var physicsGrades = getMath(reqStr, "hebrew-university", "physics");
                            var psyGrade = getPsychometric(data.requirements[1], "hebrew-university");
                            return saveRequirements(reqStr, psyGrade, mathGrades, engGrades, physicsGrades, "hebrew-university");
                        }
                    });
                }
                if(colleges[i].name == "jerusalem-college-engineering"){
                    scrapy.scrape(colleges[i].url, modelCollege1, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqStr = data.requirements.join(" ");
                            var mathGrades = getMath(reqStr, "jerusalem-college-engineering", "math");
                            var engGrades = getMath(reqStr, "jerusalem-college-engineering", "english");
                            var physicsGrades = getMath(reqStr, "jerusalem-college-engineering", "physics");
                            var psyGrade = getPsychometric(reqStr, "jerusalem-college-engineering");
                            return saveRequirements(data.requirements, psyGrade, mathGrades, engGrades, physicsGrades, "jerusalem-college-engineering");
                        } 
                    });
                }
                if(colleges[i].name == "ben-gurion-university"){
                    scrapy.scrape(colleges[i].url, bguDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqArray = data.requirements.splice(0, 10);
                            var reqStr = reqArray.join(" ");

                            for (var i = data.title.length-1; i > 0; i--) {
                                if(data.title[i-1].indexOf("הנדסת")){
                                    var tmpData = data.grades[2].split(data.title[i])[0];
                                    var grades = tmpData.split(data.title[i-1])[1];
                                    var mathGrades = getMath(grades, "ben-gurion-university", "math");
                                    var engGrades = getMath(reqStr, "ben-gurion-university", "english");
                                    var physicsGrades = getMath(reqStr, "ben-gurion-university", "physics");
                                    var psyGrade = getPsychometric(grades, "ben-gurion-university");
                                    return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "ben-gurion-university");
                                }
                            }
                        } 
                    });
                }
                if(colleges[i].name == "engineering-college-shamoon"){
                    scrapy.scrape(colleges[i].url, modelCollege2, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            var reqArray = data.requirements.splice(0, 4);
                            var reqStr = reqArray.join(" ");
                            var mathGrades = getMath(reqStr, "engineering-college-shamoon", "math");
                            var engGrades = getMath(reqStr, "engineering-college-shamoon", "english");
                            var physicsGrades = getMath(reqStr, "engineering-college-shamoon", "physics");
                            var psyGrade = getPsychometric(reqStr, "engineering-college-shamoon");
                            return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "engineering-college-shamoon");
                        } 
                    });
                }
                if(colleges[i].name == "sapir-academic-college"){
                    scrapy.scrape(colleges[i].url, modelCollege2, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else {
                            console.log("SAPIR: "+JSON.stringify(data, null, 4));
                            var reqArray = data.requirements.splice(26, 4);
                            var reqStr = reqArray.join(" ");
                            // var reqArray = data.requirements[5];
                            console.log("reqStr: "+reqStr);
                            // var reqStr = reqArray.join(" ");
                            var mathGrades = getMath(reqArray[2], "sapir-academic-college", "math");
                            var engGrades = getMath(reqArray[1], "sapir-academic-college", "english");
                            var physicsGrades = getMath(reqStr, "sapir-academic-college", "physics");
                            var psyGrade = getPsychometric(reqStr, "sapir-academic-college");
                            return saveRequirements(reqArray, psyGrade, mathGrades, engGrades, physicsGrades, "sapir-academic-college");
                        } 
                    });
                }               
            }

            function saveRequirements(requirements, psychometry, mathGrades, engGrades, physicsGrades, collegeName){
                // set college details
                for (var j = 0; j < collegesArr.length; j++) {
                    if(collegesArr[j].engName == collegeName){
                        if(requirements) collegesArr[j].requirements = requirements;
                        else collegesArr[j].requirements = "Unknown";
                        collegesArr[j].psychometry = psychometry;
                        collegesArr[j].mathGrades = mathGrades;
                        collegesArr[j].engGrades = engGrades;
                        collegesArr[j].physicsGrades = physicsGrades;
                    }
                }
                if(currCollege==collegesLen-1) {
                    console.log("End: G - 7");
                    callback(null, "a33333");   
                }
                else currCollege++;
            }

            function getPsychometric(reqStr, collegeName){
                var numPreWords = 14;
                var numPostWords = 14;
                let tmpStr = reqStr.indexOf("פסיכומטרי");
                if(tmpStr==-1) {
                    return "Unknown";
                } 
                else {
                    let cutStr = reqStr.split("פסיכומטרי");
                    let beforeStr = cutStr[0].split(" ");
                    let afterStr = cutStr[1].split(" ");

                    for (var i = 1; i < numPreWords; i++) {
                        if((isNaN(afterStr[i]))&&(afterStr[i]!="")){
                            // console.log("not a number");
                        }
                        else {
                            if(Number(afterStr[i])>200) 
                                return afterStr[i];
                        }
                    }
                    for (var i = 0; i < numPostWords; i++) {
                        if(isNaN(beforeStr[beforeStr.length-i-2])){
                            if(i==numPostWords-1)
                                // The string "Psychometric" was found - but not the grade
                                return 1;
                        }
                        else {
                            if(Number(beforeStr[beforeStr.length-i-2])>200) 
                                return beforeStr[beforeStr.length-i-2];
                        }
                    }
                }
            }

            function getMath(reqStr, collegeName, subject){
                let gradesArray = [];
                var numPreWords = 20;
                var numPostWords = 3;
                let keyword;
                let keyword2;

                if(subject=="math") keyword = "מתמטיקה";
                if(subject=="english") keyword = "אנגלית";
                if(subject=="physics") {
                    keyword = "פיזיקה";
                    numPreWords = 10;
                    numPostWords = 10;
                } 
                if(subject=="physics2") {
                    keyword = "פיסיקה";
                    numPreWords = 10;
                    numPostWords = 4;
                } 

                let tmpStr = reqStr.indexOf(keyword);
                if(tmpStr==-1) {
                    if(subject=="physics") return getMath(reqStr, collegeName, "physics2");

                    // console.log("Get Math of college: "+collegeName);
                    // console.log(subject+" NOT found in college !!");
                    gradesArray.push(new Object({"units": 0, "grade": 1}));
                    return gradesArray;
                } 
                else {
                    let cutStr = reqStr.replace(/-/ig, " ").replace(/\//g," ").replace(/\(|\)/g, "").replace(/\:/g, "").split(keyword);
                    let beforeStr = cutStr[0].split(" ");
                    let afterStr;

                    gradesArray.push(new Object({"units": 0, "grade": 1}));
                    gradesArray.push(new Object({"units": 0, "grade": 1}));

                    let gradesCounter = 0;
                    let unitsCounter = 0;

                    let joinStr = cutStr[1].concat(cutStr[2]);
                    afterStr = joinStr.split(" ");

                    // console.log("beforeStr"+beforeStr);
                    // console.log("afterStr"+afterStr);
                    // console.log("Get Subject: "+subject+" of college: "+collegeName);
                    
                    for (var i = 0; i < numPostWords; i++) {
                        if(isNaN(beforeStr[beforeStr.length-i-2])){
                            if(i==numPostWords-1){
                                // console.log("MATHMATICA NUMBER found - but not grade");
                            }
                        }
                        else {
                            if((Number(beforeStr[beforeStr.length-i-2])>10)&&(Number(beforeStr[beforeStr.length-i-2])<101)) {
                                // console.log(subject+" GRADE NUMBER :"+beforeStr[beforeStr.length-i-2]);
                                // console.log("gradesCounter : "+gradesCounter);
                                if((gradesCounter<2)&&((subject!="english"))){
                                    gradesArray[gradesCounter].grade = (Number(beforeStr[beforeStr.length-i-2]));
                                    gradesCounter++;
                                }   
                            }
                            else if((Number(beforeStr[beforeStr.length-i-2])<10)&&(Number(beforeStr[beforeStr.length-i-2])>2)) {
                                // console.log(subject+" UNITS NUMBER :"+beforeStr[beforeStr.length-i-2]);
                                // console.log("unitsCounter : "+unitsCounter);
                                if(unitsCounter<2) {
                                    gradesArray[unitsCounter].units = (Number(beforeStr[beforeStr.length-i-2]));
                                    unitsCounter++;
                                }
                            }
                        }
                    }

                    for (var i = 1; i < numPreWords; i++) {
                        if((isNaN(afterStr[i]))&&(afterStr[i]!="")){
                            // console.log("not a number");
                        }
                        else {
                            if((Number(afterStr[i])>10)&&(Number(afterStr[i])<101)) {
                                // console.log(subject+" GRADE NUMBER :"+afterStr[i]);
                                // console.log("gradesCounter : "+gradesCounter);
                                if(gradesCounter<2) {
                                    gradesArray[gradesCounter].grade = (Number(afterStr[i]));
                                    gradesCounter++;
                                }
                            }
                            else if((Number(afterStr[i])<10)&&(Number(afterStr[i])>2)) {
                                // console.log(subject+" UNITS NUMBER :"+afterStr[i]);
                                // console.log("unitsCounter : "+unitsCounter);
                                if(unitsCounter<2) {
                                    gradesArray[unitsCounter].units = (Number(afterStr[i]));
                                    unitsCounter++;
                                }
                            }
                        }
                        // last call - check & validate
                        if(i==numPreWords-1) {
                            if(gradesArray[0].grade&&gradesArray[0].units=="Unknown"){
                                var emptyArray = [];
                                emptyArray.push(new Object({"units": "Unknown"}));
                                return emptyArray;
                            }
                            if(gradesArray[1].grade&&gradesArray[1].units!="Unknown"){
                                console.log("FINISH => "+JSON.stringify(gradesArray, null, 2));
                                return gradesArray;
                            }
                            else { 
                                console.log("NOT GRADEEE ");
                                console.log("FINISH => "+JSON.stringify(gradesArray, null, 2));
                                return gradesArray.splice(0,1);
                            }
                        }
                    }
                }
            }
        },

    ],  
    function (err) {
        console.log("Save Json START!");
        var json = JSON.stringify(collegesArr, null, 2);
        // console.log(json);
        fs.writeFile('colleges.json', json, 'utf8', function(){            
            console.log("Save Json is finished!");
        });

        // PreProcess - Create Colleges
        // for (var i = 0; i < collegesArr.length; i++) {
        //  collegesArr[i].save(function(err, newCollege){
        //      if(err){
        //          console.log(err);
        //      }
        //      else {
        //          console.log("Create College successfully : "+newCollege.engName);
        //          // console.log("Department => "+JSON.stringify(newDepartment, null, 4));
        //      }
        //  })
        // }

        var logData = "Refresh Colleges finished successfully !";
        exports.sendLog(logData, "refreshLogs");

        // Update College + validate
        for (var i = 0; i < collegesArr.length; i++) {
            if(collegesArr[i].address&&collegesArr[i].hebName&&collegesArr[i].tel&&collegesArr[i].psychometry){
                College.update(
                { "engName": collegesArr[i].engName },
                { "$set": { 
                    engName:  collegesArr[i].engName, 
                    hebName: collegesArr[i].hebName,
                    headline: collegesArr[i].headline, 
                    address: collegesArr[i].address,
                    tuitionFee: collegesArr[i].tuitionFee,
                    dorms: collegesArr[i].dorms,
                    tel: collegesArr[i].tel,
                    openday: collegesArr[i].openday,
                    description: collegesArr[i].description,
                    requirements: collegesArr[i].requirements,
                    specialization: collegesArr[i].specialization,
                    reqUrl: collegesArr[i].reqUrl,

                    // scholarships: collegesArr[i].scholarships,
                    psychometry: collegesArr[i].psychometry,
                    mathGrades: collegesArr[i].mathGrades,
                    engGrades: collegesArr[i].engGrades,
                    physicsGrades: collegesArr[i].physicsGrades
                }}).
                exec (function(err, newCollege){
                    if(err){
                        console.log(err);
                    }
                    if(newCollege){
                        console.log("College Updated successfully");
                    }
                })
            }
            else {
                console.log("Error Parse Some Details - "+collegesArr[i].engName);
                console.log("College Not Updated - Log to admin");
            }
        }

        // Check & validate 
        for (var i = 0; i < colleges.length; i++) {
            let checkValid = false;
            for (var j = 0; j < collegesArr.length; j++) {
                if(collegesArr[j].engName==colleges[i].name){
                    // console.log("Match");
                    checkValid = true;

                }
                if((j==collegesArr.length-1)&&(!checkValid)){
                    var logData = "Refresh Colleges Err => "+colleges[i].name;
                    exports.sendLog(logData, "refreshErr");
                }
            }
        }
    });
};

// Daily Get Colleges Data from external Url
exports.getDepartmentsData = function(req, res){
    console.log("Start Get All Departments Data...");

    let departmentsArr = [];
    var departments = [
        {
            "id": "1019560",
            "name": "management-industry",
            "url": "https://limudim.psychometry.co.il/ba/management-industry.php"
        },{
            "id": "34969730",
            "name": "mechanics",
            "url": "https://limudim.psychometry.co.il/ba/mechanics.php"
        },{
            "id": "1179940",
            "name": "software",
            "url": "https://limudim.psychometry.co.il/ba/software-engineering.php",
        },{
            "id": "966690",
            "name": "medicine",
            "url": "https://limudim.psychometry.co.il/ba/medicine.php"
        },{
            "id": "33314510",
            "name": "civil",
            "url": "https://limudim.psychometry.co.il/ba/civil-engineering.php"
        },{
            "id": "3049800",
            "name": "chemical",
            "url": "https://limudim.psychometry.co.il/ba/chemical-engineering.php"
        },{
            "id": "39340070",
            "name": "electronics",
            "url": "https://limudim.psychometry.co.il/ba/%D7%94%D7%A0%D7%93%D7%A1%D7%AA-%D7%90%D7%9C%D7%A7%D7%98%D7%A8%D7%95%D7%A0%D7%99%D7%A7%D7%94"
        }   
    ]

    async.waterfall([

        function(callback) { // Get Details

            console.log("Start: A - 1");
            console.log("getDetails START!");

            var departmentDetails = {
                name: '.page-content-title > h1',
                description: '#article-wrapper-data > .item'
            };

            var currDepartment = 0;

            for (var i = 0; i<departments.length; i++) {

                let newDepartment = new Department();
                newDepartment.engName = departments[i].name;
                newDepartment._id = departments[i].id;

                scrapy.scrape(departments[i].url, departmentDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log(currDepartment+" => "+JSON.stringify(data, null, 2));

                    // set college details
                    newDepartment.hebName = data.name[0].split("תואר ראשון ב").join("");
                    newDepartment.description = data.description[0].split("למידע נוסף על תנאי הקבלה לתואר ראשון בהנדסת תעשייה וניהול לחצו כאן").join("")
                    .split("למידע נוסף על תנאי הקבלה ללימודי תואר ראשון בהנדסת מכונות לחצו כאן").join("")
                    .split("למידע על תנאי הקבלה לתואר ראשון בהנדסת תוכנה לחצו כאן").join("")
                    .split("למידע על תנאי הקבלה לתואר ראשון בהנדסה אזרחית לחצו כאן.").join("")
                    .split("למידע על תנאי הקבלה ללימודי תואר ראשון בהנדסה כימית, לחצו כאן").join("");

                    // set requirements offset by department
                    let requireOffset = 7;
                    if((newDepartment.hebName=="הנדסת אלקטרוניקה")||(newDepartment.hebName=="הנדסה כימית")) requireOffset = 5;
                    else if(newDepartment.hebName=="הנדסה רפואית") requireOffset = 6;   
                    newDepartment.requirements = data.description[requireOffset].split("מידע נוסף ניתן למצוא בקישור תנאי קבלה - הנדסת תעשייה וניהול.").join("")
                    .split("מידע נוסף ניתן למצוא בקישור המצורף תנאי קבלה - לימודי הנדסה כימית.").join("")
                    .split("מידע נוסף ניתן למצוא בקישור הבא תנאי קבלה - הנדסת מכונות.").join("")
                    .split("מידע נוסף ניתן למצוא בקישור המצורף תנאי קבלה - לימודי הנדסת תוכנה.").join("")
                    .split("מידע נוסף ניתן למצוא בקישור הבא תנאי קבלה - הנדסת בניין.").join("");

                    // set requirements offset by subjects
                    let subjectOffset = 3;
                    if(newDepartment.hebName=="הנדסת אלקטרוניקה") subjectOffset = 2;    
                    newDepartment.subjects = data.description[subjectOffset];

                    departmentsArr[currDepartment] = newDepartment;

                    if(currDepartment==departments.length-1) {
                        console.log("End: A - 1");
                        callback(null, "a11111");   
                    }
                    else currDepartment++;
                });
            }
        },

        function(caption, callback) { // Get Salary

            console.log("Start: B - 2");
            console.log("getSalary START!");

            var salaryUrl = "https://www.universities-colleges.org.il/%D7%A9%D7%9B%D7%A8-%D7%9E%D7%94%D7%A0%D7%93%D7%A1%D7%99%D7%9D/";
            
            var salaryDetails = {
                td: '.MsoNormalTable td'
            };

            scrapy.scrape(salaryUrl, salaryDetails, function(err, data) {
                if (err) {
                    console.error(err);
                    callback(null, "a33333");
                }
                else {
                    // console.log(JSON.stringify(data, null, 2));

                    saveSalary(data.td[4].split(" � �����").join(""), data.td[5].split(" � �����").join(""), "software");
                    saveSalary(data.td[10].split(" � �����").join(""), data.td[11].split(" � �����").join(""), "management-industry");
                    saveSalary(data.td[16].split(" � �����").join(""), data.td[17].split(" � �����").join(""), "chemical");
                    saveSalary(data.td[25].split(" � �����").join(""), data.td[26].split(" � �����").join(""), "medicine");
                    saveSalary(data.td[28].split(" � �����").join(""), data.td[29].split(" � �����").join(""), "electronics");
                    saveSalary(data.td[37].split(" � �����").join(""), data.td[38].split(" � �����").join(""), "civil");
                    saveSalary(data.td[49].split(" � �����").join(""), data.td[50].split(" � �����").join(""), "mechanics");

                    console.log("End: B - 2");
                    callback(null, "a33333");   
                }
            });

            function saveSalary(lowSalary, highSalary, depName){
                if((lowSalary)&&(highSalary)){
                    // set department salary
                    for (var j = 0; j < departmentsArr.length; j++) {
                        if(departmentsArr[j].engName == depName){
                            // console.log(depName+" Match!");
                            departmentsArr[j].lowSalary = lowSalary;
                            departmentsArr[j].highSalary = highSalary;
                        }
                    }
                }
                else {
                    departmentsArr[j].lowSalary = "Unknown";
                    departmentsArr[j].highSalary = "Unknown";
                }
            }
        },

    ],  
    function (err) {
        console.log("Save Json START!");
        var json = JSON.stringify(departmentsArr, null, 2);
        // console.log(json);
        fs.writeFile('data/departments.json', json, 'utf8', function(){         
            console.log("Save Json is finished!");
        });

        // PreProcess - Create Departments
        // for (var i = 0; i < departmentsArr.length; i++) {
        //  departmentsArr[i].save(function(err, newDepartment){
        //      if(err){
        //          console.log(err);
        //      }
        //      else {
        //          console.log("Create Department successfully : "+newDepartment.engName);
        //          // console.log("Department => "+JSON.stringify(newDepartment, null, 4));
        //      }
        //  })
        // }


        var logData = "Refresh Departments finished successfully !";
        exports.sendLog(logData, "refreshLogs");

        // Update Department
        for (var i = 0; i < departmentsArr.length; i++) {
            if(departmentsArr[i].hebName&&departmentsArr[i].lowSalary&&departmentsArr[i].requirements){
                Department.update(
                { "engName": departmentsArr[i].engName },
                { "$set": { 
                    engName:  departmentsArr[i].engName, 
                    hebName: departmentsArr[i].hebName,
                    description: departmentsArr[i].description, 
                    requirements: departmentsArr[i].requirements,
                    subjects: departmentsArr[i].subjects,
                    lowSalary: departmentsArr[i].lowSalary,
                    highSalary: departmentsArr[i].highSalary
                }}).
                exec (function(err, newDepartment){
                    if(err){
                        console.log(err);
                    }
                    if(newDepartment){
                        console.log("Department Updated successfully");
                    }
                })
            }
            else {
                console.log("Error Parse Some Details - "+departmentsArr[i].engName);
                console.log("Department Not Updated - Log to admin");
            }
        }


        // Check & validate 
        for (var i = 0; i < departments.length; i++) {
            let checkValid = false;
            for (var j = 0; j < departmentsArr.length; j++) {
                if(departmentsArr[j].engName==departments[i].name){
                    // console.log("Match");
                    checkValid = true;

                }
                if((j==departmentsArr.length-1)&&(!checkValid)){
                    var logData = "Refresh Department Err => "+departments[i].name;
                    exports.sendLog(logData, "refreshErr");
                }
            }
        }

    });
};

exports.getAllColleges = function(req,res){
    return College.find();
}
exports.getAllDepartments = function(req,res){
    return Department.find();
}


// Generic Inner Function - Send Log to DB
exports.sendLog = function(logData, logsType){
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
};


// var logData = "Admin Login => Email: "+req.body.email+" / Password: "+req.body.password;
// exports.sendLog(logData, "adminLogin");

// var logData = "Designer Login => Email: "+req.body.email+" / Password: "+req.body.password;
// exports.sendLog(logData, "designerLogin");

// var logData = "User Login => Email: "+req.body.email+" / Password: "+req.body.password;
// exports.sendLog(logData, "userLogin");

// var logData = "New Designer => "+savedUser.name+" created Successfully";
// exports.sendLog(logData, "newDesigners");

// var logData = "New SignUp => Email: "+req.body.email+" / Password: "+req.body.password;
// exports.sendLog(logData, "signUp");

// var logData = "Error Refresh Product Url (Banggood PriceErr) => \n"+product.url;
// exports.sendLog(logData, "refreshErr");

// var logData = "Refresh System Done Successfully !";
// exports.sendLog(logData, "refreshLog");