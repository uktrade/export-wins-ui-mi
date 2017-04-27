const urlYear = /^\/([0-9]{4})\//;

module.exports = function( req, res, next ){

	const matches = urlYear.exec( req.url );

	if( matches && matches.length > 1 ){

		const year = matches[ 1 ];

		req.year = year;
		req.isCurrentYear = false;
		req.url = req.url.substr( 5 );

	} else {

		const today = new Date();

		let year = today.getFullYear();

		//if month is Jan/Feb/March then set year to previous year
		//as financial year is 1st April to 31st March
		if( today.getMonth() < 3 ){

			year = ( year - 1 );
		}

		req.year = String( year );
		req.isCurrentYear = true;
	}

	res.locals.currentYear = Number( req.year );

	next();
};
