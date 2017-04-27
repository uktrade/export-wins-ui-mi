module.exports = function( env ){

	return function( req, res, next ){

		const basePrefix = '';
		let prefix = basePrefix;

		if( !req.isCurrentYear ){

			prefix += `/${ req.year }`;
		}

		env.addGlobal( 'urlPrefix', prefix );
		env.addGlobal( 'baseUrlPrefix', basePrefix );

		next();
	};
};
