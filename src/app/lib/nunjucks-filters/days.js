module.exports = function( num ){

	num = Math.round( num );

	let suffix = 'days';

	if( num === 1 ){

		suffix = 'day';
	}

	return ( num + ' ' + suffix );
}
