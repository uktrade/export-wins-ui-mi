module.exports = function( req, res, next ){

	const path = req.query.path;

	if( path && !path.startsWith( '//' ) && path.startsWith( '/' ) ){

		req.returnPath = path;
		res.locals.returnPath = path;
	}

	next();
};
