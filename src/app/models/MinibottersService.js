var
q = require('q'),
Trooper =  require('../../libmb/Trooper'), 
TrooperReport = require("./TrooperReport"),
ListReport = require("./ListReport"),
skills =  require('../../libmb/skills'), 
_ = require('underscore');

var MinibottersService = {
//--------------------------------------------------------------------------------------
generateTrooperReportByTrooperConfig: function(trooperConfig){
 
  var deferred = q.defer();
  var resultReport = new TrooperReport();
  var trooper = new Trooper(_.clone(trooperConfig));
trooper.auth2().then(function(authResponse){
   resultReport.data.authState = authResponse;

   var fightPromise = q.all([trooper.makeBattles(), trooper.makeMissions(), trooper.makeRaids()]);
   fightPromise.then(function(fightResponse){
                  //fights
                  resultReport.data.fights.battle = fightResponse[0];
                  resultReport.data.fights.mission = fightResponse[1];
                  resultReport.data.fights.raid = fightResponse[2];
                  //skills
                  trooper.getTrooperSkillList(0).then(function(trooperInfo){
                    //skill list          
                    //resultReport.data.skills = trooperInfo.skills;
                    resultReport.data.skills= _.map(trooperInfo.skills, function(skill){
                      return skills.getSkillByStyle(skill.style).skillId; 
                    });

                    resultReport.data.money = trooperInfo.money;
                    resultReport.data.needToUpgrade = trooperInfo.needToUpgrade;
                    //upgrading
                    var upgradePromise = trooper.upgrade(0);
                    upgradePromise.then(function(result){                    
                       if(result === 501){   
                            //get upgrade skills                     
                           var promise = trooper.getTrooperUpgradeSkillList(0);
                           promise.then(function(upgradeSkillList){                      
                           //resultReport.data.upgrade.skills = upgradeSkillList;
                           resultReport.data.upgrade.skills= _.map(upgradeSkillList, function(skill){  
                           var mbSkill= skills.getSkillByStyle(skill.style);
                            return { 
                                mbSkillId: mbSkill.skillId,                                
                                skillId: +skill.skillId
                            }; 
                          });
    					             resultReport.fill();
                           deferred.resolve(resultReport);
                          });
                       }else{
                       	  resultReport.fill();
                          deferred.resolve(resultReport);                 
                       }
                    });
                  });
                });
 }, function(authError){
  resultReport.data.authState = authError;
  resultReport.fill();
  deferred.resolve(resultReport); 
 });
return deferred.promise;
},
//--------------------------------------------------------------------------------------
saveReport: function(trooperReports, list){
    var deferred = q.defer();
    var listReport = new ListReport();
    listReport.data.handled = false;
    listReport.data.date = new Date();
    listReport.data._creator = list.data._id;
    listReport.data.trooperReports = trooperReports;	
     listReport.save().then(function(){
          console.log("saved!");
          deferred.resolve(listReport);
        }, function(e){
          console.log("not saved :[");
          deferred.reject(e);
        });
	return deferred.promise;
},
//--------------------------------------------------------------------------------------
generateReportByList: function(list){
var 
that = this;
listConfig = {
      raid: list.data.config.raid,
      opponent: list.data.config.opponent || 'nopls',
      mission: list.data.config.mission,
      battle: list.data.config.battle,
      upgrade: list.data.config.upgrade,
      domain: list.data.config.domain
  };
var troopersReportGenerationPromises = _.map(list.data.troopers, function(trooper){  
  var trooperConfig= _.extend({
    name: trooper.name,
    pass: trooper.pass
  }, listConfig);
  return (function(config){
    return (function(){
      return that.generateTrooperReportByTrooperConfig(config);
    })
  })(trooperConfig);
}); 

// troopersReportGenerationPromises[0]().then(function(x){
//   console.log(x.data)
//     troopersReportGenerationPromises[1]().then(function(xx){
//     console.log(xx.data)
//   })
// })

//  return;
   var reportsPromise = q.all( troopersReportGenerationPromises );
   reportsPromise.then(function(reports){
  //  console.log(reports);
      _.each(reports, function(report){
        console.log(report.data); 
        console.log('============================');
      });
   });

      // var trooperReports = [trooperReport.data];
      // that.saveReport(trooperReports, list).then(function(report){

      // });



}
//--------------------------------------------------------------------------------------


};

module.exports = MinibottersService;