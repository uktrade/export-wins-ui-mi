const urls = require( '../lib/urls' );
const financialYear = require( '../lib/financial-year' );

module.exports = function( env ){

	//this must be called after the year middleware as we don't want the year in the URL
	return function( req, res, next ){

		env.addGlobal( 'urls', urls( req ) );
		env.addGlobal( 'currentFy', financialYear.getCurrent() );
		env.addGlobal( 'selectedYear', Number( req.year ) );

		next();
	};
};
