module.exports = function( req, res, next ){

	if( req.cookies.sessionid ){

		next();

	} else {

		res.redirect( '/login/' );
	}
};
