const getCeil = require( './get-ceil' );
const ticks = 5;
const maxTicks = ( ticks * 10 );
const closestGreaterInteger = require( './closest-greatest-integer' );

module.exports = function( num ){

	let ceil;

	if( num > 1 && num < maxTicks ){

		ceil = closestGreaterInteger( num, ticks );

	} else {

		ceil = getCeil( num, [ 0, 0.25 ] );
	}

	const parts = ( ceil / ticks );
	const scale = [ 0, parts ];

	for( let i = 2; i < ticks; i++ ){

		scale.push( parts * i );
	}

	scale.push( ceil );

	return scale;
};
