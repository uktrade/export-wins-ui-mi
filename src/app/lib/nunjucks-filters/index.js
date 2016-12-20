const days = require( './days' );
const largeNumber = require( './large-number' );

module.exports = function( env ){

	env.addFilter( 'largeNumber', largeNumber );
	env.addFilter( 'days', days );
};
