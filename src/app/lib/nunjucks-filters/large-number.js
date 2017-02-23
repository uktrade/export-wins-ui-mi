
function formatNumber( num, zeros, suffix, wrappedUnit ){

	const outNum = Number( ( num / zeros ).toFixed( 2 ) );

	if( wrappedUnit ){

		return ( outNum + '<span class="unit-marker">' + suffix + '</span>' );

	} else {

		return ( outNum + suffix );
	}
}

module.exports = function( num, wrappedUnit ){

	// Nine Zeroes for Billions
	if( Math.abs( num ) >= 1.0e+9 ){

		num = formatNumber( num, 1.0e+9, 'b', wrappedUnit );

	// Six Zeroes for Millions 
	} else /*if( Math.abs(num) >= 1.0e+6 )*/{
		
		num = formatNumber( num, 1.0e+6, 'm', wrappedUnit );
	}

	return num;
};
