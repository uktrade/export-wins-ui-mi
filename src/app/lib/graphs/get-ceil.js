//Taken from: https://gist.github.com/grabantot/803b809ee45cd635f240
//ceils an absolute value of the number 'num' (so negative 'num' gets floored instead of being ceiled)
//so that its coefficient 'm' while 'num' is represented in scientific notation (num = m*10^n)
//is either a multiple of one of some number from 'to' array
//or exactly matches one of the numbers in 'to' array
//numbers to match exactly should be negative in 'to' array (to differ them from multiples)

module.exports = function( num, to, bias ){ // for example num = -165.4621

	to = ( to || [ -2, 5 ] ); // to = [-2, 5] (beautiful values are: ...0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10...)
	bias = ( bias || 0 );	// bias = 0

	var mults = to.filter( function( value ){ return value > 0; } );	// mults = [5], m of the result should be eiter a multiple of 5
	to = to.filter( function( value ){ return value < 0; } ).map( Math.abs ); // to = [2], or match 2 exactly
	var numAbs = ( Math.abs( num ) - bias );	// numAbs = 165.4621
	var exp = Math.floor( Math.log10( numAbs ) ); // exp = 2
	var m = Math.abs( numAbs ) * Math.pow( 10, -exp );	// m = 1.654621 (numAbs = 1.654621 * 10^2)
	var mRounded = Infinity;	// mRounded = Infinity
	var i = 0;
	
	for( i = 0; i < mults.length; i++ ){	// ceil m to closest mult

		var candidate = mults[ i ] * Math.ceil( m / mults[ i ] ); // candidate = 5

		if( candidate < mRounded ){	// 5 < Infinity = true (candidate is closer to m than mRounded)
			mRounded = candidate; // so assing the candidate to  mRounded
		}
	}

	for( i = 0; i < to.length; i++ ){	// now check if any of the exact matches are closer
		if( to[ i ] >= m && to[ i ] < mRounded ){	// 2 >= 1.654621 && 2 < 5 = true
			mRounded = to[ i ]; // so 2 is closer than 5
		}
	}

	return Math.round( Math.sign( num ) * mRounded * Math.pow( 10, exp ) + bias ); // rounded = -1 * 2 * 10^2 + 0 = 200
};
