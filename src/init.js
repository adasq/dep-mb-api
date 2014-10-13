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
db = require('./app/db/connect'),
bodyParser = require('body-parser');

var MongoStore = require('connect-mongo')(express);





// var mailOptions = {
//     from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
//     to: 'asnaebaem@gmail.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world ✔', // plaintext body
//     html: '<b>Hello world ✔</b>' // html body
// };

// var promise =  MailManager.send(mailOptions);
// promise.then(function(){
//     console.log("sent!");
// }, function(resposne){
//     console.log("ERR", resposne);
// });

// var adam = new User({name: "adam3", pass: "wsff"});
// var promise = adam.save();
// promise.then(function(result){
//   console.log("success", result);
// }, function(){
//   console.log("err");
// });

 
// db.User.findOne({name: "yebieoll"}, function(err, model){ 
//      db.User.update( { _id: model._id}, { $set: { "trooperLists.0" : {troopers: [{name: "xd2", pass:"xd2"}] }} }, function(err, model){
//       console.log(err, model)
//      } )
// });



// db.User.findOne({name: "yebieoll"}, function(err, model){ 
//      db.User.update( { _id: model._id}, { $set: { "trooperLists.0" : {troopers: [{name: "xd2", pass:"xd2"}] }} }, function(err, model){
//       console.log(err, model)
//      } )
// });





// db.User.findOne({name: "yebieoll"}, function(err, model){ 
//      db.User.update( { _id: model._id}, { $set: { "trooperLists.0.troopers" : [{name: "xd112", pass:"xd112"}] } }, function(err, model){
//       console.log(err, model)
//      } )
// });




i18n.configure({
    locales: config.i18n.locales,
    defaultLocale: config.i18n.defaultLocale,
    cookie: config.i18n.cookieName,
    directory: __dirname + '/app/lang'
});


//CONFIG ===========================================
var app = express(); 
  app.use(express.cookieParser()); 
  app.use(i18n.init);
  app.use(express.json());

   app.use(express.session({
  store: new MongoStore({
    url: "mongodb://localhost/forum"
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


 //SELECT * FROM User WHERE (h = 358626989) FOR UPDATE Deadlock found when trying to get lock; try restarting transaction


// app.get('/test', function(req, res){ 
//   res.cookie(config.i18n.cookieName, 'pl_PL');
// console.log(res.__('hello')); 
 

// var trooperConfig = {
//   domain: "com",
//   opponent: "nopls",
//   name: "ziemniaki3"
// };

// var trooper = new Trooper(trooperConfig);
  
// 	trooper.auth().then(function(result){
// 		console.log("[AUTH]", result.code, result.message);

// 		trooper.getArmyList().then(function(armyList){		 
// 			res.send(armyList);
// 		});
// 	});  
// });




//===========================================



var getReportByTrooperConfig = function(trooperConfig){
  var deferred = q.defer();
  var resultReport = {
    time: {
      start: +new Date(),
      end: null
    },
    fights: {
      battle: [],
      mission: [],
      raid: []
    },
    skills: [],
    money: [],
    needToUpgrade: [],
    upgrade: {
      isAvailable: false,
      skills: []
    }
  };

var trooper = new Trooper(trooperConfig);
trooper.auth().then(function(authResponse){
  if(authResponse.code !== 201){
    deferred.reject();
  }
   var fightPromises = [trooper.makeBattles(), trooper.makeMissions(), trooper.makeRaids()];
   var fightPromise = q.all(fightPromises);
   fightPromise.then(function(fightResponse){ 
                  resultReport.fights.battle = fightResponse[0];
                  resultReport.fights.mission = fightResponse[1];
                  resultReport.fights.raid = fightResponse[2];
                  trooper.getTrooperSkillList(0).then(function(trooperInfo){          
                    resultReport.skills = trooperInfo.skills;
                    resultReport.money = trooperInfo.money;
                    resultReport.needToUpgrade = trooperInfo.needToUpgrade;
                    var upgradePromise = trooper.upgrade(0);
                    upgradePromise.then(function(result){                    
                       if(result === 501){                        
                          resultReport.upgrade.isAvailable = true;
                           var promise = trooper.getTrooperUpgradeSkillList(0);
                           promise.then(function(upgradeSkillList){                      
                           resultReport.upgrade.skills = upgradeSkillList;
                           resultReport.time.end = +new Date(); 
                           deferred.resolve(resultReport);
                          });
                       }else{
                          resultReport.time.end = +new Date();
                          deferred.resolve(resultReport);                 
                       }
                    });
                  });
                });
 });
return deferred.promise;
};


var handleDaily = function(){
  User.getUsers().then(function(users){
      var listData = {          
        _creator: users[0]._id
      };
    db.TrooperList.find(listData, function(err, lists){
      if(!err && lists){
        var list = _.find(lists, function(list){
          return (list.name === "newTable");
        });
     

        var promises = _.map(list.troopers, function(trooperInfo){
                var trooperConfig = {
                  domain: "com",
                  opponent: "nopls",
                  name: trooperInfo.name
                };
                return getReportByTrooperConfig(trooperConfig);
             });
       q.all(promises).then(function(results){         
            var trooperReportsArray = _.map(results, function(result){
                return {report: JSON.stringify(result)}; 
            });
              console.log(trooperReportsArray);
             var user = new db.TrooperListReport({_creator: list._id, trooperReports: trooperReportsArray});
                user.save(function(err, model){
                  console.log(err, model)
                });

        },function(){
        });
      }else{
      }      
    });

});
};
  
//handleDaily();
  db.TrooperListReport.find().exec(function(err, resp){
    var report = resp[0].trooperReports[0];
    var obj = JSON.parse(report.report);
    console.log(obj)
  })


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