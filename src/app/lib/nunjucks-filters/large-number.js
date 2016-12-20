
module.exports = function( num ){

	// Nine Zeroes for Billions
	if( Math.abs( num ) >= 1.0e+9 ){

		num = ( ( num / 1.0e+9 ) + "b" );

	// Six Zeroes for Millions 
	} else /*if( Math.abs(num) >= 1.0e+6 )*/{
		
		num = ( Number( ( num / 1.0e+6 ).toFixed( 2 ) ) + "m" );
	}

	return num;
};
