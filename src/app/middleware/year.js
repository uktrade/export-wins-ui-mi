const financialYear = require( '../lib/financial-year' );
const urlYear = /^\/([0-9]{4})\//;

module.exports = function( req, res, next ){

	const matches = urlYear.exec( req.url );

	if( matches && matches.length > 1 ){

		const year = matches[ 1 ];

		req.year = year;
		req.isDefaultYear = false;
		req.url = req.url.substr( 5 );

	} else {

		const year = financialYear.getCurrent();

		req.year = String( year );
		req.isDefaultYear = true;
	}

	next();
};
