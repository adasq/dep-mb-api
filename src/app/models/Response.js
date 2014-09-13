
var SuccessResponse = function(data){
	return {error: false, response: data};
};
 
var ErrorResponse = function(reason){
	return {error: true, reason: reason};
};

module.exports = {
 success: SuccessResponse,
 error: ErrorResponse
};