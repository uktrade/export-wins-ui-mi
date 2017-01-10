
function formatNumber( num, zeros, suffix ){

	return ( Number( ( num / zeros ).toFixed( 2 ) ) + suffix );
}

module.exports = function( num ){

	// Nine Zeroes for Billions
	if( Math.abs( num ) >= 1.0e+9 ){

		num = formatNumber( num, 1.0e+9, 'b' );

	// Six Zeroes for Millions 
	} else /*if( Math.abs(num) >= 1.0e+6 )*/{
		
		num = formatNumber( num, 1.0e+6, 'm' );
	}

	return num;
};
