var db = require('../db/connect'),
User= require('../models/User'),
_ = require('underscore'),
q = require('q'),
Response= require('../models/Response'),
Trooper =  require('../../libmb/Trooper'),
CookieMessages =  require('../../libmb/CookieMessages'),
Enums= require('../models/Enums');


var successResponse = Response.success;
var errorResponse = Response.error;

var routes = [];
//========================================================================================
routes.push({
	url: "/register",
	callback: function(req, res){
  var post_data = req.body;
  var name = post_data.name;
  var mail = post_data.mail;
  var pass = post_data.pass;

      var newUser = new User({name: name, pass: pass, mail: mail});
      var promise = newUser.save();
      promise.then(function(){
        res.send({error: false, response: {}});
      }, function(response){
        var msg = "Błąd pdoczas rejestracji";        
        if(response.errors.name){     
           msg= "Użytkownik już istnieje";                 
        }else if(response.errors.mail){
            msg= "Adres mail jest już zajęty";
        }else{}
        res.send({error: true, reason: {msg: msg}});       
      });
		}
});
//========================================================================================
routes.push({
  url: "/createList",
  callback: function(req, res){
      var post_data = req.body;
var trooperConfig = {
  domain: "com",
  opponent: "nopls",
  name: "",
};
      var promises = _.map(post_data.troopers, function(trooper){        
        trooper.session = {
          chk: "chk",
          cookie: "cookie"
        };
        var tc = _.clone(trooperConfig);
        tc.name = trooper.name;
        var t = new Trooper(tc);
        return t.auth();
      });

      q.all(promises).then(function(resp){
        console.log("!"+JSON.stringify(resp))
      });

      var newListData = {
        _creator: req.session.user.data._id,
        name: post_data.name,
        troopers: post_data.troopers
      };
    db.TrooperList(newListData).save(function(err, model){
       if(err){
        console.log(err)
   res.send(errorResponse('creating failed!'));
  }else{
   res.send(successResponse({}));
  }      
    });
    }
});
//========================================================================================
routes.push({
  url: "/updateList",
  callback: function(req, res){
      var post_data = req.body;

      var listData = {
        _id: post_data._id,
        _creator: post_data._creator,
        name: post_data.name,
        troopers: post_data.troopers
      };


var trooperConfig = {
  domain: "com",
  opponent: "nopls",
  name: "",
};
      var promises = _.map(post_data.troopers, function(trooper){        
        trooper.session = {
          chk: "chk",
          cookie: "cookie"
        };
        var tc = _.clone(trooperConfig);
        tc.name = trooper.name;
        var t = new Trooper(tc);
        return t.auth();
      });
      q.all(promises).then(function(authResponses){
        
        _.each(authResponses, function(ar, i){ 
          console.log(ar.ao);
          listData.troopers[i].session= ar.ao;
        });

        db.TrooperList.update({_id: listData._id, _creator: req.session.user.data._id}, {
                  name: post_data.name,
                  troopers: post_data.troopers
        }, function(err, numberAffected, rawResponse) {  
          if(err){
           res.send(errorResponse('updating failed!'));
          }else{ 
           delete req.session.lists[listData.name];
           res.send(successResponse({}));
          }
        });


      });







    }
});
//========================================================================================
routes.push({
  url: "/getList",
  callback: function(req, res){
      var post_data = req.body;
      var listData = {       
        name: post_data.name,
        _creator: req.session.user.data._id
      };

      req.session.lists = req.session.lists || {};          
  
      if(req.session.lists[listData.name]){
        res.send(successResponse(req.session.lists[listData.name]));
      }else{
        db.TrooperList.findOne(listData, function(err, model){
      if(!err && model){        
        req.session.lists[listData.name]= model; 
        res.send(successResponse(model));       

      }else{
         res.send(errorResponse("problem? :D"));
      }      
      });

      } 

    }
});
//========================================================================================
routes.push({
  url: "/play",
  callback: function(req, res){
      var post_data = req.body;
        
      var listName= post_data.lname;
      var trooperId= post_data.tid;
   
      req.session.lists = req.session.lists || {};     
      if(req.session.lists[listName]){
         var list = req.session.lists[listName];
         var trooper= _.find(list.troopers, function(trooper){
            return trooper._id == trooperId;
         }); 

        var trooperConfig = {
          domain: "com",
          opponent: "nopls",
          name: trooper.name
        };
        if(trooper.pass){
          trooperConfig.pass= trooper.pass;        
        }

        trooper = new Trooper(trooperConfig);  
         trooper.auth().then(function(result){
           if(result.code === 201){
            var fightPromises = [trooper.makeBattles(), 
                trooper.makeMissions(),
                trooper.makeRaids()];
                var fightPromise = q.all(fightPromises);
                fightPromise.then(function(fightResponse){ 
                    var promise = trooper.getTrooperSkillList(0);
                    promise.then(function(skillList){                     
                    //-----------------------------------------
                    var promise = trooper.upgrade(0);
                    promise.then(function(result){
                      _.each(skillList.skills, function(skill){
                            skill.style = skill.style.replace("url('/img/", "url('/assets/");
                        });
                     if(result === 501){
                      console.log('upgrade availavle');
                         var promise = trooper.getTrooperUpgradeSkillList(0);
                         promise.then(function(upgradeSkillList){
                         res.send(successResponse({fight: fightResponse, skills: skillList, upgrade: upgradeSkillList}));
                        });
                     }else{
                        console.log('upgrade NOT availavle');
                      res.send(successResponse({fight: fightResponse, skills: skillList}));
                     }
                    });
                  //-----------------------------------------------------
                  });



                });
        

           }else{
            res.send(errorResponse(result.message));
           }
        });


      }else{
        res.send(errorResponse('i dont know wtf wrong'));
      }   
     // res.send(req.session.lists[listData.name]);
 

    }
});
//========================================================================================
routes.push({
  url: "/chooseSkill",
  callback: function(req, res){
      var post_data = req.body;        
      var listName= post_data.lname;
      var trooperId= post_data.tid;
      var skillId= +post_data.skillId;
   
      req.session.lists = req.session.lists || {};     
      if(req.session.lists[listName]){
         var list = req.session.lists[listName];
         var trooper= _.find(list.troopers, function(trooper){
            return trooper._id == trooperId;
         }); 

        var trooperConfig = {
          domain: "com",
          opponent: "nopls",
          name: trooper.name
        };
         if(trooper.pass){
          trooperConfig.pass= trooper.pass;        
        }
        
        trooper = new Trooper(trooperConfig);  
         trooper.auth().then(function(result){
           if(result.code === 201){         
              var promise = trooper.selectSkill(0, skillId);
              promise.then(function(result){                
                if(result === '*'){                     
                    res.send(successResponse({result:result}));
                }else{
                  console.log("nie wchodzi");
                    res.send(errorResponse(CookieMessages.skillSelection[result]));
                } 
              });

           }else{
            res.send(errorResponse('wrong auth data'));
           }
        });


      }else{
        res.send(errorResponse('LIPA'));
      }   
     // res.send(req.session.lists[listData.name]);
 

    }
});
//========================================================================================
routes.push({
  url: "/getLists",
  callback: function(req, res){
      var listData = {          
        _creator: req.session.user.data._id
      };
    db.TrooperList.find(listData, function(err, model){
      if(!err && model){
        res.send(successResponse(model));
      }else{
         res.send(errorResponse("problem? :D"));
      }      
    });
    }
});
//========================================================================================
routes.push({
  url: "/login",
  callback: function(req, res){
      var post_data = req.body;
      var name = post_data.name;
      var pass = post_data.pass;
console.log(req.body, req.query, req.params, req.param('name'));
var promise = User.getUserByName(name);
promise.then(function(user){
    if(!user){
      res.send({error: true, reason: {msg: "User does not exists"}});     
    }else{    
      var isPassCorrect = (user.isPasswordCorrect(pass));
      var isActive = (user.data.state !== Enums.User.State.INACTIVE);
      if(isPassCorrect && isActive){

            req.session.user = user;
           
             res.send({error: false, response: {user: user}});    

      }else{
        res.send({error: true, reason: {msg: "pass or state not suitable"}});     
      }      
           
    }
}, function(){
  console.log("err db");
});
    }
});
//========================================================================================
routes.push({
  url: "/getUser",
  callback: function(req, res){
if(req.session.user){
  res.send({error: false, response: {user: req.session.user}});  
}else{
  res.send({error: true, reason: {msg: "not logged in"}});  
}  
}
});


routes.push({
  url: "/logout",
  callback: function(req, res){
        req.session.user = undefined;
        res.send({error: false, response: {user: req.session.user}});  
    
}
});
//========================================================================================
routes.push({
  url: "/generateList",
  callback: function(req, res){   
      var post_data = req.body;
      var name = post_data.name;
      var pass = post_data.pass;
var trooperConfig = {
  domain: "com",
  opponent: "nopls",
  name: name,
  pass: pass || undefined
};
var trooper = new Trooper(trooperConfig);
var promise = trooper.auth();
promise.then(function(result){
console.log("[AUTH]", result.code, result.message);
  var promise = trooper.getArmyList();
promise.then(function(armyList){
  res.send({error: false, response: {armyList: armyList}});
}); 
});  
}
});
//========================================================================================
routes.push({
  url: "/generateTrooperFamily",
  callback: function(req, res){   
      var post_data = req.body;
      var name = post_data.name;
      var pass = post_data.pass;

var trooperConfig = {
  domain: "com",
  opponent: "nopls",
  name: name,
  pass: pass || undefined
};


var trooper = new Trooper(trooperConfig);
var promise = trooper.generateTrooperFamily();
promise.then(function(trooperFamily){
  res.send({error: false, response: {trooperFamily: trooperFamily}});
})




}
});
//========================================================================================






module.exports = routes;