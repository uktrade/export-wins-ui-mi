const config = require( '../../config' );

module.exports = function( req, res, next ){

	res.locals.feedbackEmail = config.feedbackEmail;
	next();
};
