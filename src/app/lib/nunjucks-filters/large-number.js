
function formatNumber( num, zeros, suffix, wrappedUnit ){

	const outNum = Number( ( num / zeros ).toFixed( 2 ) );

	if( wrappedUnit && suffix ){

		return ( outNum + '<span class="unit-marker">' + suffix + '</span>' );

	} else {

		return ( outNum + suffix );
	}
}

module.exports = function( num, wrappedUnit ){

	const absValue = Math.abs( num );

	// Nine zeroes for billions
	if( absValue >= 1.0e+9 ){

		num = formatNumber( num, 1.0e+9, 'b', wrappedUnit );

	// if greater than 0 and less than 10,000 show in k
	} else if( absValue > 0 && absValue < 1.0e+4 ) {

		if( absValue < 1.0e+3 ) {

			num = formatNumber( num, 1, '', wrappedUnit );

		} else {

			num = formatNumber( num, 1.0e+3, 'k', wrappedUnit );
		}

	// else show in millions
	} else {

		num = formatNumber( num, 1.0e+6, 'm', wrappedUnit );
	}

	return num;
};
