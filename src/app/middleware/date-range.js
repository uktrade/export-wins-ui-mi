module.exports = function( req, res, next ){

	const date = req.query.date;

	if( date ){

		const dateRange = {};

		req.filters = ( req.filters || {} );

		if( date.start ){

			dateRange.start = date.start;
			req.filters[ 'date[start]' ] = date.start;
		}

		if( date.end ){

			dateRange.end = date.end;
			req.filters[ 'date[end]' ] = date.end;
		}

		req.dateRange = dateRange;
	}

	next();
};
