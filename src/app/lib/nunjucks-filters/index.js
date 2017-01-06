const pluralise = require( './pluralise' );
const largeNumber = require( './large-number' );

module.exports = function( env ){

	env.addFilter( 'largeNumber', largeNumber );
	env.addFilter( 'pluralise', pluralise );
};
