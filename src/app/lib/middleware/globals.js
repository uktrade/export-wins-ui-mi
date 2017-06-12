module.exports = function( env ){

	//this must be called after the year middleware as we don't want the year in the URL
	return function( req, res, next ){

		const basePrefix = '';
		let prefix = basePrefix;

		if( !req.isDefaultYear ){

			prefix += `/${ req.year }`;
		}

		env.addGlobal( 'urlPrefix', prefix );
		env.addGlobal( 'baseUrlPrefix', basePrefix );
		env.addGlobal( 'currentUrl', req.url );

		next();
	};
};
