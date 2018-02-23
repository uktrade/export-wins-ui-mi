function formatNumber( num, zeros, suffix ){

	const outNum = Number( ( num / zeros ).toFixed( 2 ) );

	return ( outNum + suffix );
}

module.exports = function( num ){

	const absValue = Math.abs( num );

	// Nine zeroes for billions
	if( absValue >= 1.0e+9 ){

		num = formatNumber( num, 1.0e+9, 'b' );

	// 6 zeros for millions
	} else if( absValue >= 1.0e+6 ) {

		num = formatNumber( num, 1.0e+6, 'm' );

	// otherwise show with commas
	} else {

		num = Number( num ).toLocaleString( 'en-GB' );
	}

	return num;
};
