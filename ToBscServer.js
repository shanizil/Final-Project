const   express    = require('express'),
        cors=require('cors'),
        path = require('path'),
        url = require('url'),
        bodyParser = require('body-parser'),
        schedule = require('node-schedule'),
        fs = require('fs'),
        userList  = require('./usersController'),
        questionController  = require('./expertController'),
        chatController  = require('./chatController'),
        crawlerController= require('./crawlerController'),
        collegesController= require('./collegesController'),
        scholarshipsController=require('./scholarshipsController'),
        subEngController= require('./subEngController'),
        request    = require('request'),
        Crawler = require("crawler"),
        port       = process.env.PORT || 3000,
        app        = express();
      

let engineeringArray=[];

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));   //For parsing POST requests
app.use(cors({origin: '*'}));


app.set('port',port);
app.use('/', express.static('./public'));
// app.use(
//     (req,res,next) => {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers",
//             "Origin, X-Requested-With, Content-Type, Accept");
//         next();
//     });

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});

app.get('/', (req, res) => {
   res.sendFile(`${__dirname}/index.html`);
 });

app.get('/getAllData',
   (req,res)=>{
      userList.allusers().then(docs => res.json(docs));
});


app.post('/login', userList.login);

app.post('/createNewAccount', userList.createUser);

app.post('/createNewQuestion', questionController.createQuestion);

app.post('/updateQuestion',questionController.updateQuestion);

app.post('/deleteQuestion',questionController.deleteQuestion);

app.post('/filterColleges',collegesController.filterColleges);

app.post('/forgotPassword',userList.forgotPassword);

app.post('/favoriteColleges',collegesController.favoriteColleges);

app.post('/rateColleges',collegesController.rateColleges);

app.post('/unFavoriteColleges',collegesController.unFavoriteColleges);

app.get('/getFavoriteUserId/:_id',collegesController.getFavoriteUserId);



app.get('/getAllQuestions',
     (req,res)=>{
      questionController.allQuestion().then(docs => res.json(docs));
});


app.get('/getAllChat',
   (req,res)=>{
      chatController.allQuestion().then(docs => res.json(docs));
});
app.get('/getAllScholarships',
   (req,res)=>{
      scholarshipsController.getAllScholarships().then(docs => res.json(docs));
});

app.post('/filterScholarships',scholarshipsController.filterScholarships);

// app.get('/getAllInstitutes',
//      (req,res)=>{
//       institutesController.getAllInstitutes().then(docs => res.json(docs));
// });

app.get('/getAllSubEng',
     (req,res)=>{
      subEngController.getAllSubEng().then(docs => res.json(docs));
});

app.get('/getQuestion/:idNum', chatController.getQuestionById);
app.post('/getUserSubEngById' , chatController.getUserSubEngById);
app.post('/createSubEngByUserOrReturn', chatController.createSubEngByUserOrReturn);

app.post('/updateSubEngWeights', chatController.updateSubEngWeights); 

app.get('/calculateSubEngByUser/:userID/:answers/(:softwareArr)/(:chemistryArr)/(:electronicArr)/(:medicalArr)/(:managementArr)/(:buildingArr)/(:machineArr)', chatController.calculateSubEng);



//app.get('/getCrawler',crawlerController.getCrawler);
app.get('/getAllColleges',
     (req,res)=>{
      crawlerController.getAllColleges().then(docs => res.json(docs));
});

app.get('/getCollegesData', crawlerController.getCollegesData);

// Automatic Get Rates - (Scheduler - 6:30-AM)
var getRatesRule = new schedule.RecurrenceRule();
getRatesRule.hour = 09;
getRatesRule.minute = 13
var i = schedule.scheduleJob(getRatesRule, function(){
    console.log('Automatic Schedule: Get Colleges Data Started !');
    crawlerController.getCollegesData();
});

app.get('/getAllDepartments',
     (req,res)=>{
      crawlerController.getAllDepartments().then(docs => res.json(docs));
});
// Schedule Routes (manual)
app.get('/getDepartmentsData', crawlerController.getDepartmentsData);

// Automatic Get Rates - (Scheduler - 6:30-AM)
var getRatesRule = new schedule.RecurrenceRule();
getRatesRule.hour = 09
getRatesRule.minute = 15 
var i = schedule.scheduleJob(getRatesRule, function(){
    console.log('Automatic Schedule: Get Departments Data Started !');
    crawlerController.getDepartmentsData();
});


app.listen(port,
    () => {
        console.log(`listening on port ${port}`);
    });
