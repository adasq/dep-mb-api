var nodemailer = require('nodemailer'),
q = require('q');

var AUTH= {
        user: 'minibottersofficial@gmail.com',
        pass: ''
    };

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: AUTH
});

var MailManager = {};

MailManager.send = function(mailOptions){ 
	var defer = q.defer();
	transporter.sendMail(mailOptions, function(error, info){
    if(error){
    	console.log("send mail ERROR", error);
        defer.reject([]);
    }else{    	
    	if(info.rejected.length === 0){
    			console.log("SENDING_SUCCESS");
    			defer.resolve();
    	}else{
    		console.log("send mail ERROR2", info.rejected);
    		defer.reject(info.rejected);
    	}
    	
    }
	});
	return defer.promise;
};


module.exports = MailManager;