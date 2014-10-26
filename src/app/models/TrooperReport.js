

var TrooperReport = function() {
	this.data.time.start = new Date();

};

TrooperReport.UPGRADE = 0;
TrooperReport.AUTH_ISSUE = 1;
TrooperReport.DEFAULT = 2;

TrooperReport.prototype.fill = function(){
  this.data.time.end= new Date();
  if(this.data.upgrade.skills.length > 0){
    this.data.reportState= TrooperReport.UPGRADE;
    this.data.upgrade.isAvailable = true;
  }
  if(this.data.authState.code !== 201){
    this.data.reportState= TrooperReport.AUTH_ISSUE;    
  }  
};
TrooperReport.prototype.toString = function(){
  return JSON.stringify(this.data);
};
TrooperReport.prototype.data =  {
   authState: null,
   reportState: TrooperReport.DEFAULT,
   time: {
      start: null,
      end: null
    },
    fights: {
      battle: [],
      mission: [],
      raid: []
    },
    skills: [],
    money: 0,
    needToUpgrade: 0,
    upgrade: {
      isAvailable: false,
      skills: []
    }
  };



module.exports = TrooperReport;