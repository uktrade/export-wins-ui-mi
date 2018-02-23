module.exports = function( env ){

	env.addFilter( 'largeNumber', require( './large-number' ) );
	env.addFilter( 'pluralise', require( './pluralise' ) );
	env.addFilter( 'piePercentage', require( './pie-percentage' ) );
	env.addFilter( 'tablePercentage', require( './table-percentage' ) );
	env.addFilter( 'dateOnly', require( './date-only' ) );
	env.addFilter( 'dateWithTime', require( './date-with-time' ) );
	env.addFilter( 'dateStamp', require( './date-stamp' ) );
	env.addFilter( 'timeOnly', require( './time-only' ) );
	env.addFilter( 'preciseNumber', require( './precise-number' ) );
};
