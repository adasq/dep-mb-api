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


// promise.then(function(adam){
//     if(adam){      

//     }else{
//       console.log("no exists")
//     }
// }, function(){
//   console.log("err db");
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
var trooperConfig = {
  domain: "com",
  opponent: "nopls",
  name: "aaaa",
//  pass: "nowehaslo"
};

var trooper = new Trooper(trooperConfig);
//trooper.auth().then(function(resposne){
//
  // var promise = trooper.getTrooperSkillList(0);
  // promise.then(function(skillList){ 
  //   console.log(skillList);
  // });

// var promise = trooper.upgrade(1);
// promise.then(function(result){
//  console.log(result,  CookieMessages.upgrade[result]);

// var promise = trooper.getTrooperUpgradeSkillList(1);
// promise.then(function(skillList){ 
//  console.log(skillList);
// });


// });


// var startDate = +new Date();
// setInterval(function(){
//   var promise = trooper.getTrooperSkillList(0);
//   promise.then(function(skillList){ 
//     console.log(_.pluck(skillList.skills, 'title'));
//     var secs = ((+new Date()) - startDate)/1000;
    
//     console.log(secs);
//   });
 
// }, 5*1000);
//});


 
// var generateArmyList = function(trooperConfig){
//   var armyPromise = q.defer();
//   var currentTrooper = new Trooper(trooperConfig); 
//   var promise = currentTrooper.auth();
//   promise.then(function(res){  
//         var promise = currentTrooper.getArmyList();
//         promise.then(armyPromise.resolve, armyPromise.reject);  
//   }, function(){
//     armyPromise.reject('33333333333333333333');
//   }); 
//   return armyPromise.promise;
// };

// var test = {name: trooperConfig.name, children: []};
//  var list = 0;
//  var troopersFamily = {};
//  var finish = function(){
//   console.log(JSON.stringify(test));
//  };


// var generate = function(trooperConfig, test){
//   //++list;
//   var p = generateArmyList(trooperConfig);  
//   p.then(function(armyList){
//      // --list;
//  // if(list === 1){
//  //  finish();
//  // }
//         list+=armyList.length;
//         _.each(armyList, function(army){
//           var armyObject = {name: army.name, children: [] };      
//           if(troopersFamily[trooperConfig.name]){
//             troopersFamily[trooperConfig.name].push(army.name);
//           }else{
//             troopersFamily[trooperConfig.name]= [army.name];
//           }
//           test.children.push(armyObject);
//           // console.log(army.name +" child of "+trooperConfig.name);          
//           generate({name: army.name, domain: "com",  opponent: "nopls"}, armyObject);
//         });        
        
//   }, function(){
//      //--list; 
//  //     if(list === 1){
//  //  finish();
//  // }
//   });  

// };


// generate(trooperConfig, test);













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