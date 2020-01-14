function formatNumber( num, zeros, suffix ){

	const outNum = Number( ( num / zeros ).toFixed( 2 ) );

	return ( outNum + suffix );
}

module.exports = function( num ){

	if( typeof num === 'undefined' || isNaN( num ) ){ return null; }

	const absValue = Math.abs( num );

	// Nine zeroes for billions
	if( absValue >= 1.0e+9 ){

		num = formatNumber( num, 1.0e+9, 'b' );

	// 6 zeros for millions
	} else if( absValue >= 1.0e+6 ) {

		num = formatNumber( num, 1.0e+6, 'm' );

	// otherwise show with commas
	} else {

		// Number() now supports signed zeroes so minus zero (-0) will render as "-0" unless we do this:
		if ( absValue === 0 ) {

			num = 0;

		}

		num = Number( num ).toLocaleString( 'en-GB' );
	}

	return num;
};
