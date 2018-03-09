const getCeil = require( './get-ceil' );
const closestGreaterInteger = require( './closest-greatest-integer' );

module.exports = function( num, points = 5, ceilTo = [ 0, 0.25 ] ){

	const integerLimit = ( points * 10 );
	let ceil;

	if( num > 1 && num < integerLimit ){

		ceil = closestGreaterInteger( num, points );

	} else {

		ceil = getCeil( num, ceilTo );
	}

	const parts = ( ceil / points );
	const scale = [ 0, parts ];

	for( let i = 2; i < points; i++ ){

		scale.push( parts * i );
	}

	scale.push( ceil );

	return scale;
};
