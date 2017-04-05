const getCeil = require( './get-ceil' );
const ticks = 5;

module.exports = function( num ){

	const ceil = getCeil( num, [ 0, 0.25 ] );
	const parts = ( ceil / ticks );
	const scale = [ 0, parts ];

	for( let i = 2; i < ticks; i++ ){

		scale.push( parts * i );
	}

	scale.push( ceil );

	return scale;
};
