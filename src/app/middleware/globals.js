const urls = require( '../lib/urls' );

module.exports = function( env ){

	//this must be called after the year middleware as we don't want the year in the URL
	return function( req, res, next ){

		env.addGlobal( 'urls', urls( req ) );

		next();
	};
};
