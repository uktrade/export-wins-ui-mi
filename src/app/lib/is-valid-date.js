// modified from: https://www.qodo.co.uk/blog/javascript-checking-if-a-date-is-valid/
// Checks a string to see if it is a valid date

// format (YY)YY-M(M)-D(D)
const dateFormat = /^\d{1,4}[.|/|-]\d{1,2}[.|/|-]\d{1,2}$/;

module.exports = function isValidDate( s ){

	if( dateFormat.test( s ) ){
		// remove any leading zeros from date values
		s = s.replace( /0*(\d*)/gi, '$1' );

		const dateArray = s.split( /[.|/|-]/ );

		// correct month value
		dateArray[ 1 ] = dateArray[ 1 ] - 1;

		// correct year value
		if( dateArray[ 0 ].length < 4 ){
			// correct year value
			dateArray[ 0 ] = ( parseInt( dateArray[ 0 ], 10 ) < 50 ) ? 2000 + parseInt( dateArray[ 0 ], 10 ) : 1900 + parseInt( dateArray[ 0 ], 10 );
		}

		const testDate = new Date( dateArray[ 0 ], dateArray[ 1 ], dateArray[ 2 ] );

		if( testDate.getFullYear() != dateArray[ 0 ] || testDate.getMonth() != dateArray[ 1 ] || testDate.getDate() != dateArray[ 2 ] ){

			return false;

		} else {

			return true;
		}

	} else {

		return false;
	}
};
