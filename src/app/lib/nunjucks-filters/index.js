module.exports = function( env ){

	env.addFilter( 'largeNumber', require( './large-number' ) );
	env.addFilter( 'pluralise', require( './pluralise' ) );
	env.addFilter( 'piePercentage', require( './pie-percentage' ) );
	env.addFilter( 'tablePercentage', require( './table-percentage' ) );
};
