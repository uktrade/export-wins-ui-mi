module.exports = function( req, res, next ){

	const linkHvc = req.query.linkHvc;

	if( typeof linkHvc !== 'undefined' ){

		res.locals.linkHvc = linkHvc;
	}

	next();
};
