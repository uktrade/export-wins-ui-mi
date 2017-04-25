const config = require( '../../config' );

module.exports = function( env ){

	return function( req, res, next ){

		const basePrefix = `/${ config.server.uuid }`;
		let prefix = basePrefix;

		/* TODO: Add back
		if( !req.isCurrentYear ){

			prefix += `/${ req.year }`;
		}
		*/

		env.addGlobal( 'urlPrefix', prefix );
		env.addGlobal( 'baseUrlPrefix', basePrefix );

		next();
	};
};
