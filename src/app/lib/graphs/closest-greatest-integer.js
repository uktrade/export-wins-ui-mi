module.exports = function closestGreatestInteger( a,  b ){

	if( a % b === 0 ){

		return a;

	} else {

		return ( a + b ) - ( a % b );
	}
};
