var request = require('request'),
_ = require('underscore'),
nodemailer = require('nodemailer'),
q = require('q'),
config = require('./app/config'),
URLManager = require('./libmb/URLManager'), 
Response = require('./libmb/Response'), 
Request = require('./libmb/Request'), 
CookieMessages= require('./libmb/CookieMessages'), 
CookieManager = require('./libmb/CookieManager'), 
PageParser =  require('./libmb/PageParser'), 
Trooper =  require('./libmb/Trooper'), 
cheerio = require('cheerio'), 
express = require('express'),
fs = require('fs'),
mongoose = require('mongoose'),
routesGET = require('./app/routes/get'),
routesPOST = require('./app/routes/post'),
uuid= require('node-uuid'),
crypto= require('crypto'),
Utils= require('./app/models/Utils'),
User= require('./app/models/User'),
MailManager= require('./app/models/MailManager'),
i18n = require("i18n"),
skills = require("./libmb/skills"),
ListReport = require("./app/models/ListReport"),
TrooperReport = require("./app/models/TrooperReport"),
List = require("./app/models/List"),
MinibottersService = require("./app/models/MinibottersService"),
db = require('./app/db/connect'),
bodyParser = require('body-parser');

var MongoStore = require('connect-mongo')(express);

i18n.configure({
    locales: config.i18n.locales,
    defaultLocale: config.i18n.defaultLocale,
    cookie: config.i18n.cookieName,
    directory: __dirname + '/app/lang'
});


// var listReport = new ListReport();
// listReport.data.handled = true;
// listReport.data.date = new Date();
// listReport.data._creator = null;
// listReport.save()
 
// var skill = skills.getSkillById(2);
// console.log(skill)

//var skill = skills.getSkillById(25);
//console.log(skill);


// var list = new List();
// list.data.name = "exampleName";
// list.data.troopers = [
// {name: "ziemniaki3", pass: ""},
// {name: "ziemniaki4", pass: ""},
// {name: "ziemniaki5", pass: ""},
// {name: "ziemniaki6", pass: ""},
// ];
// list.save().then(function(result){
//   console.log(result);
// }, function(result){
//   console.log('err',result);
// });


(new List()).getAll({_id: '544cd83c7329842408ba6658'}).then(function(lists){
  var list = lists[0];
  //console.log(list);
  MinibottersService.generateReportByList(list);
});

return;

//CONFIG ===========================================
var app = express(); 
  app.use(express.cookieParser()); 
  app.use(i18n.init);
  app.use(express.json());

   app.use(express.session({
  store: new MongoStore({
    url: "mongodb://localhost/mini-botters"
  }),
  secret: '1234567890QWERTY'
}));
  app.use(express.urlencoded()); 

  //__dirname + '/webapp' 
  app.use('/', express.static("c:/GIT/mb-ui/build"));

   app.use(function(req, res, next){  
      if(req.session.user){
        next();
      }else{
         next();
      }
      
   });

//ROUTES ===========================================
 
_.each(routesGET, function(route){
  app.get('/api'+route.url, route.callback);
});
_.each(routesPOST, function(route){
  app.post(route.url, route.callback);
});


app.listen(config.PORT);


//===========================================





// (new ListReport()).getAll().then(function(listReports){
//   console.log(listReports)
// })
// return;
var tcfg= { domain: "com", opponent: "nopls", name: "army3",
                //  pass: "xd"
}

MinibottersService.generateTrooperReportByTrooperConfig(tcfg)
.then(function(trooperReport){
    var trooperReports = [trooperReport.data];
    var trooperReportsPromise= MinibottersService.generateListReportByTrooperReports(trooperReports);
    trooperReportsPromise.then(function(listReport){
      console.log(listReport);
      listReport.data._creator = null;
      listReport.save().then(function(){
        console.log("saved!");
      }, function(){
        console.log("not saved :[");
      });
    });
});




 return;



var handleDaily = function(){
  User.getUsers().then(function(users){
      var listData = {          
        _creator: users[0]._id
      };
      console.log(users[0])
    db.TrooperList.find(listData, function(err, lists){
      if(!err && lists){
        var list = _.find(lists, function(list){
          return (list.name === "example");
        });
     

        var promises = _.map(list.troopers, function(trooperInfo){
                var trooperConfig = {
                  domain: "com",
                  opponent: "nopls",
                  name: trooperInfo.name
                };
                //return getReportByTrooperConfig(trooperConfig);
             });

       // q.all(promises).then(function(results){         
       //      var trooperReportsArray = _.map(results, function(result){
       //          return {report: JSON.stringify(result)}; 
       //      });
       //        console.log(trooperReportsArray);
       //       var user = new db.TrooperListReport({_creator: list._id, trooperReports: trooperReportsArray});
       //          user.save(function(err, model){
       //            console.log(err, model)
       //          });

       //  },function(){
       //  });
      }else{
      }      
    });

});
};
  //handleDaily();
//handleDaily();
  // db.TrooperListReport.find().exec(function(err, resp){
  //   var report = resp[0].trooperReports[0];
  //   var obj = JSON.parse(report.report);
  //   console.log(obj)
  // })


//handleDaily();


//   var ao= { cookie: 
//   'ssid=f6b93a871ac91f2c4a60ae5e7880a850oy3:keyy6:dUBeR0y9:lastCheckd1413130881000y13:notificationslhg',
//   chk: 'qVqjXu' }
// console.log(ao)
 



//===========================================


 

 

// var trooper = new Trooper(trooperConfig);
// var promise = trooper.generateTrooperFamily();
// promise.then(function(trooperFamily){
//   console.log(JSON.stringify(trooperFamily))
// })







// var army = {name: trooperConfig.name, children: []};
// generateArmyFamily(trooperConfig, army).then(function(r){
//   console.log("!!!!!!!!!!!!", army);
// }, function(){
//   console.log('eh')
// })




// .then(function(a){
// }); 

// var promise = trooper.auth();
// promise.then(function(result){
// console.log("[AUTH]", result.code, result.message);
//  //============================  YOUR ARMY ======================

// var promise = trooper.getArmyList();
// promise.then(function(armyList){
//   _.each(armyList, function(army){     
//        var trooperX = new Trooper({name: army.name,  domain: "com", opponent: "nopls"});
//        var promise = trooperX.auth();
//        promise.then(function(){
//            var promise = trooperX.getArmyList();
//            promise.then(function(army2){
//               console.log(army2);
//            });
//        })
      
       
//   });



// }); 

//============================ PARSE DATA ======================
//get trooper skills, money and amount needed to upgrade
// var promise = trooper.getTrooperSkillList(1);
// promise.then(function(skillList){ 
// 	console.log(skillList);
// });

//get trooper upgrade skills to select
// var promise = trooper.getTrooperUpgradeSkillList(0);
// promise.then(function(skillList){ 
// 	console.log(skillList);
// });

//============================ FIGHT ======================

// 	var promise= trooper.makeMissions();
//  	promise.then(function(resp){
// 	  console.log("makeMissions ",resp);	  
// 	});

// var promise= trooper.makeBattles();
//  	promise.then(function(resp){
// 	  console.log("makeBattles", resp);	  
// 	});

// var promise= trooper.makeRaids();
//  	promise.then(function(resp){
// 	  console.log("makeRaids", resp);	  
// });

//============================ UPGRADE ======================

//upgrade specific trooper
// var promise = trooper.upgrade(1);
// promise.then(function(result){
// 	console.log(result,  CookieMessages.upgrade[result]);
// });

//select upgraded skill selectSkill(trooper, skill)
// var promise = trooper.selectSkill(2, 101);
// promise.then(function(result){
//  console.log(result, CookieMessages.skillSelection[result]);
// });



//===============================================================
//});

// var configs = [
// {
//   domain: "com",
//   opponent: "nopls",
//   desc: "not loadable page of existing trooper",
//   name: "aaa..",
//   pass: "xd"
// },
// {
//   domain: "com",
//   opponent: "nopls",
//   desc: "not loadable page of existing trooper w/o pass",
//   name: "aaa..",
//  // pass: "xd"
// },
// {
//   domain: "com",
//   opponent: "nopls",
//   desc: "not loadable page of NOT EXISTING trooper",
//   name: "aaaaa..",
//   pass: "xd"
// },
// {
//   domain: "com",
//   desc: "not loadable page of NOT EXISTING trooper w/o pass",
//   opponent: "nopls",
//   name: "aaaaa..",
//  // pass: "xd"
// },
// {
//   domain: "com",
//   desc: "protected trooper with not set password",
//   opponent: "nopls",
//   name: "ziemniaki",
//  // pass: "xd"
// },
// {
//   domain: "com",
//   desc: "protected trooper with set WRONG password",
//   opponent: "nopls",
//   name: "ziemniaki",
//   pass: "nowehaslo2"
// },
// {
//   domain: "com",
//   desc: "protected trooper with set VALID password",
//   opponent: "nopls",
//   name: "ziemniaki",
//   pass: "nowehaslo"
// },
// {
//   domain: "com",
//   desc: "NOT PROTECTED trooper with password",
//   opponent: "nopls",
//   name: "ziemniaki3",
//   pass: "aaaaa"
// },
// {
//   domain: "com",
//   desc: "NOT PROTECTED trooper w/o password",
//   opponent: "nopls",
//   name: "ziemniaki3",
//   //pass: "aaaa"
// },
// ];